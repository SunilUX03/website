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
          calloutText: "",
          statistics: [],
          keyFeatures: [],
          eligibility: [],
          whatYoullNeed: [],
          faqs: [],
          comingSoon: false,
          gatedAccess: false,
          typeLabel: "",
          contactEmail: "",
          contactPhone: "",
        }}
      />
    </div>
  );
}
