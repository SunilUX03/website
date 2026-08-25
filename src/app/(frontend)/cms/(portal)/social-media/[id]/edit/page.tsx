import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { SocialPostForm } from "../../SocialPostForm";
import { updateSocialPost, deleteSocialPost } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Media } from "@/payload-types";

export default async function EditSocialPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ locale?: string; error?: string }>;
}) {
  const { id } = await params;
  const { locale: localeParam, error } = await searchParams;
  const locale = localeParam === "ta" ? "ta" : "en";
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "social-posts", id: Number(id), locale, depth: 1, draft: true, overrideAccess: true })
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

      <LocaleTabs basePath={`/cms/social-media/${id}/edit`} current={locale} />

      <SocialPostForm
        key={locale}
        action={boundUpdate}
        locale={locale}
        error={error}
        values={{
          platform: doc.platform ?? "facebook",
          text: doc.text,
          date: doc.date?.slice(0, 10) ?? "",
          link: doc.link ?? undefined,
          imageUrl: image?.url ?? undefined,
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
