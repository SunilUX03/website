import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { Media } from "@/payload-types";
import type { CmsLeadershipBand } from "@/lib/cms/leadership-band-types";
import type { Locale } from "@/lib/locale";

export type { CmsLeadershipBand, CmsLeader } from "@/lib/cms/leadership-band-types";

const EMPTY: CmsLeadershipBand = { heading: "", description: "", leaders: [] };

export const getLeadershipBand = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsLeadershipBand> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "leadership-band-content", locale, depth: 1, overrideAccess: false });
    if (!doc) return EMPTY;
    return {
      heading: doc.heading,
      description: doc.description,
      leaders: (doc.leaders ?? []).map((l) => ({
        name: l.name,
        title: l.title,
        photo: typeof l.photo === "object" && l.photo !== null ? (l.photo as Media).url ?? "" : "",
        photoPosition: l.photoPosition ?? "50% 50%",
        quote: l.quote ?? null,
      })),
    };
  },
  ["leadership-band-content"],
  { revalidate: 60, tags: ["leadership-band-content"] }
);
