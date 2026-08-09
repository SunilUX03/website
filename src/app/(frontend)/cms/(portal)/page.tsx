import { getPayloadClient } from "@/lib/payload-client";

export const dynamic = "force-dynamic";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const ACTION_LABEL: Record<string, string> = {
  created: "created",
  updated: "updated",
  published: "published",
  unpublished: "unpublished",
  deleted: "deleted",
};

export default async function DashboardPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "activity-log",
    sort: "-createdAt",
    limit: 50,
    overrideAccess: true,
  });

  return (
    <div className="mx-auto max-w-[860px]">
      <h1 className="type-display-sm mb-1 text-ink">Dashboard</h1>
      <p className="type-body-sm mb-8 text-[var(--color-muted)]">Recent changes across the site.</p>

      {docs.length === 0 ? (
        <p className="type-body-sm rounded-xl border border-hairline bg-surface-card px-lg py-xl text-center text-[var(--color-muted)]">
          No activity yet.
        </p>
      ) : (
        <ul role="list" className="flex flex-col gap-2">
          {docs.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-hairline bg-surface-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="type-body-sm text-ink">
                  <span className="font-semibold">{entry.userEmail}</span> {ACTION_LABEL[entry.action] ?? entry.action}{" "}
                  <span className="text-[var(--color-muted)]">in {entry.section}:</span> {entry.summary}
                </p>
              </div>
              <span className="type-caption shrink-0 text-[var(--color-muted)]">
                {entry.createdAt ? timeAgo(entry.createdAt) : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
