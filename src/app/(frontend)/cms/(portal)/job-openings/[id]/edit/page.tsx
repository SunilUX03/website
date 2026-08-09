import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { JobOpeningForm } from "../../JobOpeningForm";
import { updateJobOpening, deleteJobOpening } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export default async function EditJobOpeningPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "job-openings", id: Number(id), draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateJobOpening.bind(null, doc.id);
  const boundDelete = deleteJobOpening.bind(null, doc.id, doc.role);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit job opening</h1>
        {user.role === "admin" ? (
          <form action={boundDelete}>
            <ConfirmSubmitButton
              confirmMessage={`Delete "${doc.role}"? This can't be undone.`}
              className="type-caption font-semibold text-[var(--color-error)] hover:underline"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        ) : null}
      </div>

      <JobOpeningForm
        action={boundUpdate}
        values={{
          role: doc.role,
          type: doc.type,
          department: doc.department,
          deadline: doc.deadline?.slice(0, 10) ?? "",
          jdHref: doc.jdHref ?? "",
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
