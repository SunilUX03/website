import { getPayloadClient } from "@/lib/payload-client";
import type { Service, Media } from "@/payload-types";
import { type CmsRealContent, type CmsServiceItemDetail } from "@/lib/cms/service-types";

export type {
  CmsServiceItem,
  CmsServiceItemDetail,
  CmsRealContent,
  ServiceSection,
  ServiceItemType,
} from "@/lib/cms/service-types";
export { getServiceItemsBySection, getServiceItemsByNames } from "@/lib/cms/service-types";

function mediaUrl(value: number | Media | null | undefined): string {
  return typeof value === "object" && value !== null ? value.url ?? "" : "";
}

function toStringArray(value: { value: string }[] | null | undefined): string[] {
  return value?.map((v) => v.value) ?? [];
}

/** Whether the original static data would have set a `real` block at
 * all — every item that has one always populates at least these
 * required-within-RealContent fields (statistics/keyFeatures/
 * eligibility/whatYoullNeed/faqs), even if nothing else is filled in.
 * TNGIS and GRAINS never had a `real` block, and an editor who hasn't
 * touched any of these fields yet shouldn't get an empty `real` object
 * either — that would wrongly skip service-detail-generator.ts's
 * generated-fallback branch (which checks `if (item.real)`). */
function hasRealContent(doc: Service): boolean {
  const r = doc.real;
  return Boolean(
    r &&
      ((r.statistics?.length ?? 0) > 0 ||
        (r.keyFeatures?.length ?? 0) > 0 ||
        (r.eligibility?.length ?? 0) > 0 ||
        (r.whatYoullNeed?.length ?? 0) > 0 ||
        (r.faqs?.length ?? 0) > 0)
  );
}

function toCmsRealContent(doc: Service): CmsRealContent | undefined {
  if (!hasRealContent(doc)) return undefined;
  const r = doc.real!;
  return {
    statistics: toStringArray(r.statistics),
    keyFeatures: toStringArray(r.keyFeatures),
    keyFeatureDescriptions: r.keyFeatureDescriptions ? toStringArray(r.keyFeatureDescriptions) : undefined,
    eligibility: toStringArray(r.eligibility),
    whatYoullNeed: toStringArray(r.whatYoullNeed),
    faqs: r.faqs?.map((f) => ({ q: f.q, a: f.a })) ?? [],
    tagline: r.tagline ?? undefined,
    aboutSecondParagraph: r.aboutSecondParagraph ?? undefined,
    calloutText: r.calloutText ?? undefined,
    aboutLinkModal: r.aboutLinkModal?.label
      ? {
          label: r.aboutLinkModal.label,
          title: r.aboutLinkModal.title ?? "",
          items: toStringArray(r.aboutLinkModal.items),
        }
      : undefined,
    hideStatFeatureCards: r.hideStatFeatureCards ?? undefined,
    productTour: r.productTour?.length
      ? r.productTour.map((p) => ({ src: mediaUrl(p.photo), alt: p.alt }))
      : undefined,
    productTourCaption: r.productTourCaption ?? undefined,
    getStartedSteps: r.getStartedSteps ?? undefined,
    suppressGetStartedSteps: r.suppressGetStartedSteps ?? undefined,
    directLinkLabel: r.directLinkLabel ?? undefined,
    getStartedIntro: r.getStartedIntro ?? undefined,
    getStartedOutro: r.getStartedOutro ?? undefined,
    comingSoon: r.comingSoon ?? undefined,
    relatedCardStats: r.relatedCardStats ?? undefined,
    gatedAccess: r.gatedAccess ?? undefined,
    ctaLabel: r.ctaLabel ?? undefined,
    ctaHref: r.ctaHref ?? undefined,
    hideAboutSecondParagraph: r.hideAboutSecondParagraph ?? undefined,
    typeLabel: r.typeLabel ?? undefined,
    faqsMore: r.faqsMore?.length ? r.faqsMore.map((f) => ({ q: f.q, a: f.a })) : undefined,
    contact: r.contact?.email || r.contact?.phone ? { email: r.contact.email ?? undefined, phone: r.contact.phone ?? undefined } : undefined,
  };
}

function toCmsServiceItemDetail(doc: Service): CmsServiceItemDetail {
  return {
    name: doc.name,
    description: doc.description,
    stats: doc.stats,
    image: mediaUrl(doc.image),
    accessPortalHref: doc.accessPortalHref ?? undefined,
    knowMoreHref: `/services/${doc.slug}`,
    real: toCmsRealContent(doc),
    sections: doc.sections,
    slug: doc.slug,
    type: doc.accessPortalHref ? "project" : "service",
    section: doc.sections[0],
  };
}

/** All published services, in one Local API call — callers (the
 * /services page, homepage pillar resolution) filter/search this in
 * memory rather than each issuing their own query, mirroring how
 * services-content.ts derived citizenServices/eGovernanceProjects/
 * sharedServices/allServiceItems from one underlying array. */
export async function getAllServiceItems(): Promise<CmsServiceItemDetail[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "services",
    depth: 2,
    limit: 200,
    sort: "order",
    overrideAccess: false,
  });
  return result.docs.map(toCmsServiceItemDetail);
}

export async function getServiceItemBySlug(slug: string): Promise<CmsServiceItemDetail | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "services",
    depth: 2,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: false,
  });
  const doc = result.docs[0];
  return doc ? toCmsServiceItemDetail(doc) : null;
}
