import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { DepartmentContactForm } from "../../DepartmentContactForm";
import { updateDepartmentContact, deleteDepartmentContact } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export default async function EditDepartmentContactPage({
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
    .findByID({ collection: "department-contacts", id: Number(id), draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateDepartmentContact.bind(null, doc.id);
  const boundDelete = deleteDepartmentContact.bind(null, doc.id, doc.department);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit department contact</h1>
        {user.role === "admin" ? (
          <form action={boundDelete}>
            <ConfirmSubmitButton
              confirmMessage={`Delete "${doc.department}"? This can't be undone.`}
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

      <DepartmentContactForm
        action={boundUpdate}
        values={{
          department: doc.department,
          contact: doc.contact,
          email: doc.email,
          phone: doc.phone,
          order: doc.order,
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
