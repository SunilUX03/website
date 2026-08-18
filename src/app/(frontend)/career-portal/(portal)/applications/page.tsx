import { db } from "@/lib/db";
import { getPayloadClient } from "@/lib/payload-client";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const applications = await db.jobApplication.findMany({
    where: { matchedJobOpeningId: { not: null } },
    orderBy: { submittedAt: "desc" },
  });

  const payload = await getPayloadClient();
  const openingIds = Array.from(new Set(applications.map((a) => a.matchedJobOpeningId!)));
  const openings = await Promise.all(
    openingIds.map((id) =>
      payload.findByID({ collection: "job-openings", id, overrideAccess: true, depth: 0 }).catch(() => null)
    )
  );
  const openingById = new Map(openings.filter(Boolean).map((o) => [o!.id, o!]));

  const groups = openingIds
    .map((id) => ({
      opening: openingById.get(id),
      applications: applications.filter((a) => a.matchedJobOpeningId === id),
    }))
    .sort((a, b) => b.applications.length - a.applications.length);

  return (
    <div>
      <div className="mb-6">
        <h1 className="type-display-sm text-ink">Applications</h1>
        <p className="type-body-sm mt-1 text-[var(--color-muted)]">
          Applications submitted for a specific, currently-published opening — grouped by job.
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="type-body-sm rounded-xl border border-hairline bg-surface-card px-5 py-8 text-center text-[var(--color-muted)]">
          No applications for a specific opening yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map(({ opening, applications: apps }) => (
            <section key={opening?.id ?? "unknown"} className="overflow-hidden rounded-xl border border-hairline bg-surface-card">
              <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
                <div>
                  <h2 className="type-title-sm text-ink">{opening?.role ?? "Unknown / removed opening"}</h2>
                  {opening ? (
                    <p className="type-caption mt-0.5 text-[var(--color-muted)]">
                      {opening.department} · {opening._status === "published" ? "Live" : "Draft — not on site"}
                    </p>
                  ) : null}
                </div>
                <span className="badge-pill type-caption-uppercase">
                  {apps.length} application{apps.length === 1 ? "" : "s"}
                </span>
              </div>
              <ApplicationsTable applications={apps} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
