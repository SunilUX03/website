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
  productTour?: { src: string; alt: string }[];
  getStartedSteps?: { title: string; description: string }[];
  /** Explicitly hides the Get Started steps section (e.g. intro/outro
   * prose only) — needed because Payload can't distinguish "explicitly
   * emptied array" from "field never touched" the way static code could
   * write `getStartedSteps: []`. */
  suppressGetStartedSteps?: boolean;
  directLinkLabel?: string;
  directLinkPortalLabel?: string;
  getStartedIntro?: string;
  getStartedOutro?: string;
  comingSoon?: boolean;
  gatedAccess?: boolean;
  /** Free-text override for the main CTA button (Hero and card) — wins
   * over the automatic Access Portal / Avail Service / Coming Soon
   * label whenever it's set. Always links to `accessPortalHref`. */
  ctaLabel?: string;
  hideAboutSecondParagraph?: boolean;
  /** Required going forward — every item explicitly declares which it
   * is, no automatic/inferred badge any more. */
  typeLabel?: "Project" | "Initiative";
  faqsMore?: { q: string; a: string }[];
  contact?: { email?: string; phone?: string };
  // Per-section eyebrow/heading overrides — every one falls back to a
  // generated default (see ServiceDetailContent.tsx) when left blank.
  aboutEyebrow?: string;
  aboutHeading?: string;
  featuresEyebrow?: string;
  featuresHeading?: string;
  hideFeaturesSection?: boolean;
  productTourHeading?: string;
  hideProductTourSection?: boolean;
  eligibilityEyebrow?: string;
  eligibilityHeading?: string;
  eligibilityWhoHeading?: string;
  eligibilityDocsHeading?: string;
  hideEligibilitySection?: boolean;
  getStartedEyebrow?: string;
  getStartedHeading?: string;
  hideGetStartedSection?: boolean;
  faqEyebrow?: string;
  faqHeading?: string;
  hideFaqSection?: boolean;
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
 * to the canonical service items. Logs and skips rather than throwing —
 * this used to throw on a miss (to catch a typo/rename during content
 * work), but that meant one CMS item going missing (a mistaken delete,
 * a database rollback, anything outside a content edit gone wrong) took
 * the entire homepage down for every visitor. A missing pillar-card item
 * is a visible content bug worth fixing; it shouldn't be a 500. */
export function getServiceItemsByNames(
  items: CmsServiceItemDetail[],
  names: string[]
): CmsServiceItemDetail[] {
  return names.flatMap((name) => {
    const item = items.find((candidate) => candidate.name === name);
    if (!item) {
      console.error(`getServiceItemsByNames: no service item named "${name}" — skipping. Available: ${items.map((i) => i.name).join(", ")}`);
      return [];
    }
    return [item];
  });
}

/** Same as getServiceItemsByNames, but matched by `slug` — a stable,
 * unlocalized identifier — rather than `name`, which returns translated
 * text once `items` was fetched for locale: "ta" and so can never match
 * an English name literal. Prefer this over getServiceItemsByNames for
 * any lookup list that needs to keep working under both locales. */
export function getServiceItemsBySlugs(
  items: CmsServiceItemDetail[],
  slugs: string[]
): CmsServiceItemDetail[] {
  return slugs.flatMap((slug) => {
    const item = items.find((candidate) => candidate.slug === slug);
    if (!item) {
      console.error(`getServiceItemsBySlugs: no service item with slug "${slug}" — skipping. Available: ${items.map((i) => i.slug).join(", ")}`);
      return [];
    }
    return [item];
  });
}
