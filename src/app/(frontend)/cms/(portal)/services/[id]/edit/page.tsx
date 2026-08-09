import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { ServiceForm } from "../../ServiceForm";
import { updateService, deleteService } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import type { Media } from "@/payload-types";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "services", id: Number(id), depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateService.bind(null, doc.id);
  const boundDelete = deleteService.bind(null, doc.id, doc.name);
  const real = doc.real;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit service/project</h1>
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

      <ServiceForm
        action={boundUpdate}
        values={{
          name: doc.name,
          description: doc.description,
          stats: doc.stats,
          accessPortalHref: doc.accessPortalHref ?? "",
          sections: doc.sections,
          imageUrl: typeof doc.image === "object" && doc.image ? (doc.image as Media).url ?? undefined : undefined,
          tagline: real?.tagline ?? "",
          aboutSecondParagraph: real?.aboutSecondParagraph ?? "",
          calloutText: real?.calloutText ?? "",
          statistics: real?.statistics?.map((s) => s.value) ?? [],
          keyFeatures: real?.keyFeatures?.map((s) => s.value) ?? [],
          eligibility: real?.eligibility?.map((s) => s.value) ?? [],
          whatYoullNeed: real?.whatYoullNeed?.map((s) => s.value) ?? [],
          faqs: real?.faqs?.map((f) => ({ q: f.q, a: f.a })) ?? [],
          comingSoon: real?.comingSoon ?? false,
          gatedAccess: real?.gatedAccess ?? false,
          typeLabel: real?.typeLabel ?? "",
          contactEmail: real?.contact?.email ?? "",
          contactPhone: real?.contact?.phone ?? "",
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
