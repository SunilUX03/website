// Content for Government Orders.
//
// Rows are generated directly from the real PDFs the client uploaded to
// public/documents/government-orders/ (parsed from each filename, not
// hand-typed). Each row's title/ref is the G.O./Letter reference parsed
// straight from its filename (e.g. "2013_GO.(Ms)_No.8.pdf" -> "G.O. (Ms)
// No. 8") -- real filenames only carry a year and reference number, not a
// subject line, so no description/subject is invented here.
// "(Additional Copy)"/"Annexure" suffixes mark filenames that included a
// "(1)" or "_annexure" marker.
//
// One file from the client's upload, 2021_Data_Center_Policy_2021.pdf, is
// not listed here -- it's a policy document, not a government order, and
// was moved to policies-guidelines/ (byte-identical to the copy already
// there, per explicit instruction) rather than left duplicated here.

import type { DocumentFacet, DocumentRow } from "@/components/documents/types";

export const heroOrbs = [
  { color: "mint", className: "-left-16 -top-24 h-[420px] w-[420px]" },
  { color: "peach", className: "-bottom-10 left-[300px] h-[340px] w-[340px]" },
] as const;

export const tableHeaders = ["Title", "GO No", "Date", "Department", "Download"];

/** Year and department options are derived from the rows themselves
 * (see lib/cms/government-orders.ts), not hand-listed here — a
 * hardcoded year/department list would silently stop covering a new
 * G.O. added through the CMS from a year or department not already in
 * this list. */
export function buildFacets(rows: DocumentRow[]): DocumentFacet[] {
  const years = Array.from(new Set(rows.map((r) => r.facets.year).filter(Boolean))).sort((a, b) => Number(b) - Number(a));
  const depts = Array.from(new Set(rows.map((r) => r.facets.dept).filter(Boolean))).sort();
  return [
    {
      id: "year",
      kind: "select",
      ariaLabel: "Filter by year",
      initial: "all",
      options: [{ value: "all", label: "All Years" }, ...years.map((y) => ({ value: y, label: y }))],
    },
    {
      id: "dept",
      kind: "select",
      ariaLabel: "Filter by department",
      initial: "all",
      options: [{ value: "all", label: "All Departments" }, ...depts.map((d) => ({ value: d, label: d }))],
    },
  ];
}

export const searchPlaceholder = "Search government orders...";
export const noResultsText = "No government orders match your filters.";
