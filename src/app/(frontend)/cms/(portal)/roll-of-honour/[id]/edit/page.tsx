import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { RollOfHonourForm } from "../../RollOfHonourForm";
import { updateRollOfHonourEntry, deleteRollOfHonourEntry } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export default async function EditRollOfHonourEntryPage({
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
    .findByID({ collection: "roll-of-honour", id: Number(id), draft: true, overrideAccess: true })
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

      {saved ? (
        <p className="type-body-sm mb-6 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <RollOfHonourForm
        action={boundUpdate}
        values={{
          designation: doc.designation,
          name: doc.name ?? "",
          range: doc.range ?? "",
          order: doc.order,
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
