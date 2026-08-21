import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { Locale } from "@/lib/locale";

export type NavLink = { label: string; href: string };

export type CmsNavContent = {
  govLabel: string;
  about: NavLink[];
  services: NavLink[];
  notificationsUpdates: NavLink[];
  notificationsDocuments: NavLink[];
};

/** Fallback used only if the global has somehow never been seeded —
 * keeps the header from rendering empty rather than crashing. */
const EMPTY: CmsNavContent = {
  govLabel: "",
  about: [],
  services: [],
  notificationsUpdates: [],
  notificationsDocuments: [],
};

/** TopNav renders on every page, most of which declare no `revalidate`
 * of their own (unlike the Announcements/MediaItems/JobOpenings pages) —
 * wrapping the fetch itself in unstable_cache means nav data still
 * self-revalidates every 60s without having to add `export const
 * revalidate` to every single page.tsx in the app. */
export const getNavContent = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsNavContent> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "nav-content", locale, depth: 0, overrideAccess: false });
    if (!doc) return EMPTY;
    return {
      govLabel: doc.govLabel,
      about: doc.about?.map((l) => ({ label: l.label, href: l.href })) ?? [],
      services: doc.services?.map((l) => ({ label: l.label, href: l.href })) ?? [],
      notificationsUpdates: doc.notificationsUpdates?.map((l) => ({ label: l.label, href: l.href })) ?? [],
      notificationsDocuments: doc.notificationsDocuments?.map((l) => ({ label: l.label, href: l.href })) ?? [],
    };
  },
  ["nav-content"],
  { revalidate: 60, tags: ["nav-content"] }
);
