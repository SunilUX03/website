import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { ProjectSpotlightForm } from "../../ProjectSpotlightForm";
import { updateProjectSpotlight, deleteProjectSpotlight } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import type { Media, Service } from "@/payload-types";

export default async function EditProjectSpotlightPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "projects-spotlight", id: Number(id), depth: 2, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const service = typeof doc.service === "object" ? (doc.service as Service) : null;
  const serviceName = service?.name ?? "Unknown service";

  const boundUpdate = updateProjectSpotlight.bind(null, doc.id);
  const boundDelete = deleteProjectSpotlight.bind(null, doc.id, serviceName);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit spotlight entry</h1>
        {user.role === "admin" ? (
          <form action={boundDelete}>
            <ConfirmSubmitButton
              confirmMessage={`Remove "${serviceName}" from the spotlight? This can't be undone.`}
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

      <ProjectSpotlightForm
        action={boundUpdate}
        values={{
          serviceName,
          serviceDescription: service?.description ?? "",
          serviceImageUrl: typeof service?.image === "object" && service.image ? (service.image as Media).url ?? undefined : undefined,
          badge: doc.badge ?? "",
          order: doc.order,
          stats: (doc.stats ?? []).map((s) => ({ value: String(s.value), suffix: s.suffix ?? "", label: s.label })),
          ctas: (doc.ctas ?? []).map((c) => ({ label: c.label, href: c.href })),
          status: doc._status as "draft" | "published",
          error,
        }}
      />
    </div>
  );
}
