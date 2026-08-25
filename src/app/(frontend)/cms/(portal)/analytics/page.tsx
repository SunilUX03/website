import { getAnalyticsSummary } from "@/lib/analytics-query";

export const dynamic = "force-dynamic";

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-card p-5">
      <p className="type-caption-uppercase mb-1.5 text-[var(--color-muted)]">{label}</p>
      <p className="type-display-sm text-ink">{value.toLocaleString("en-IN")}</p>
    </div>
  );
}

function RankedList({ title, rows, emptyText }: { title: string; rows: { label: string; count: number }[]; emptyText: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="rounded-xl border border-hairline bg-surface-card p-5">
      <p className="type-title-sm mb-4 text-ink">{title}</p>
      {rows.length === 0 ? (
        <p className="type-body-sm text-[var(--color-muted)]">{emptyText}</p>
      ) : (
        <ul role="list" className="flex flex-col gap-2.5">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center gap-3">
              <span className="type-body-sm min-w-0 flex-1 truncate text-ink" title={row.label}>
                {row.label}
              </span>
              <div className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-canvas-soft">
                <div className="h-full rounded-full bg-[var(--color-primary-blue)]" style={{ width: `${(row.count / max) * 100}%` }} />
              </div>
              <span className="type-caption w-10 shrink-0 text-right text-[var(--color-muted)]">{row.count.toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SplitBar({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  const total = Math.max(1, rows.reduce((sum, r) => sum + r.count, 0));
  return (
    <div className="rounded-xl border border-hairline bg-surface-card p-5">
      <p className="type-title-sm mb-4 text-ink">{title}</p>
      {rows.length === 0 ? (
        <p className="type-body-sm text-[var(--color-muted)]">No data yet.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="type-body-sm w-20 shrink-0 capitalize text-ink">{row.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas-soft">
                <div className="h-full rounded-full bg-[var(--color-primary-blue)]" style={{ width: `${(row.count / total) * 100}%` }} />
              </div>
              <span className="type-caption w-10 shrink-0 text-right text-[var(--color-muted)]">{row.count.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TrafficTrend({ rows }: { rows: { day: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="rounded-xl border border-hairline bg-surface-card p-5">
      <p className="type-title-sm mb-4 text-ink">Traffic trend</p>
      {rows.length === 0 ? (
        <p className="type-body-sm text-[var(--color-muted)]">No pageviews recorded yet.</p>
      ) : (
        <div className="flex h-32 items-end gap-1">
          {rows.map((row) => (
            <div key={row.day} className="group relative flex-1">
              <div
                className="rounded-t-sm bg-[var(--color-primary-blue)] transition-opacity group-hover:opacity-80"
                style={{ height: `${Math.max(4, (row.count / max) * 128)}px` }}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] text-white group-hover:block">
                {row.day}: {row.count}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function AnalyticsPage() {
  const summary = await getAnalyticsSummary();

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Analytics</h1>
      <p className="type-body-sm mb-8 text-[var(--color-muted)]">
        Last {summary.windowDays} days. Only counted for visitors who accepted analytics cookies — see the Cookie Policy page.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Unique visitors" value={summary.uniqueVisitors} />
        <StatTile label="Pageviews" value={summary.totalPageviews} />
        <StatTile label="New visitors" value={summary.newVisitors} />
        <StatTile label="Returning visitors" value={summary.returningVisitors} />
      </div>

      <div className="mb-6">
        <TrafficTrend rows={summary.trafficTrend} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <RankedList title="Most-visited pages" rows={summary.topPages.map((r) => ({ label: r.path, count: r.count }))} emptyText="No pageviews recorded yet." />
        <RankedList title="Most-clicked links & buttons" rows={summary.topClicks} emptyText="No clicks recorded yet." />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <RankedList
          title="Conversions"
          rows={summary.conversions}
          emptyText="No conversions recorded yet — e.g. feedback submitted, job application submitted, eSevai/UMIS opened, contact us clicked."
        />
        <RankedList title="Accessibility panel usage" rows={summary.accessibilityUsage} emptyText="No accessibility settings used yet." />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SplitBar title="Device" rows={summary.deviceSplit.map((r) => ({ label: r.device, count: r.count }))} />
        <SplitBar
          title="Language"
          rows={summary.localeSplit.map((r) => ({ label: r.locale === "ta" ? "தமிழ்" : r.locale === "en" ? "English" : r.locale, count: r.count }))}
        />
      </div>
    </div>
  );
}
