// Copy and filter config for /notifications/media-press.
//
// The photo/video items themselves live in the CMS now (see
// lib/cms/media-items.ts), not here — this file only keeps the static
// hero copy and the facet-building logic, which still needs the fetched
// list to derive year options from.

import type { Facet } from "@/components/documents/FilterBar";
import { type CmsMediaItem, yearOf } from "@/lib/cms/media-item-types";
import type { Locale } from "@/lib/locale";

export const heroOrbs = [
  { color: "mint", className: "-left-16 -top-24 h-[420px] w-[420px]" },
  { color: "sky", className: "-bottom-10 right-[60px] h-[340px] w-[340px]" },
] as const;

/**
 * Year options derived from the items themselves, so the dropdown can't
 * offer a year with no media or hide media from a year it forgot to list.
 */
export function buildFacets(items: CmsMediaItem[], locale: Locale): Facet[] {
  const years = Array.from(new Set(items.map((m) => yearOf(m.date)).filter(Boolean))).sort(
    (a, b) => Number(b) - Number(a)
  );
  return [
    {
      id: "year",
      kind: "select",
      ariaLabel: locale === "ta" ? "ஆண்டு வாரியாக வடிகட்டு" : "Filter by year",
      initial: "all",
      options: [
        { value: "all", label: locale === "ta" ? "அனைத்து ஆண்டுகளும்" : "All Years" },
        ...years.map((y) => ({ value: y, label: y })),
      ],
    },
  ];
}

export function getSearchPlaceholder(locale: Locale): string {
  return locale === "ta" ? "புகைப்படங்கள் & வீடியோக்களைத் தேடுங்கள்..." : "Search photos and videos...";
}

export function getSearchAriaLabel(locale: Locale): string {
  return locale === "ta" ? "புகைப்படங்கள் & வீடியோக்களைத் தேடுங்கள்" : "Search photos and videos";
}

export function getFilterBarLabel(locale: Locale): string {
  return locale === "ta" ? "ஊடகத்தை வடிகட்டு" : "Filter media";
}

export function getNoResultsText(locale: Locale): string {
  return locale === "ta" ? "உங்கள் வடிகட்டிகளுடன் பொருந்தும் ஊடகம் இல்லை." : "No media matches your filters.";
}
