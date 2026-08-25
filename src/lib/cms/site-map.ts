import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { Locale } from "@/lib/locale";

export type CmsSiteMapGroup = { heading: string; links: { label: string; href: string }[] };

const EMPTY: CmsSiteMapGroup[] = [];

/** Groups the flat `links` array by `groupHeading`, preserving the order
 * each heading first appears in — not by adjacency, since an admin
 * reordering or inserting rows via RepeatableRows doesn't guarantee rows
 * sharing a heading stay next to each other. */
function groupLinks(rows: { groupHeading: string; label: string; href: string }[]): CmsSiteMapGroup[] {
  const order: string[] = [];
  const byHeading = new Map<string, { label: string; href: string }[]>();
  for (const row of rows) {
    if (!byHeading.has(row.groupHeading)) {
      byHeading.set(row.groupHeading, []);
      order.push(row.groupHeading);
    }
    byHeading.get(row.groupHeading)!.push({ label: row.label, href: row.href });
  }
  return order.map((heading) => ({ heading, links: byHeading.get(heading)! }));
}

/** Renders on the /sitemap page only, not every page — no unstable_cache
 * revalidate treatment needed the way nav/footer/site-identity get it,
 * since that page can declare its own `revalidate` if it ever needs to. */
export const getSiteMap = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsSiteMapGroup[]> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "site-map-content", locale, depth: 0, overrideAccess: false });
    if (!doc?.links) return EMPTY;
    return groupLinks(doc.links.map((r) => ({ groupHeading: r.groupHeading, label: r.label, href: r.href })));
  },
  ["site-map-content"],
  { revalidate: 60, tags: ["site-map-content"] }
);
