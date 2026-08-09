// Copy and filter config for /notifications/announcements.
//
// The announcement items themselves are NOT redefined here — they're the
// same `announcements` array in lib/content.ts that the homepage section
// renders. Importing rather than copying keeps the homepage teaser and
// this full listing in sync: add an item in content.ts and it appears in
// both.

import { announcements } from "./content";
import type { Facet } from "@/components/documents/FilterBar";

export { announcements };

export const hero = {
  eyebrow: "Updates",
  heading: "Announcements",
  body: "Launches, milestones and service updates from Tamil Nadu e-Governance Agency, the latest news on the platforms that deliver government services across the state.",
  orbs: [
    { color: "lavender", className: "-left-16 -top-24 h-[420px] w-[420px]" },
    { color: "mint", className: "-bottom-10 right-[60px] h-[340px] w-[340px]" },
  ] as const,
};

export const listHeading = "Latest from TNeGA";

/** "29 May 2025" -> "2025". Timestamps end with the year in this dataset. */
export function yearOf(timestamp: string): string {
  const match = timestamp.match(/\b(\d{4})\b/);
  return match ? match[1] : "";
}

/**
 * Year options are derived from the items themselves rather than being
 * hand-listed. The document pages inherited hard-coded year lists from
 * the prototypes, and two of them ended up offering years with no rows
 * while hiding rows whose year wasn't in the list. Deriving avoids that
 * failure mode entirely — add an announcement from any year and its
 * option appears automatically.
 */
const years = Array.from(
  new Set(announcements.map((a) => yearOf(a.timestamp)).filter(Boolean))
).sort((a, b) => Number(b) - Number(a));

export const facets: Facet[] = [
  {
    id: "year",
    kind: "select",
    ariaLabel: "Filter by year",
    initial: "all",
    options: [
      { value: "all", label: "All Years" },
      ...years.map((y) => ({ value: y, label: y })),
    ],
  },
];

export const searchPlaceholder = "Search announcements...";
export const searchAriaLabel = "Search announcements";
export const filterBarLabel = "Filter announcements";
export const noResultsText = "No announcements match your filters.";
