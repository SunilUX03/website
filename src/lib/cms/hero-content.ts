import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { CmsHeroContent } from "@/lib/cms/hero-content-types";

export type { CmsHeroContent } from "@/lib/cms/hero-content-types";

const EMPTY: CmsHeroContent = {
  agencyLabelCycle: [],
  headlineTemplate: "",
  headlineCycleWords: [],
  tagline: "",
};

export const getHeroContent = unstable_cache(
  async (): Promise<CmsHeroContent> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "hero-content", depth: 0, overrideAccess: false });
    if (!doc) return EMPTY;
    return {
      agencyLabelCycle: doc.agencyLabelCycle?.map((l) => l.text) ?? [],
      headlineTemplate: doc.headlineTemplate,
      headlineCycleWords: doc.headlineCycleWords?.map((w) => w.word) ?? [],
      tagline: doc.tagline,
    };
  },
  ["hero-content"],
  { revalidate: 60, tags: ["hero-content"] }
);
