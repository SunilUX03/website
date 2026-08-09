import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { CmsAboutPageContent } from "@/lib/cms/about-types";

export type { CmsAboutPageContent } from "@/lib/cms/about-types";

const EMPTY: CmsAboutPageContent = {
  hero: { eyebrow: "", headline: "", description: "" },
  whoWeAre: { heading: "", paragraph: "" },
  hierarchy: [],
  visionMission: [],
  connectWithUs: { email: "", social: [] },
};

export const getAboutPageContent = unstable_cache(
  async (): Promise<CmsAboutPageContent> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "about-page-content", depth: 0, overrideAccess: false });
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
    };
  },
  ["about-page-content"],
  { revalidate: 60, tags: ["about-page-content"] }
);
