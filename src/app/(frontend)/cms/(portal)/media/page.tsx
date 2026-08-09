import Link from "next/link";
import Image from "next/image";
import { getPayloadClient } from "@/lib/payload-client";
import type { Media } from "@/payload-types";

export const dynamic = "force-dynamic";

export default async function MediaListPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "media-items",
    sort: "-date",
    limit: 200,
    depth: 1,
    draft: true,
    overrideAccess: true,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Media & Press</h1>
        <Link href="/cms/media/new" className="type-button btn-primary">
          + Add photo/video
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {docs.map((doc) => {
          const url = typeof doc.image === "object" && doc.image ? (doc.image as Media).url ?? undefined : undefined;
          return (
            <Link
              key={doc.id}
              href={`/cms/media/${doc.id}/edit`}
              className="overflow-hidden rounded-xl border border-hairline bg-surface-card transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
            >
              <div className="relative aspect-[4/3] bg-surface-strong">
                {url ? <Image src={url} alt="" fill className="object-cover" /> : null}
                <span
                  className={
                    doc._status === "published"
                      ? "badge-pill type-caption-uppercase absolute right-2 top-2 !bg-[rgba(16,138,74,0.85)] !text-white"
                      : "badge-pill type-caption-uppercase absolute right-2 top-2 !bg-black/60 !text-white"
                  }
                >
                  {doc._status}
                </span>
              </div>
              <div className="p-3">
                <p className="type-body-sm truncate text-ink">{doc.caption}</p>
                <p className="type-caption text-[var(--color-muted)]">{doc.type}</p>
              </div>
            </Link>
          );
        })}
        {docs.length === 0 ? (
          <p className="col-span-full py-8 text-center text-[var(--color-muted)]">No photos or videos yet.</p>
        ) : null}
      </div>
    </div>
  );
}
