// Copy and filter config for /notifications/media-press.
//
// The photo/video items themselves live in the CMS now (see
// lib/cms/media-items.ts), not here — this file only keeps the static
// hero copy and the facet-building logic, which still needs the fetched
// list to derive year options from.

import type { Facet } from "@/components/documents/FilterBar";
import { type CmsMediaItem, yearOf } from "@/lib/cms/media-item-types";

export const heroOrbs = [
  { color: "mint", className: "-left-16 -top-24 h-[420px] w-[420px]" },
  { color: "sky", className: "-bottom-10 right-[60px] h-[340px] w-[340px]" },
] as const;

/**
 * Year options derived from the items themselves, so the dropdown can't
 * offer a year with no media or hide media from a year it forgot to list.
 */
export function buildFacets(items: CmsMediaItem[]): Facet[] {
  const years = Array.from(new Set(items.map((m) => yearOf(m.date)).filter(Boolean))).sort(
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

export const searchPlaceholder = "Search photos and videos...";
export const searchAriaLabel = "Search photos and videos";
export const filterBarLabel = "Filter media";
export const noResultsText = "No media matches your filters.";
