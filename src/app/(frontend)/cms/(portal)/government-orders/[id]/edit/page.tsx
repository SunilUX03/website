import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { GovernmentOrderForm } from "../../GovernmentOrderForm";
import { updateGovernmentOrder, deleteGovernmentOrder } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import type { Document as PayloadDocument } from "@/payload-types";

export default async function EditGovernmentOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "government-orders", id: Number(id), depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateGovernmentOrder.bind(null, doc.id);
  const boundDelete = deleteGovernmentOrder.bind(null, doc.id, doc.title);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit Government Order</h1>
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

      <GovernmentOrderForm
        action={boundUpdate}
        values={{
          title: doc.title,
          year: doc.year,
          department: doc.department,
          fileUrl: typeof doc.file === "object" && doc.file ? (doc.file as PayloadDocument).url ?? undefined : undefined,
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
