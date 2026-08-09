import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { AwardForm } from "../../AwardForm";
import { updateAward, deleteAward } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import type { Media } from "@/payload-types";

export default async function EditAwardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "awards", id: Number(id), depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const existingImageId = typeof doc.image === "object" && doc.image ? (doc.image as Media).id : typeof doc.image === "number" ? doc.image : undefined;
  const boundUpdate = updateAward.bind(null, doc.id, existingImageId);
  const boundDelete = deleteAward.bind(null, doc.id, doc.title);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit award</h1>
        {user.role === "admin" ? (
          <form action={boundDelete}>
            <ConfirmSubmitButton
              confirmMessage={`Delete "${doc.title}"? This can't be undone.`}
              className="type-caption font-semibold text-[var(--color-error)] hover:underline"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        ) : null}
      </div>

      <AwardForm
        action={boundUpdate}
        values={{
          title: doc.title,
          year: doc.year,
          description: doc.description,
          imageUrl: typeof doc.image === "object" && doc.image ? (doc.image as Media).url ?? undefined : undefined,
          status: doc._status as "draft" | "published",
          error,
        }}
      />
    </div>
  );
}
