import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { Media } from "@/payload-types";
import type { CmsPillarChrome } from "@/lib/cms/pillars-content-types";

export type { CmsPillarChrome } from "@/lib/cms/pillars-content-types";

export const getPillarsContent = unstable_cache(
  async (): Promise<CmsPillarChrome[]> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "pillars-content", depth: 1, overrideAccess: false });
    return (doc.pillars ?? []).map((p) => ({
      title: p.title,
      description: p.description,
      linkLabel: p.linkLabel,
      bannerImage: typeof p.bannerImage === "object" && p.bannerImage ? (p.bannerImage as Media).url ?? null : null,
    }));
  },
  ["pillars-content"],
  { revalidate: 60, tags: ["pillars-content"] }
);
