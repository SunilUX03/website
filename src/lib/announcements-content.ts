// Copy and filter config for /notifications/announcements.
//
// The announcement items themselves live in the CMS now (see
// lib/cms/announcements.ts), not here — this file only keeps the static
// copy and the facet-building logic, which still needs the fetched list
// to derive year options from.

import type { Facet } from "@/components/documents/FilterBar";
import { type CmsAnnouncement, yearOf } from "@/lib/cms/announcement-types";

export const heroOrbs = [
  { color: "lavender", className: "-left-16 -top-24 h-[420px] w-[420px]" },
  { color: "mint", className: "-bottom-10 right-[60px] h-[340px] w-[340px]" },
] as const;

export const listHeading = "Latest from TNeGA";

/**
 * Year options are derived from the items themselves rather than being
 * hand-listed. The document pages inherited hard-coded year lists from
 * the prototypes, and two of them ended up offering years with no rows
 * while hiding rows whose year wasn't in the list. Deriving avoids that
 * failure mode entirely — add an announcement from any year and its
 * option appears automatically.
 */
export function buildFacets(items: CmsAnnouncement[]): Facet[] {
  const years = Array.from(new Set(items.map((a) => yearOf(a.timestamp)).filter(Boolean))).sort(
    (a, b) => Number(b) - Number(a)
  );
  return [
    {
      id: "year",
      kind: "select",
      ariaLabel: "Filter by year",
      initial: "all",
      options: [{ value: "all", label: "All Years" }, ...years.map((y) => ({ value: y, label: y }))],
    },
  ];
}

export const searchPlaceholder = "Search announcements...";
export const searchAriaLabel = "Search announcements";
export const filterBarLabel = "Filter announcements";
export const noResultsText = "No announcements match your filters.";
