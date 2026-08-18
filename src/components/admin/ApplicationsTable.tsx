function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export type ApplicationRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  coverNote: string | null;
  submittedAt: Date;
};

export function ApplicationsTable({ applications }: { applications: ApplicationRow[] }) {
  if (applications.length === 0) {
    return <p className="type-body-sm px-5 py-6 text-[var(--color-muted)]">No applications yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-hairline text-[13px] text-[var(--color-muted)]">
            <th className="px-4 py-3 font-medium">Name</th>
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
              <td className="px-4 py-3 text-[var(--color-body)]">
                <a href={`mailto:${app.email}`} className="hover:underline">
                  {app.email}
                </a>
              </td>
              <td className="px-4 py-3 text-[var(--color-body)]">{app.phone}</td>
              <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">{formatDate(app.submittedAt)}</td>
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
  );
}
