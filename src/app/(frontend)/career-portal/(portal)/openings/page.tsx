import Link from "next/link";
import { getPayloadClient } from "@/lib/payload-client";

export const dynamic = "force-dynamic";

export default async function JobOpeningsListPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "job-openings",
    sort: "deadline",
    limit: 200,
    draft: true,
    overrideAccess: true,
  });
  // `draft: true` above returns each doc's LATEST version, whose _status
  // can read "draft" even when that doc is actually live on the public
  // site with unsaved edits sitting on top — a second, published-only
  // query is the only way to tell "never published" apart from
  // "published, with newer draft changes pending" (the badge below was
  // otherwise showing a flat "draft" for both, reading as "not live" when
  // the first case usually isn't true).
  const { docs: publishedDocs } = await payload.find({
    collection: "job-openings",
    limit: 200,
    depth: 0,
    select: {},
    overrideAccess: true,
    where: { _status: { equals: "published" } },
  });
  const publishedIds = new Set(publishedDocs.map((d) => d.id));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Job Openings</h1>
        <Link href="/career-portal/openings/new" className="type-button btn-primary">
          + Add opening
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-hairline bg-surface-card">
        <table className="w-full text-left">
          <thead>
            <tr className="type-caption-uppercase border-b border-hairline text-[var(--color-muted)]">
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} className="type-body-sm border-b border-hairline last:border-0">
                <td className="px-4 py-3 text-ink">{doc.role}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{doc.department}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{doc.deadline?.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  {(() => {
                    const isLive = publishedIds.has(doc.id);
                    const hasPendingEdits = doc._status === "draft";
                    if (isLive && hasPendingEdits) {
                      return (
                        <span className="badge-pill type-caption-uppercase !bg-[rgba(16,138,74,0.1)] !text-[#108a4a]">
                          Live · unsaved changes
                        </span>
                      );
                    }
                    if (isLive) {
                      return <span className="badge-pill type-caption-uppercase !bg-[rgba(16,138,74,0.1)] !text-[#108a4a]">Live</span>;
                    }
                    return <span className="badge-pill type-caption-uppercase">Draft — not on site</span>;
                  })()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/career-portal/openings/${doc.id}/edit`} className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {docs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">
                  No job openings yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
