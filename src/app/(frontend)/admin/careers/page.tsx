import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/admin/SignOutButton";

// Protected, per-request, always-fresh admin data — must never be
// statically cached or prerendered at build time.
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminCareersPage() {
  const session = await auth();
  const applications = await db.jobApplication.findMany({
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-canvas-soft">
      <header className="border-b border-hairline bg-surface-card">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5">
          <div>
            <h1 className="type-title-md text-ink">Job Applications</h1>
            <p className="type-body-sm text-[var(--color-muted)]">
              Signed in as {session?.user?.email}
            </p>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-xl">
        {applications.length === 0 ? (
          <p className="type-body-md text-[var(--color-muted)]">
            No applications submitted yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-card">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline text-[13px] text-[var(--color-muted)]">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Cover Note</th>
                  <th className="px-4 py-3 font-medium">Resume</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-hairline-soft text-[14px] last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{app.fullName}</td>
                    <td className="px-4 py-3 text-[var(--color-body)]">{app.role}</td>
                    <td className="px-4 py-3 text-[var(--color-body)]">
                      <a href={`mailto:${app.email}`} className="hover:underline">
                        {app.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-body)]">{app.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">
                      {formatDate(app.submittedAt)}
                    </td>
                    <td className="max-w-[240px] px-4 py-3 text-[var(--color-body)]">
                      {app.coverNote ? (
                        <span className="line-clamp-2">{app.coverNote}</span>
                      ) : (
                        <span className="text-[var(--color-muted-soft)]">Not provided</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/api/admin/resume/${app.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="type-button btn-outline !h-8 !px-3 !text-xs"
                      >
                        View PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
