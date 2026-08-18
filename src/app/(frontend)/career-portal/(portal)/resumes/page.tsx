import { db } from "@/lib/db";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";

export const dynamic = "force-dynamic";

export default async function ResumesPage() {
  const applications = await db.jobApplication.findMany({
    where: { matchedJobOpeningId: null },
    orderBy: [{ role: "asc" }, { submittedAt: "desc" }],
  });

  const roles = Array.from(new Set(applications.map((a) => a.role))).sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <div className="mb-6">
        <h1 className="type-display-sm text-ink">Resume Submitted</h1>
        <p className="type-body-sm mt-1 text-[var(--color-muted)]">
          General resumes submitted for a role with no currently-published opening — grouped by role applied for.
        </p>
      </div>

      {roles.length === 0 ? (
        <p className="type-body-sm rounded-xl border border-hairline bg-surface-card px-5 py-8 text-center text-[var(--color-muted)]">
          No general resume submissions yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {roles.map((role) => {
            const apps = applications.filter((a) => a.role === role);
            return (
              <section key={role} className="overflow-hidden rounded-xl border border-hairline bg-surface-card">
                <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
                  <h2 className="type-title-sm text-ink">{role}</h2>
                  <span className="badge-pill type-caption-uppercase">
                    {apps.length} resume{apps.length === 1 ? "" : "s"}
                  </span>
                </div>
                <ApplicationsTable applications={apps} />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
