import { ServiceForm } from "../ServiceForm";
import { createService } from "../actions";

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="type-display-sm text-ink">New initiative/project</h1>
      <p className="type-body-sm mb-6 mt-1.5 max-w-[680px] text-[var(--color-muted)]">
        This form fills in the English content first. Once you save, open the item from the list and use the
        English / தமிழ் tabs at the top of its edit page to add the Tamil translation.
      </p>
      <ServiceForm
        action={createService}
        error={error}
        values={{
          typeLabel: "",
          name: "",
          description: "",
          stats: "",
          accessPortalHref: "",
          sections: [],
          ctaLabel: "",
          comingSoon: false,
          gatedAccess: false,
          aboutEyebrow: "",
          aboutHeading: "",
          tagline: "",
          aboutSecondParagraph: "",
          hideAboutSecondParagraph: false,
          calloutText: "",
          statistics: [],
          aboutLinkModalLabel: "",
          aboutLinkModalTitle: "",
          aboutLinkModalItems: [],
          featuresEyebrow: "",
          featuresHeading: "",
          hideFeaturesSection: false,
          keyFeatures: [],
          productTourHeading: "",
          hideProductTourSection: false,
          productTour: [
            { photoId: "", alt: "" },
            { photoId: "", alt: "" },
            { photoId: "", alt: "" },
            { photoId: "", alt: "" },
          ],
          eligibilityEyebrow: "",
          eligibilityHeading: "",
          eligibilityWhoHeading: "",
          eligibilityDocsHeading: "",
          hideEligibilitySection: false,
          eligibility: [],
          whatYoullNeed: [],
          getStartedEyebrow: "",
          getStartedHeading: "",
          hideGetStartedSection: false,
          getStartedIntro: "",
          getStartedSteps: [],
          suppressGetStartedSteps: false,
          getStartedOutro: "",
          directLinkLabel: "",
          directLinkPortalLabel: "",
          faqEyebrow: "",
          faqHeading: "",
          hideFaqSection: false,
          faqs: [],
          faqsMore: [],
          contactEmail: "",
          contactPhone: "",
        }}
      />
    </div>
  );
}
