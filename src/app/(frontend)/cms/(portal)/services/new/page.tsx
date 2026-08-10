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
      <h1 className="type-display-sm mb-6 text-ink">New service/project</h1>
      <ServiceForm
        action={createService}
        error={error}
        values={{
          name: "",
          description: "",
          stats: "",
          accessPortalHref: "",
          sections: [],
          tagline: "",
          aboutSecondParagraph: "",
          hideAboutSecondParagraph: false,
          calloutText: "",
          statistics: [],
          keyFeatures: [],
          hideStatFeatureCards: false,
          aboutLinkModalLabel: "",
          aboutLinkModalTitle: "",
          aboutLinkModalItems: [],
          productTour: [
            { photoId: "", alt: "" },
            { photoId: "", alt: "" },
            { photoId: "", alt: "" },
            { photoId: "", alt: "" },
          ],
          productTourCaption: "",
          eligibility: [],
          whatYoullNeed: [],
          getStartedIntro: "",
          getStartedSteps: [],
          suppressGetStartedSteps: false,
          getStartedOutro: "",
          directLinkLabel: "",
          faqs: [],
          faqsMore: [],
          comingSoon: false,
          gatedAccess: false,
          ctaLabel: "",
          ctaHref: "",
          relatedCardStats: "",
          typeLabel: "",
          contactEmail: "",
          contactPhone: "",
        }}
      />
    </div>
  );
}
