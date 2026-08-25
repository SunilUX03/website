import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { CmsAboutPageContent } from "@/lib/cms/about-types";
import type { Locale } from "@/lib/locale";

export type { CmsAboutPageContent } from "@/lib/cms/about-types";

const EMPTY_SECTION = { eyebrow: "", heading: "" };

const EMPTY: CmsAboutPageContent = {
  hero: { eyebrow: "", headline: "", description: "" },
  whoWeAre: { heading: "", paragraph: "" },
  hierarchy: [],
  visionMission: [],
  connectWithUs: { email: "", social: [] },
  orgChartSection: EMPTY_SECTION,
  leadershipSection: EMPTY_SECTION,
  boardSection: EMPTY_SECTION,
  awardsSection: EMPTY_SECTION,
  rollOfHonourSection: EMPTY_SECTION,
};

export const getAboutPageContent = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsAboutPageContent> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "about-page-content", locale, depth: 0, overrideAccess: false });
    if (!doc) return EMPTY;
    return {
      hero: {
        eyebrow: doc.hero?.eyebrow ?? "",
        headline: doc.hero?.headline ?? "",
        description: doc.hero?.description ?? "",
      },
      whoWeAre: { heading: doc.whoWeAre?.heading ?? "", paragraph: doc.whoWeAre?.paragraph ?? "" },
      hierarchy: doc.hierarchy?.map((h) => ({ label: h.label, emphasized: h.emphasized ?? false })) ?? [],
      visionMission: doc.visionMission?.map((v) => ({ label: v.label, title: v.title, description: v.description })) ?? [],
      connectWithUs: {
        email: doc.connectWithUs?.email ?? "",
        social: doc.connectWithUs?.social?.map((s) => ({ label: s.label, href: s.href })) ?? [],
      },
      orgChartSection: { eyebrow: doc.orgChartSection?.eyebrow ?? "", heading: doc.orgChartSection?.heading ?? "" },
      leadershipSection: { eyebrow: doc.leadershipSection?.eyebrow ?? "", heading: doc.leadershipSection?.heading ?? "" },
      boardSection: { eyebrow: doc.boardSection?.eyebrow ?? "", heading: doc.boardSection?.heading ?? "" },
      awardsSection: { eyebrow: doc.awardsSection?.eyebrow ?? "", heading: doc.awardsSection?.heading ?? "" },
      rollOfHonourSection: { eyebrow: doc.rollOfHonourSection?.eyebrow ?? "", heading: doc.rollOfHonourSection?.heading ?? "" },
    };
  },
  ["about-page-content"],
  { revalidate: 60, tags: ["about-page-content"] }
);
