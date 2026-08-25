// Copy and filter config for /notifications/announcements.
//
// The announcement items themselves live in the CMS now (see
// lib/cms/announcements.ts), not here — this file only keeps the static
// copy and the facet-building logic, which still needs the fetched list
// to derive year options from.

import type { Facet } from "@/components/documents/FilterBar";
import { type CmsAnnouncement, yearOf } from "@/lib/cms/announcement-types";
import type { Locale } from "@/lib/locale";

export const heroOrbs = [
  { color: "lavender", className: "-left-16 -top-24 h-[420px] w-[420px]" },
  { color: "mint", className: "-bottom-10 right-[60px] h-[340px] w-[340px]" },
] as const;

export function getListHeading(locale: Locale): string {
  return locale === "ta" ? "TNeGA-விலிருந்து சமீபத்தியவை" : "Latest from TNeGA";
}

/**
 * Year options are derived from the items themselves rather than being
 * hand-listed. The document pages inherited hard-coded year lists from
 * the prototypes, and two of them ended up offering years with no rows
 * while hiding rows whose year wasn't in the list. Deriving avoids that
 * failure mode entirely — add an announcement from any year and its
 * option appears automatically.
 */
export function buildFacets(items: CmsAnnouncement[], locale: Locale): Facet[] {
  const years = Array.from(new Set(items.map((a) => yearOf(a.timestamp)).filter(Boolean))).sort(
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
  return locale === "ta" ? "அறிவிப்புகளைத் தேடுங்கள்..." : "Search announcements...";
}

export function getSearchAriaLabel(locale: Locale): string {
  return locale === "ta" ? "அறிவிப்புகளைத் தேடுங்கள்" : "Search announcements";
}

export function getFilterBarLabel(locale: Locale): string {
  return locale === "ta" ? "அறிவிப்புகளை வடிகட்டு" : "Filter announcements";
}

export function getNoResultsText(locale: Locale): string {
  return locale === "ta" ? "உங்கள் வடிகட்டிகளுடன் பொருந்தும் அறிவிப்புகள் இல்லை." : "No announcements match your filters.";
}
