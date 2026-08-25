import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { Media } from "@/payload-types";
import type { CmsPillarsContent } from "@/lib/cms/pillars-content-types";
import type { Locale } from "@/lib/locale";

export type { CmsPillarChrome, CmsPillarsContent } from "@/lib/cms/pillars-content-types";

export const getPillarsContent = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsPillarsContent> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "pillars-content", locale, depth: 1, overrideAccess: false });
    return {
      eyebrow: doc.eyebrow,
      heading: doc.heading,
      pillars: (doc.pillars ?? []).map((p) => ({
        title: p.title,
        linkLabel: p.linkLabel,
        bannerImage: typeof p.bannerImage === "object" && p.bannerImage ? (p.bannerImage as Media).url ?? null : null,
      })),
    };
  },
  ["pillars-content"],
  { revalidate: 60, tags: ["pillars-content"] }
);
