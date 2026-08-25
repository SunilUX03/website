import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

// Read side of the analytics pipeline — aggregation queries for the CMS
// Analytics dashboard (src/app/(frontend)/cms/(portal)/analytics/page.tsx).
// Raw SQL via Prisma (see api/analytics/track/route.ts for why: the
// `analytics_events` table isn't a Payload collection) against a fixed
// 30-day window — no date-range picker yet, kept simple for a first cut.
//
// "Time on page" and "bounce rate" aren't included here: both need a
// session boundary (when did one visit end and the next begin) that
// this pipeline doesn't track yet — a single pageview-count-based
// approximation would be more misleading than useful, so they're left
// out rather than faked.

// Prisma's tagged-template $queryRaw parameterizes every ${} as a bound
// value, which Postgres doesn't accept inside an `interval '... days'`
// literal — so this constant can't be interpolated into the queries
// below directly; each one hardcodes the same '30 days' literal instead.
// Change both together if this window ever needs to move.
const WINDOW_DAYS = 30;

type CountRow = { label: string | null; count: bigint };
type PathRow = { path: string | null; count: bigint };
type DayRow = { day: Date; count: bigint };

export type AnalyticsSummary = {
  windowDays: number;
  uniqueVisitors: number;
  totalPageviews: number;
  newVisitors: number;
  returningVisitors: number;
  deviceSplit: { device: string; count: number }[];
  localeSplit: { locale: string; count: number }[];
  trafficTrend: { day: string; count: number }[];
  topPages: { path: string; count: number }[];
  topClicks: { label: string; count: number }[];
  conversions: { label: string; count: number }[];
  accessibilityUsage: { label: string; count: number }[];
};

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const [
    uniqueVisitorsRows,
    totalPageviewsRows,
    newReturningRows,
    deviceRows,
    localeRows,
    trendRows,
    topPagesRows,
    topClicksRows,
    conversionRows,
    accessibilityRows,
  ] = await Promise.all([
    db.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT visitor_id) as count FROM analytics_events
      WHERE created_at >= now() - interval '30 days'
    `,
    db.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM analytics_events
      WHERE type = 'pageview' AND created_at >= now() - interval '30 days'
    `,
    db.$queryRaw<{ new_visitors: bigint; returning_visitors: bigint }[]>`
      WITH first_seen AS (
        SELECT visitor_id, MIN(created_at) as first_at FROM analytics_events GROUP BY visitor_id
      ),
      active AS (
        SELECT DISTINCT visitor_id FROM analytics_events WHERE created_at >= now() - interval '30 days'
      )
      SELECT
        COUNT(*) FILTER (WHERE fs.first_at >= now() - interval '30 days') as new_visitors,
        COUNT(*) FILTER (WHERE fs.first_at < now() - interval '30 days') as returning_visitors
      FROM first_seen fs
      JOIN active a ON a.visitor_id = fs.visitor_id
    `,
    db.$queryRaw<{ device: string | null; count: bigint }[]>`
      SELECT device, COUNT(DISTINCT visitor_id) as count FROM analytics_events
      WHERE created_at >= now() - interval '30 days' AND device IS NOT NULL
      GROUP BY device ORDER BY count DESC
    `,
    db.$queryRaw<{ locale: string | null; count: bigint }[]>`
      SELECT locale, COUNT(DISTINCT visitor_id) as count FROM analytics_events
      WHERE created_at >= now() - interval '30 days' AND locale IS NOT NULL
      GROUP BY locale ORDER BY count DESC
    `,
    db.$queryRaw<DayRow[]>`
      SELECT DATE(created_at) as day, COUNT(*) as count FROM analytics_events
      WHERE type = 'pageview' AND created_at >= now() - interval '30 days'
      GROUP BY day ORDER BY day ASC
    `,
    db.$queryRaw<PathRow[]>`
      SELECT path, COUNT(*) as count FROM analytics_events
      WHERE type = 'pageview' AND created_at >= now() - interval '30 days' AND path IS NOT NULL
      GROUP BY path ORDER BY count DESC LIMIT 10
    `,
    db.$queryRaw<CountRow[]>`
      SELECT label, COUNT(*) as count FROM analytics_events
      WHERE type = 'click' AND created_at >= now() - interval '30 days' AND label IS NOT NULL
      GROUP BY label ORDER BY count DESC LIMIT 10
    `,
    db.$queryRaw<CountRow[]>`
      SELECT label, COUNT(*) as count FROM analytics_events
      WHERE type = 'conversion' AND created_at >= now() - interval '30 days' AND label IS NOT NULL
      GROUP BY label ORDER BY count DESC LIMIT 20
    `,
    db.$queryRaw<CountRow[]>`
      SELECT label, COUNT(*) as count FROM analytics_events
      WHERE type = 'accessibility' AND created_at >= now() - interval '30 days' AND label IS NOT NULL
      GROUP BY label ORDER BY count DESC LIMIT 10
    `,
  ]);

  const newReturning = newReturningRows[0] ?? { new_visitors: BigInt(0), returning_visitors: BigInt(0) };

  return {
    windowDays: WINDOW_DAYS,
    uniqueVisitors: Number(uniqueVisitorsRows[0]?.count ?? 0),
    totalPageviews: Number(totalPageviewsRows[0]?.count ?? 0),
    newVisitors: Number(newReturning.new_visitors),
    returningVisitors: Number(newReturning.returning_visitors),
    deviceSplit: deviceRows.map((r) => ({ device: r.device ?? "unknown", count: Number(r.count) })),
    localeSplit: localeRows.map((r) => ({ locale: r.locale ?? "unknown", count: Number(r.count) })),
    trafficTrend: trendRows.map((r) => ({ day: r.day.toISOString().slice(0, 10), count: Number(r.count) })),
    topPages: topPagesRows.map((r) => ({ path: r.path ?? "(unknown)", count: Number(r.count) })),
    topClicks: topClicksRows.map((r) => ({ label: r.label ?? "(unknown)", count: Number(r.count) })),
    conversions: conversionRows.map((r) => ({ label: r.label ?? "(unknown)", count: Number(r.count) })),
    accessibilityUsage: accessibilityRows.map((r) => ({ label: r.label ?? "(unknown)", count: Number(r.count) })),
  };
}

/** All-time pageview total for the footer's visitor counter — replaces
 * the hardcoded placeholder number that used to sit there. Deliberately
 * lifetime pageviews, not unique visitors or a 30-day window: this is
 * the traditional "site hit counter" a government site's footer shows,
 * which only ever counts up, never resets or dips as older visits age
 * out of a rolling window. Cached the same way as nav/footer content —
 * this runs on every public pageload via the footer, so it shouldn't hit
 * the database on every single request. */
export const getLifetimePageviewCount = unstable_cache(
  async (): Promise<number> => {
    const rows = await db.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM analytics_events WHERE type = 'pageview'
    `;
    return Number(rows[0]?.count ?? 0);
  },
  ["lifetime-pageview-count"],
  { revalidate: 60, tags: ["analytics-events"] }
);
