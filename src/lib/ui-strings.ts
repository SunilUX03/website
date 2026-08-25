// Shared translations for fixed application chrome that isn't CMS
// content — breadcrumbs, table/filter/pagination controls — reused
// across the document-list pages (Government Orders, Policies &
// Guidelines, Publications) and anywhere else that needs the same
// small set of strings. Add a page's own strings (headers, facet
// labels, search placeholder) in that page's own *-content.ts file.
import type { Locale } from "@/lib/locale";

const strings = {
  en: {
    home: "Home",
    viewAll: "View All",
    sortBy: "Sort by",
    originalOrder: "Original order",
    previousPage: "Previous page",
    nextPage: "Next page",
    tablePagination: "Table pagination",
    page: (n: number) => `Page ${n}`,
    sortByColumn: (header: string) => `Sort by ${header}`,
    sortByColumnWithDirection: (header: string, direction: "ascending" | "descending") =>
      `Sort by ${header}, ${direction}`,
    toggleSortDirection: (direction: "ascending" | "descending") =>
      `Toggle sort direction, currently ${direction}`,
    ascending: "ascending" as const,
    descending: "descending" as const,
    showingEntries: (from: number, to: number, total: number) => `Showing ${from} to ${to} of ${total} entries`,
    noEntriesFound: "No entries found",
  },
  ta: {
    home: "முகப்பு",
    viewAll: "அனைத்தையும் காண்க",
    sortBy: "வரிசைப்படுத்து",
    originalOrder: "இயல்பான வரிசை",
    previousPage: "முந்தைய பக்கம்",
    nextPage: "அடுத்த பக்கம்",
    tablePagination: "அட்டவணை பக்கமாற்றம்",
    page: (n: number) => `பக்கம் ${n}`,
    sortByColumn: (header: string) => `${header} மூலம் வரிசைப்படுத்து`,
    sortByColumnWithDirection: (header: string, direction: "ascending" | "descending") =>
      `${header} மூலம் வரிசைப்படுத்து, ${direction === "ascending" ? "ஏறுவரிசை" : "இறங்குவரிசை"}`,
    toggleSortDirection: (direction: "ascending" | "descending") =>
      `வரிசை திசையை மாற்று, தற்போது ${direction === "ascending" ? "ஏறுவரிசை" : "இறங்குவரிசை"}`,
    ascending: "ascending" as const,
    descending: "descending" as const,
    showingEntries: (from: number, to: number, total: number) => `மொத்தம் ${total} இல் ${from} முதல் ${to} வரை காட்டப்படுகிறது`,
    noEntriesFound: "பதிவுகள் எதுவும் இல்லை",
  },
} as const;

export function getUiStrings(locale: Locale) {
  return strings[locale];
}
