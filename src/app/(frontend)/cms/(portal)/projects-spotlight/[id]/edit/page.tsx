import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { ProjectSpotlightForm } from "../../ProjectSpotlightForm";
import { updateProjectSpotlight, deleteProjectSpotlight } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import type { Media } from "@/payload-types";

export default async function EditProjectSpotlightPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "projects-spotlight", id: Number(id), depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const existingImageId = typeof doc.image === "object" && doc.image ? (doc.image as Media).id : typeof doc.image === "number" ? doc.image : undefined;
  const boundUpdate = updateProjectSpotlight.bind(null, doc.id, existingImageId);
  const boundDelete = deleteProjectSpotlight.bind(null, doc.id, doc.name);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit spotlight project</h1>
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

      <ProjectSpotlightForm
        action={boundUpdate}
        values={{
          name: doc.name,
          description: doc.description,
          badge: doc.badge ?? "",
          order: doc.order,
          stats: (doc.stats ?? []).map((s) => ({ value: String(s.value), suffix: s.suffix ?? "", label: s.label })),
          ctas: (doc.ctas ?? []).map((c) => ({ label: c.label, href: c.href })),
          imageUrl: typeof doc.image === "object" && doc.image ? (doc.image as Media).url ?? undefined : undefined,
          status: doc._status as "draft" | "published",
          error,
        }}
      />
    </div>
  );
}
