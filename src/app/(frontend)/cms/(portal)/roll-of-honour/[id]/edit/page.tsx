import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { RollOfHonourForm } from "../../RollOfHonourForm";
import { updateRollOfHonourEntry, deleteRollOfHonourEntry } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { LocaleTabs } from "@/components/portal/LocaleTabs";

export default async function EditRollOfHonourEntryPage({
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
    .findByID({ collection: "roll-of-honour", id: Number(id), locale, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateRollOfHonourEntry.bind(null, doc.id);
  const boundDelete = deleteRollOfHonourEntry.bind(null, doc.id, doc.designation);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit roll of honour entry</h1>
        {user.role === "admin" ? (
          <form action={boundDelete}>
            <ConfirmSubmitButton
              confirmMessage={`Delete "${doc.designation}"? This can't be undone.`}
              className="type-caption font-semibold text-[var(--color-error)] hover:underline"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        ) : null}
      </div>

      <LocaleTabs basePath={`/cms/roll-of-honour/${id}/edit`} current={locale} />

      <RollOfHonourForm
        key={locale}
        action={boundUpdate}
        locale={locale}
        error={error}
        values={{
          designation: doc.designation,
          name: doc.name ?? "",
          range: doc.range ?? "",
          order: doc.order,
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
