import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { ServiceForm } from "../../ServiceForm";
import { updateService, deleteService } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import type { Media } from "@/payload-types";

function mediaUrl(value: number | Media | null | undefined): string | undefined {
  return typeof value === "object" && value !== null ? value.url ?? undefined : undefined;
}

export default async function EditServicePage({
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
    .findByID({ collection: "services", id: Number(id), depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateService.bind(null, doc.id);
  const boundDelete = deleteService.bind(null, doc.id, doc.name);
  const real = doc.real;

  const productTour = [0, 1, 2, 3].map((i) => {
    const row = real?.productTour?.[i];
    if (!row) return { photoId: "", photoUrl: undefined, alt: "" };
    return { photoId: String(typeof row.photo === "object" ? row.photo?.id ?? "" : row.photo ?? ""), photoUrl: mediaUrl(row.photo), alt: row.alt ?? "" };
  });

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

      {saved ? (
        <p className="type-body-sm mb-6 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <ServiceForm
        action={boundUpdate}
        values={{
          name: doc.name,
          description: doc.description,
          stats: doc.stats,
          accessPortalHref: doc.accessPortalHref ?? "",
          sections: doc.sections,
          imageUrl: mediaUrl(doc.image),
          tagline: real?.tagline ?? "",
          aboutSecondParagraph: real?.aboutSecondParagraph ?? "",
          hideAboutSecondParagraph: real?.hideAboutSecondParagraph ?? false,
          calloutText: real?.calloutText ?? "",
          statistics: real?.statistics?.map((s) => s.value) ?? [],
          keyFeatures:
            real?.keyFeatures?.map((s, i) => ({ value: s.value, description: real?.keyFeatureDescriptions?.[i]?.value ?? "" })) ?? [],
          hideStatFeatureCards: real?.hideStatFeatureCards ?? false,
          aboutLinkModalLabel: real?.aboutLinkModal?.label ?? "",
          aboutLinkModalTitle: real?.aboutLinkModal?.title ?? "",
          aboutLinkModalItems: real?.aboutLinkModal?.items?.map((i) => i.value) ?? [],
          productTour,
          productTourCaption: real?.productTourCaption ?? "",
          eligibility: real?.eligibility?.map((s) => s.value) ?? [],
          whatYoullNeed: real?.whatYoullNeed?.map((s) => s.value) ?? [],
          getStartedIntro: real?.getStartedIntro ?? "",
          getStartedSteps: real?.getStartedSteps?.map((s) => ({ title: s.title, description: s.description })) ?? [],
          suppressGetStartedSteps: real?.suppressGetStartedSteps ?? false,
          getStartedOutro: real?.getStartedOutro ?? "",
          directLinkLabel: real?.directLinkLabel ?? "",
          faqs: real?.faqs?.map((f) => ({ q: f.q, a: f.a })) ?? [],
          faqsMore: real?.faqsMore?.map((f) => ({ q: f.q, a: f.a })) ?? [],
          comingSoon: real?.comingSoon ?? false,
          gatedAccess: real?.gatedAccess ?? false,
          ctaLabel: real?.ctaLabel ?? "",
          ctaHref: real?.ctaHref ?? "",
          relatedCardStats: real?.relatedCardStats ?? "",
          typeLabel: real?.typeLabel ?? "",
          contactEmail: real?.contact?.email ?? "",
          contactPhone: real?.contact?.phone ?? "",
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
