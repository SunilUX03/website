import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { JobOpeningForm } from "../../JobOpeningForm";
import { updateJobOpening, deleteJobOpening } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import type { Document } from "@/payload-types";

export default async function EditJobOpeningPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "job-openings", id: Number(id), depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateJobOpening.bind(null, doc.id);
  const boundDelete = deleteJobOpening.bind(null, doc.id);
  const jd = typeof doc.jd === "object" ? (doc.jd as Document) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit job opening</h1>
        <form action={boundDelete}>
          <ConfirmSubmitButton
            confirmMessage={`Delete "${doc.role}"? This can't be undone.`}
            className="type-caption font-semibold text-[var(--color-error)] hover:underline"
          >
            Delete
          </ConfirmSubmitButton>
        </form>
      </div>

      {saved ? (
        <p className="type-body-sm mb-6 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <JobOpeningForm
        action={boundUpdate}
        values={{
          role: doc.role,
          type: doc.type,
          department: doc.department,
          deadline: doc.deadline?.slice(0, 10) ?? "",
          jdName: jd?.filename ?? undefined,
          jdUrl: jd?.url ?? undefined,
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
