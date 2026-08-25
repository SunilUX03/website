import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { Media } from "@/payload-types";

export type CmsSiteIdentity = {
  emblemUrl: string;
  emblemWidth: number;
  emblemHeight: number;
  markUrl: string;
  markWidth: number;
  markHeight: number;
  /** Browser tab icon — falls back to the TNeGA mark above when no
   * dedicated favicon has been uploaded (see SiteIdentity.ts). */
  faviconUrl: string;
  nameTamil: string;
  nameEnglish: string;
};

/** Fallback used only if the global has somehow never been seeded —
 * keeps the header/footer from crashing rather than rendering empty. */
const EMPTY: CmsSiteIdentity = {
  emblemUrl: "",
  emblemWidth: 512,
  emblemHeight: 512,
  markUrl: "",
  markWidth: 512,
  markHeight: 512,
  faviconUrl: "",
  nameTamil: "",
  nameEnglish: "",
};

/** The government emblem, TNeGA mark, and bilingual organisation name —
 * shared by MainNav (header) and FooterClient (footer) via one fetch, so
 * there's exactly one place to update the branding (see SiteIdentity.ts
 * for why this isn't split across nav-content/footer-content instead).
 * Not locale-scoped: both name lines always render together regardless
 * of the active site locale, and the images aren't translated. Cached
 * the same way as nav-content/footer-content — renders on every page,
 * most of which declare no `revalidate` of their own. */
export const getSiteIdentity = unstable_cache(
  async (): Promise<CmsSiteIdentity> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "site-identity", depth: 1, overrideAccess: false });
    if (!doc) return EMPTY;
    const emblem = typeof doc.emblemImage === "object" && doc.emblemImage ? (doc.emblemImage as Media) : null;
    const mark = typeof doc.markImage === "object" && doc.markImage ? (doc.markImage as Media) : null;
    const favicon = typeof doc.faviconImage === "object" && doc.faviconImage ? (doc.faviconImage as Media) : null;
    return {
      emblemUrl: emblem?.url ?? "",
      emblemWidth: emblem?.width ?? EMPTY.emblemWidth,
      emblemHeight: emblem?.height ?? EMPTY.emblemHeight,
      markUrl: mark?.url ?? "",
      markWidth: mark?.width ?? EMPTY.markWidth,
      markHeight: mark?.height ?? EMPTY.markHeight,
      faviconUrl: favicon?.url ?? mark?.url ?? "",
      nameTamil: doc.nameTamil ?? "",
      nameEnglish: doc.nameEnglish ?? "",
    };
  },
  ["site-identity"],
  { revalidate: 60, tags: ["site-identity"] }
);
