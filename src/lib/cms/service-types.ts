/** Mirrors the old ServiceItem/RealContent/ServiceItemDetail shape from
 * lib/services-content.ts field for field, on purpose — kept separate
 * from services.ts (which imports the Payload Local API, server-only)
 * for the same reason as announcement-types.ts: ServicesTabs.tsx and
 * PillarCards.tsx are both client components. Keeping the exact old
 * shape means service-detail-generator.ts and ServiceDetailContent.tsx
 * need no logic changes — only the data source moved. */

export type ServiceSection = "citizen-services" | "e-governance-projects" | "services";

export interface CmsRealContent {
  statistics: string[];
  keyFeatures: string[];
  keyFeatureDescriptions?: string[];
  eligibility: string[];
  whatYoullNeed: string[];
  faqs: { q: string; a: string }[];
  tagline?: string;
  aboutSecondParagraph?: string;
  calloutText?: string;
  aboutLinkModal?: { label: string; title: string; items: string[] };
  hideStatFeatureCards?: boolean;
  productTour?: { src: string; alt: string }[];
  productTourCaption?: string;
  getStartedSteps?: { title: string; description: string }[];
  /** Explicitly hides the Get Started steps section (e.g. intro/outro
   * prose only) — needed because Payload can't distinguish "explicitly
   * emptied array" from "field never touched" the way static code could
   * write `getStartedSteps: []`. */
  suppressGetStartedSteps?: boolean;
  directLinkLabel?: string;
  getStartedIntro?: string;
  getStartedOutro?: string;
  comingSoon?: boolean;
  relatedCardStats?: string;
  gatedAccess?: boolean;
  /** Free-text override for the main CTA button (Hero and card) — wins
   * over the automatic Access Portal / Avail Service / Coming Soon
   * label whenever it's set. */
  ctaLabel?: string;
  /** Where `ctaLabel` goes; falls back to `accessPortalHref` if blank. */
  ctaHref?: string;
  hideAboutSecondParagraph?: boolean;
  typeLabel?: "Project" | "Service";
  faqsMore?: { q: string; a: string }[];
  contact?: { email?: string; phone?: string };
}

export type CmsServiceItem = {
  name: string;
  description: string;
  stats: string;
  image: string;
  accessPortalHref?: string;
  knowMoreHref: string;
  real?: CmsRealContent;
  sections: ServiceSection[];
};

export type ServiceItemType = "project" | "service";

export interface CmsServiceItemDetail extends CmsServiceItem {
  slug: string;
  type: ServiceItemType;
  section: ServiceSection;
}

/** Splits a " · "-joined stats/metrics line back into individual bullet
 * points — reused as-is for the detail page's Key Features / Impact list
 * so that content stays exactly the verified copy already on the card,
 * never invented. */
export function statsToBullets(stats: string): string[] {
  return stats.split("·").map((s) => s.trim()).filter(Boolean);
}

export function getServiceItemsBySection(
  items: CmsServiceItemDetail[],
  section: ServiceSection
): CmsServiceItemDetail[] {
  return items.filter((item) => item.sections.includes(section));
}

/** Resolves a list of item names (as referenced by Home's pillar bands)
 * to the canonical service items — same throw-rather-than-silently-drop
 * behavior as the original services-content.ts helper. */
export function getServiceItemsByNames(
  items: CmsServiceItemDetail[],
  names: string[]
): CmsServiceItemDetail[] {
  return names.map((name) => {
    const item = items.find((candidate) => candidate.name === name);
    if (!item) {
      throw new Error(`Unknown service item "${name}". Expected one of: ${items.map((i) => i.name).join(", ")}`);
    }
    return item;
  });
}
