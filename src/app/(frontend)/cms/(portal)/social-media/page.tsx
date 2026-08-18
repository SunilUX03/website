import Link from "next/link";
import { getPayloadClient } from "@/lib/payload-client";

export const dynamic = "force-dynamic";

const PLATFORM_LABEL: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

export default async function SocialMediaListPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "social-posts",
    sort: "-date",
    limit: 200,
    draft: true,
    overrideAccess: true,
  });
  // Same "draft: true returns the latest version, not the live one"
  // distinction handled on the Job Openings list — see that page for the
  // full explanation.
  const { docs: publishedDocs } = await payload.find({
    collection: "social-posts",
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
        <div>
          <h1 className="type-display-sm text-ink">Social Media</h1>
          <p className="type-body-sm mt-1 text-[var(--color-muted)]">
            Manual entry — paste in each post&apos;s text, image, date and link whenever you post something on the real platform.
          </p>
        </div>
        <Link href="/cms/social-media/new" className="type-button btn-primary">
          + Add post
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-hairline bg-surface-card">
        <table className="w-full text-left">
          <thead>
            <tr className="type-caption-uppercase border-b border-hairline text-[var(--color-muted)]">
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Text</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} className="type-body-sm border-b border-hairline last:border-0">
                <td className="px-4 py-3 text-ink">{PLATFORM_LABEL[doc.platform ?? ""] ?? doc.platform}</td>
                <td className="max-w-[360px] truncate px-4 py-3 text-[var(--color-muted)]">{doc.text}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{doc.date?.slice(0, 10)}</td>
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
                  <Link href={`/cms/social-media/${doc.id}/edit`} className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {docs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">
                  No posts yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
