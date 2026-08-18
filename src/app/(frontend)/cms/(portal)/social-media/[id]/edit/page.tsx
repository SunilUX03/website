import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { SocialPostForm } from "../../SocialPostForm";
import { updateSocialPost, deleteSocialPost } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import type { Media } from "@/payload-types";

export default async function EditSocialPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "social-posts", id: Number(id), depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateSocialPost.bind(null, doc.id);
  const boundDelete = deleteSocialPost.bind(null, doc.id, doc.platform ?? "");
  const image = typeof doc.image === "object" ? (doc.image as Media) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit social post</h1>
        {user.role === "admin" ? (
          <form action={boundDelete}>
            <ConfirmSubmitButton
              confirmMessage="Delete this post? This can't be undone."
              className="type-caption font-semibold text-[var(--color-error)] hover:underline"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        ) : null}
      </div>

      {saved ? (
        <p className="type-body-sm mb-6 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <SocialPostForm
        action={boundUpdate}
        values={{
          platform: doc.platform ?? "facebook",
          text: doc.text,
          date: doc.date?.slice(0, 10) ?? "",
          link: doc.link ?? undefined,
          imageUrl: image?.url ?? undefined,
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
