// Content for Government Orders, ported from the standalone HTML prototype
// (src_government-orders.html). Table rows, filter options and hero copy were
// extracted from the prototype markup rather than retyped, so the data
// matches the source exactly.
//
// Download hrefs are "#" placeholders — the prototype had no real PDF
// URLs. Swap them for actual document links when those are available.

import type { DocumentFacet, DocumentRow } from "@/components/documents/types";

export const hero = {
  eyebrow: "Official Orders",
  heading: "Government Orders",
  body: "Official Government Orders issued by the IT & Digital Services Department and Tamil Nadu e-Governance Agency.",
  orbs: [
    { color: "mint", className: "-left-16 -top-24 h-[420px] w-[420px]" },
    { color: "peach", className: "-bottom-10 left-[300px] h-[340px] w-[340px]" },
  ] as const,
};

export const tableHeaders = ["Title", "GO No", "Date", "Department", "Download"];

export const facets: DocumentFacet[] = [
  {
    id: "year",
    kind: "select",
    ariaLabel: "Filter by year",
    initial: "all",
    options: [
      { value: "all", label: "All Years" },
      { value: "2026", label: "2026" },
      { value: "2025", label: "2025" },
      { value: "2024", label: "2024" },
      { value: "2023", label: "2023" },
      { value: "2022", label: "2022" },
    ],
  },
  {
    id: "dept",
    kind: "select",
    ariaLabel: "Filter by department",
    initial: "all",
    options: [
      { value: "all", label: "All Departments" },
      { value: "itds", label: "IT&DS Department" },
    ],
  },
];

export const rows: DocumentRow[] = [
  {
    id: "go-01",
    searchText: "SimpleGov — Sanitation Certificate Digitization",
    facets: { year: "2024", dept: "itds" },
    cells: [
      { kind: "title", text: "SimpleGov — Sanitation Certificate Digitization" },
      { kind: "ref", text: "G.O.Ms.No.276, H&FW Dept" },
      { kind: "date", text: "23 Sep 2024" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Sanitation Certificate Digitization GO PDF" },
    ],
  },
  {
    id: "go-02",
    searchText: "SimpleGov — Registration of Old Age Homes",
    facets: { year: "2024", dept: "itds" },
    cells: [
      { kind: "title", text: "SimpleGov — Registration of Old Age Homes" },
      { kind: "ref", text: "G.O.Ms.No.64, SW&WW Dept" },
      { kind: "date", text: "19 Sep 2024" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Registration of Old Age Homes GO PDF" },
    ],
  },
  {
    id: "go-03",
    searchText: "SimpleGov — Verification of Characters and Antecedents",
    facets: { year: "2024", dept: "itds" },
    cells: [
      { kind: "title", text: "SimpleGov — Verification of Characters and Antecedents" },
      { kind: "ref", text: "G.O.Ms.No.509, Home Dept" },
      { kind: "date", text: "06 Sep 2024" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Verification of Characters and Antecedents GO PDF" },
    ],
  },
  {
    id: "go-04",
    searchText: "SimpleGov — NOC for Dryland Non-Agricultural Purposes",
    facets: { year: "2024", dept: "itds" },
    cells: [
      { kind: "title", text: "SimpleGov — NOC for Dryland Non-Agricultural Purposes" },
      { kind: "ref", text: "G.O.Ms.No.221, Agri & FW Dept" },
      { kind: "date", text: "24 Sep 2024" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download NOC for Dryland Non-Agricultural Purposes GO PDF" },
    ],
  },
  {
    id: "go-05",
    searchText: "SimpleGov — Registration of Working Women Hostel",
    facets: { year: "2024", dept: "itds" },
    cells: [
      { kind: "title", text: "SimpleGov — Registration of Working Women Hostel" },
      { kind: "ref", text: "G.O.Ms.No.80, SW&WW Dept" },
      { kind: "date", text: "29 Oct 2024" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Registration of Working Women Hostel GO PDF" },
    ],
  },
  {
    id: "go-06",
    searchText: "SimpleGov — Lift and Escalator License",
    facets: { year: "2024", dept: "itds" },
    cells: [
      { kind: "title", text: "SimpleGov — Lift and Escalator License" },
      { kind: "ref", text: "G.O.Ms.No.86, Energy Dept" },
      { kind: "date", text: "29 Aug 2024" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Lift and Escalator License GO PDF" },
    ],
  },
  {
    id: "go-07",
    searchText: "SimpleGov — Fire License",
    facets: { year: "2024", dept: "itds" },
    cells: [
      { kind: "title", text: "SimpleGov — Fire License" },
      { kind: "ref", text: "G.O.Ms.No.639, Home Dept" },
      { kind: "date", text: "21 Nov 2024" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Fire License GO PDF" },
    ],
  },
  {
    id: "go-08",
    searchText: "Data Center Policy 2021",
    facets: { year: "2021", dept: "itds" },
    cells: [
      { kind: "title", text: "Data Center Policy 2021" },
      { kind: "ref", text: "G.O.Ms.No.14, IT&DS Dept" },
      { kind: "date", text: "15 Mar 2021" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Data Center Policy 2021 GO PDF" },
    ],
  },
  {
    id: "go-09",
    searchText: "e-Office Mandatory Implementation Order",
    facets: { year: "2023", dept: "itds" },
    cells: [
      { kind: "title", text: "e-Office Mandatory Implementation Order" },
      { kind: "ref", text: "G.O.Ms.No.22, IT&DS Dept" },
      { kind: "date", text: "10 Jan 2023" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download e-Office Mandatory Implementation Order PDF" },
    ],
  },
  {
    id: "go-10",
    searchText: "Nambikkai Inaiyam Blockchain Infrastructure Order",
    facets: { year: "2023", dept: "itds" },
    cells: [
      { kind: "title", text: "Nambikkai Inaiyam Blockchain Infrastructure Order" },
      { kind: "ref", text: "G.O.Ms.No.45, IT&DS Dept" },
      { kind: "date", text: "01 Jun 2023" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Nambikkai Inaiyam Blockchain Infrastructure Order PDF" },
    ],
  },
];

export const searchPlaceholder = "Search government orders...";
export const noResultsText = "No government orders match your filters.";
