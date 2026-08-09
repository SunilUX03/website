import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { MediaItemForm } from "../../MediaItemForm";
import { updateMediaItem, deleteMediaItem } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import type { Media } from "@/payload-types";

export default async function EditMediaItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "media-items", id: Number(id), depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateMediaItem.bind(null, doc.id);
  const boundDelete = deleteMediaItem.bind(null, doc.id, doc.caption);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit photo/video</h1>
        {user.role === "admin" ? (
          <form action={boundDelete}>
            <ConfirmSubmitButton
              confirmMessage={`Delete "${doc.caption}"? This can't be undone.`}
              className="type-caption font-semibold text-[var(--color-error)] hover:underline"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        ) : null}
      </div>

      <MediaItemForm
        action={boundUpdate}
        values={{
          type: doc.type,
          caption: doc.caption,
          altText: doc.altText ?? "",
          date: doc.date?.slice(0, 10) ?? "",
          imageUrl: typeof doc.image === "object" && doc.image ? (doc.image as Media).url ?? undefined : undefined,
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
