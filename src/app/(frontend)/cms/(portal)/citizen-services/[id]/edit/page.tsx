import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { CitizenServiceForm } from "../../CitizenServiceForm";
import { updateCitizenService, deleteCitizenService } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Media } from "@/payload-types";

export default async function EditCitizenServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; locale?: string }>;
}) {
  const { id } = await params;
  const { error, locale: localeParam } = await searchParams;
  const locale = localeParam === "ta" ? "ta" : "en";
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "citizen-services", id: Number(id), locale, depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const existingImageId = typeof doc.image === "object" && doc.image ? (doc.image as Media).id : typeof doc.image === "number" ? doc.image : undefined;
  const boundUpdate = updateCitizenService.bind(null, doc.id, existingImageId);
  const boundDelete = deleteCitizenService.bind(null, doc.id, doc.name);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit citizen service card</h1>
        {user.role === "admin" ? (
          <form action={boundDelete}>
            <ConfirmSubmitButton
              confirmMessage={`Delete "${doc.name}"? This can't be undone.`}
              className="type-caption font-semibold text-[var(--color-error)] hover:underline"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        ) : null}
      </div>

      <LocaleTabs basePath={`/cms/citizen-services/${id}/edit`} current={locale} />

      <CitizenServiceForm
        key={locale}
        action={boundUpdate}
        locale={locale}
        values={{
          name: doc.name,
          description: doc.description,
          buttonLabel: doc.buttonLabel ?? "",
          buttonHref: doc.buttonHref ?? "",
          externalLink: doc.externalLink ?? true,
          imageUrl: typeof doc.image === "object" && doc.image ? (doc.image as Media).url ?? undefined : undefined,
          status: doc._status as "draft" | "published",
          error,
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
