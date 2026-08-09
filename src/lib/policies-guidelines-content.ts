// Content for Policies & Guidelines.
//
// Rows are generated directly from the real PDFs the client uploaded to
// public/documents/policies-guidelines/ -- titles are the real filenames
// with underscores/dashes cleaned up for display (e.g.
// "policy-guidelines_Cyber_Security_Policy_2020.pdf" -> "Cyber Security
// Policy 2020"), not invented. Category tags are an editorial grouping of
// those real titles (e.g. the AI/blockchain/IT-policy buckets), not a
// fact pulled from the document itself.
//
// Two pairs of filenames describe the same subject under different names
// (Blockchain Policy 2020 / Tamil Nadu Blockchain Policy 2020, and Safe
// Ethical AI Policy 2020 / Tamil Nadu Policy for Safe and Ethical AI
// 2020) but are NOT byte-identical files (different sizes/checksums), so
// both are kept as separate rows rather than guessing which one to drop.

import type { DocumentFacet, DocumentRow } from "@/components/documents/types";

export const hero = {
  eyebrow: "Standards",
  heading: "Policies & Guidelines",
  body: "Technology policies, data standards, cybersecurity guidelines and e-Governance frameworks for Tamil Nadu.",
  orbs: [
    { color: "sky", className: "-left-20 -top-20 h-[400px] w-[400px]" },
    { color: "rose", className: "-bottom-16 right-[100px] h-[360px] w-[360px]" },
  ] as const,
};

export const tableHeaders = ["Title", "Ref No", "Date", "Category", "Download"];

/** Year and category options are derived from the rows themselves (see
 * lib/cms/policies.ts), not hand-listed here — a hardcoded list would
 * silently stop covering a new policy added through the CMS from a year
 * or category not already in this list. */
export function buildFacets(rows: DocumentRow[]): DocumentFacet[] {
  const years = Array.from(new Set(rows.map((r) => r.facets.year).filter(Boolean))).sort((a, b) => Number(b) - Number(a));
  const cats = Array.from(new Set(rows.map((r) => r.facets.cat).filter(Boolean))).sort();
  return [
    {
      id: "year",
      kind: "select",
      ariaLabel: "Filter by year",
      initial: "all",
      options: [{ value: "all", label: "All Years" }, ...years.map((y) => ({ value: y, label: y }))],
    },
    {
      id: "cat",
      kind: "select",
      ariaLabel: "Filter by category",
      initial: "all",
      options: [{ value: "all", label: "All Categories" }, ...cats.map((c) => ({ value: c, label: c }))],
    },
  ];
}

export const searchPlaceholder = "Search policies and guidelines...";
export const noResultsText = "No policies match your filters.";
