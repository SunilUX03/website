import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { CmsHeroContent } from "@/lib/cms/hero-content-types";
import type { Media } from "@/payload-types";
import type { Locale } from "@/lib/locale";

export type { CmsHeroContent } from "@/lib/cms/hero-content-types";

const EMPTY: CmsHeroContent = {
  agencyLabelCycle: [],
  headlineTemplate: "",
  headlineCycleWords: [],
  tagline: "",
  mapImageUrl: "",
  mapImageWidth: 512,
  mapImageHeight: 512,
};

export const getHeroContent = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsHeroContent> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "hero-content", locale, depth: 1, overrideAccess: false });
    if (!doc) return EMPTY;
    const mapImage = typeof doc.mapImage === "object" && doc.mapImage ? (doc.mapImage as Media) : null;
    const backgroundImage = typeof doc.backgroundImage === "object" && doc.backgroundImage ? (doc.backgroundImage as Media) : null;
    return {
      agencyLabelCycle: doc.agencyLabelCycle?.map((l) => l.text) ?? [],
      headlineTemplate: doc.headlineTemplate,
      headlineCycleWords: doc.headlineCycleWords?.map((w) => w.word) ?? [],
      tagline: doc.tagline,
      mapImageUrl: mapImage?.url ?? "",
      mapImageWidth: mapImage?.width ?? EMPTY.mapImageWidth,
      mapImageHeight: mapImage?.height ?? EMPTY.mapImageHeight,
      backgroundImageUrl: backgroundImage?.url ?? undefined,
    };
  },
  ["hero-content"],
  { revalidate: 60, tags: ["hero-content"] }
);
