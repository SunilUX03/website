import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { PolicyForm } from "../../PolicyForm";
import { updatePolicy, deletePolicy } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Document as PayloadDocument } from "@/payload-types";

export default async function EditPolicyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; locale?: string; error?: string }>;
}) {
  const { id } = await params;
  const { locale: localeParam, error } = await searchParams;
  const locale = localeParam === "ta" ? "ta" : "en";
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "policies", id: Number(id), locale, depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updatePolicy.bind(null, doc.id);
  const boundDelete = deletePolicy.bind(null, doc.id, doc.title);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit policy</h1>
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

      <LocaleTabs basePath={`/cms/policies/${id}/edit`} current={locale} />

      <PolicyForm
        key={locale}
        action={boundUpdate}
        locale={locale}
        error={error}
        values={{
          title: doc.title,
          year: doc.year,
          category: doc.category,
          fileName: typeof doc.file === "object" && doc.file ? (doc.file as PayloadDocument).filename ?? undefined : undefined,
          fileUrl: typeof doc.file === "object" && doc.file ? (doc.file as PayloadDocument).url ?? undefined : undefined,
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
