import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { ServiceForm } from "../../ServiceForm";
import { updateService, deleteService } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";
import type { Media } from "@/payload-types";

function mediaUrl(value: number | Media | null | undefined): string | undefined {
  return typeof value === "object" && value !== null ? value.url ?? undefined : undefined;
}

// `id` on each mapped row is a Payload internal detail worth documenting
// once, here: every localized array field (statistics, keyFeatures, faqs,
// ...) stores its Tamil and English text keyed off the row's own id, not
// its position — a row resubmitted without that id gets treated as brand
// new, and Payload replaces the whole array wholesale, silently deleting
// the *other* locale's translation for every row. So every mapping below
// carries `id: row.id` through even though the visible form fields never
// show it, and ServiceForm/actions.ts round-trip it via a hidden input.
export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ locale?: string; error?: string }>;
}) {
  const { id } = await params;
  const { locale: localeParam, error } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "services", id: Number(id), locale, depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateService.bind(null, doc.id);
  const boundDelete = deleteService.bind(null, doc.id, doc.name);
  const real = doc.real;

  const productTour = [0, 1, 2, 3].map((i) => {
    const row = real?.productTour?.[i];
    if (!row) return { id: undefined, photoId: "", photoUrl: undefined, alt: "" };
    return {
      id: row.id ?? undefined,
      photoId: String(typeof row.photo === "object" ? row.photo?.id ?? "" : row.photo ?? ""),
      photoUrl: mediaUrl(row.photo),
      alt: row.alt ?? "",
    };
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit initiative/project</h1>
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

      <LocaleTabs basePath={`/cms/services/${id}/edit`} current={locale} />

      <ServiceForm
        key={locale}
        action={boundUpdate}
        locale={locale}
        error={error}
        values={{
          typeLabel: real?.typeLabel ?? "",
          name: doc.name,
          description: doc.description,
          stats: doc.stats,
          accessPortalHref: doc.accessPortalHref ?? "",
          sections: doc.sections,
          imageUrl: mediaUrl(doc.image),
          ctaLabel: real?.ctaLabel ?? "",
          comingSoon: real?.comingSoon ?? false,
          gatedAccess: real?.gatedAccess ?? false,
          aboutEyebrow: real?.aboutEyebrow ?? "",
          aboutHeading: real?.aboutHeading ?? "",
          tagline: real?.tagline ?? "",
          aboutSecondParagraph: real?.aboutSecondParagraph ?? "",
          hideAboutSecondParagraph: real?.hideAboutSecondParagraph ?? false,
          calloutText: real?.calloutText ?? "",
          statistics: real?.statistics?.map((s) => ({ id: s.id ?? undefined, value: s.value })) ?? [],
          aboutLinkModalLabel: real?.aboutLinkModal?.label ?? "",
          aboutLinkModalTitle: real?.aboutLinkModal?.title ?? "",
          aboutLinkModalItems: real?.aboutLinkModal?.items?.map((i) => ({ id: i.id ?? undefined, value: i.value })) ?? [],
          featuresEyebrow: real?.featuresEyebrow ?? "",
          featuresHeading: real?.featuresHeading ?? "",
          hideFeaturesSection: real?.hideFeaturesSection ?? false,
          keyFeatures:
            real?.keyFeatures?.map((s, i) => ({
              id: s.id ?? undefined,
              descId: real?.keyFeatureDescriptions?.[i]?.id ?? undefined,
              value: s.value,
              description: real?.keyFeatureDescriptions?.[i]?.value ?? "",
            })) ?? [],
          productTourHeading: real?.productTourHeading ?? "",
          hideProductTourSection: real?.hideProductTourSection ?? false,
          productTour,
          eligibilityEyebrow: real?.eligibilityEyebrow ?? "",
          eligibilityHeading: real?.eligibilityHeading ?? "",
          eligibilityWhoHeading: real?.eligibilityWhoHeading ?? "",
          eligibilityDocsHeading: real?.eligibilityDocsHeading ?? "",
          hideEligibilitySection: real?.hideEligibilitySection ?? false,
          eligibility: real?.eligibility?.map((s) => ({ id: s.id ?? undefined, value: s.value })) ?? [],
          whatYoullNeed: real?.whatYoullNeed?.map((s) => ({ id: s.id ?? undefined, value: s.value })) ?? [],
          getStartedEyebrow: real?.getStartedEyebrow ?? "",
          getStartedHeading: real?.getStartedHeading ?? "",
          hideGetStartedSection: real?.hideGetStartedSection ?? false,
          getStartedIntro: real?.getStartedIntro ?? "",
          getStartedSteps: real?.getStartedSteps?.map((s) => ({ id: s.id ?? undefined, title: s.title, description: s.description })) ?? [],
          suppressGetStartedSteps: real?.suppressGetStartedSteps ?? false,
          getStartedOutro: real?.getStartedOutro ?? "",
          directLinkLabel: real?.directLinkLabel ?? "",
          directLinkPortalLabel: real?.directLinkPortalLabel ?? "",
          faqEyebrow: real?.faqEyebrow ?? "",
          faqHeading: real?.faqHeading ?? "",
          hideFaqSection: real?.hideFaqSection ?? false,
          faqs: real?.faqs?.map((f) => ({ id: f.id ?? undefined, q: f.q, a: f.a })) ?? [],
          faqsMore: real?.faqsMore?.map((f) => ({ id: f.id ?? undefined, q: f.q, a: f.a })) ?? [],
          contactEmail: real?.contact?.email ?? "",
          contactPhone: real?.contact?.phone ?? "",
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
