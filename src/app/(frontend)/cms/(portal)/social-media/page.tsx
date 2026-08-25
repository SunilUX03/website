import Link from "next/link";
import { getPayloadClient } from "@/lib/payload-client";
import { SocialPostsTable } from "./SocialPostsTable";

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
    sort: "order",
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

      <SocialPostsTable
        docs={docs.map((doc) => {
          const isLive = publishedIds.has(doc.id);
          const hasPendingEdits = doc._status === "draft";
          const statusLabel = isLive && hasPendingEdits ? "Live · unsaved changes" : isLive ? "Live" : "Draft — not on site";
          return {
            id: doc.id,
            platformLabel: PLATFORM_LABEL[doc.platform ?? ""] ?? doc.platform,
            text: doc.text,
            date: doc.date?.slice(0, 10) ?? "",
            statusLabel,
            statusLive: isLive,
          };
        })}
      />
    </div>
  );
}
