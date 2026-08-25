import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { Locale } from "@/lib/locale";

export type CmsPageHero = { eyebrow: string; heading: string; body: string };
export type CmsReachUsPanel = { eyebrow: string; title: string; description: string; ctaLabel: string };
export type CmsViewAllInitiativesButton = { label: string; href: string };
export type CmsServiceDetailFooterHeadings = {
  exploreMoreEyebrow: string;
  exploreMoreHeading: string;
  supportEyebrow: string;
  supportHeading: string;
  helplineLabel: string;
  emailLabel: string;
  officeLabel: string;
};

export type CmsSiteCopy = {
  announcementsHero: CmsPageHero;
  governmentOrdersHero: CmsPageHero;
  policiesHero: CmsPageHero;
  mediaHero: CmsPageHero;
  citizenServicesHero: CmsPageHero;
  initiativesProjectsHero: CmsPageHero;
  reachUsHero: CmsPageHero;
  reachUsPanels: CmsReachUsPanel[];
  viewAllInitiativesButton: CmsViewAllInitiativesButton;
  serviceDetailFooterHeadings: CmsServiceDetailFooterHeadings;
};

export const getSiteCopy = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsSiteCopy> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "site-copy-content", locale, overrideAccess: false });
    return {
      announcementsHero: doc.announcementsHero,
      governmentOrdersHero: doc.governmentOrdersHero,
      policiesHero: doc.policiesHero,
      mediaHero: doc.mediaHero,
      citizenServicesHero: doc.citizenServicesHero,
      initiativesProjectsHero: doc.initiativesProjectsHero,
      reachUsHero: doc.reachUsHero,
      reachUsPanels: (doc.reachUsPanels ?? []).map((p) => ({
        eyebrow: p.eyebrow,
        title: p.title,
        description: p.description,
        ctaLabel: p.ctaLabel,
      })),
      viewAllInitiativesButton: doc.viewAllInitiativesButton,
      serviceDetailFooterHeadings: doc.serviceDetailFooterHeadings,
    };
  },
  ["site-copy-content"],
  { revalidate: 60, tags: ["site-copy-content"] }
);
