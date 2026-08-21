import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { CmsFooterContent } from "@/lib/cms/footer-types";
import type { Locale } from "@/lib/locale";

export type { CmsFooterContent, FooterLink } from "@/lib/cms/footer-types";

const EMPTY: CmsFooterContent = {
  description: "",
  address: "",
  mapsHref: "",
  phone: "",
  email: "",
  socialLinks: [],
  quickLinks: [],
  citizenServices: [],
  helpSupport: [],
};

/** Footer renders on every page (like nav-content), most of which
 * declare no `revalidate` of their own — same unstable_cache treatment
 * as nav-content.ts for the same reason. */
export const getFooterContent = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsFooterContent> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "footer-content", locale, depth: 0, overrideAccess: false });
    if (!doc) return EMPTY;
    return {
      description: doc.description,
      address: doc.address,
      mapsHref: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(doc.address.replace(/\n+/g, " ")),
      phone: doc.phone,
      email: doc.email,
      socialLinks: doc.socialLinks?.map((l) => ({ label: l.label, href: l.href })) ?? [],
      quickLinks: doc.quickLinks?.map((l) => ({ label: l.label, href: l.href })) ?? [],
      citizenServices: doc.citizenServices?.map((l) => ({ label: l.label, href: l.href })) ?? [],
      helpSupport: doc.helpSupport?.map((l) => ({ label: l.label, href: l.href })) ?? [],
    };
  },
  ["footer-content"],
  { revalidate: 60, tags: ["footer-content"] }
);
