import Link from "next/link";
import { db } from "@/lib/db";
import { getPayloadClient } from "@/lib/payload-client";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-card p-5">
      <p className="type-display-sm text-ink">{value}</p>
      <p className="type-caption-uppercase mt-1 text-[var(--color-muted)]">{label}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const payload = await getPayloadClient();

  const [allApplications, generalCount, { docs: publishedOpenings }, roleCount] = await Promise.all([
    db.jobApplication.findMany({ orderBy: { submittedAt: "desc" } }),
    db.jobApplication.count({ where: { matchedJobOpeningId: null } }),
    payload.find({ collection: "job-openings", limit: 200, depth: 0, overrideAccess: true, where: { _status: { equals: "published" } } }),
    db.jobRole.count(),
  ]);

  const weekAgo = daysFromNow(-7);
  const thisWeekCount = allApplications.filter((a) => a.submittedAt >= weekAgo).length;

  const perJob = publishedOpenings
    .map((o) => ({
      opening: o,
      count: allApplications.filter((a) => a.matchedJobOpeningId === o.id).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...perJob.map((j) => j.count));

  const fortnightFromNow = daysFromNow(14);
  const upcomingDeadlines = publishedOpenings
    .filter((o) => o.deadline && new Date(o.deadline) <= fortnightFromNow)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const recent = allApplications.slice(0, 8);

  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Total applications" value={allApplications.length} />
        <StatTile label="This week" value={thisWeekCount} />
        <StatTile label="Active openings" value={publishedOpenings.length} />
        <StatTile label="Resume submitted (general)" value={generalCount} />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="type-title-sm text-ink">Applications per job</h2>
            <Link href="/career-portal/applications" className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline">
              View all
            </Link>
          </div>
          {perJob.length === 0 ? (
            <p className="type-body-sm text-[var(--color-muted)]">No active openings yet.</p>
          ) : (
            <ul role="list" className="flex flex-col gap-3">
              {perJob.map(({ opening, count }) => (
                <li key={opening.id}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="type-body-sm text-ink">{opening.role}</span>
                    <span className="type-caption text-[var(--color-muted)]">{count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-strong)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary-blue)]"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <h2 className="type-title-sm mb-4 text-ink">Deadlines in the next 14 days</h2>
          {upcomingDeadlines.length === 0 ? (
            <p className="type-body-sm text-[var(--color-muted)]">Nothing closing soon.</p>
          ) : (
            <ul role="list" className="flex flex-col gap-3">
              {upcomingDeadlines.map((o) => (
                <li key={o.id} className="flex items-center justify-between">
                  <div>
                    <p className="type-body-sm text-ink">{o.role}</p>
                    <p className="type-caption text-[var(--color-muted)]">{o.department}</p>
                  </div>
                  <span className="type-caption font-semibold text-[var(--color-error)]">{formatDate(new Date(o.deadline))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-hairline bg-surface-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-title-sm text-ink">Recent activity</h2>
          <span className="type-caption text-[var(--color-muted)]">{roleCount} role{roleCount === 1 ? "" : "s"} configured</span>
        </div>
        {recent.length === 0 ? (
          <p className="type-body-sm text-[var(--color-muted)]">No applications yet.</p>
        ) : (
          <ul role="list" className="flex flex-col gap-1">
            {recent.map((app) => (
              <li key={app.id} className="flex items-center justify-between border-t border-hairline py-2.5 first:border-t-0 first:pt-0">
                <div className="min-w-0">
                  <p className="type-body-sm truncate text-ink">{app.fullName}</p>
                  <p className="type-caption text-[var(--color-muted)]">
                    {app.role} {app.matchedJobOpeningId === null ? "· no vacancy" : ""}
                  </p>
                </div>
                <span className="type-caption shrink-0 text-[var(--color-muted)]">{formatDate(app.submittedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
