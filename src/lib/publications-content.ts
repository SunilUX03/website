// Content for Publications, ported from the standalone HTML prototype
// (src_publications.html). Table rows, filter options and hero copy were
// extracted from the prototype markup rather than retyped, so the data
// matches the source exactly.
//
// Download hrefs are "#" placeholders — the prototype had no real PDF
// URLs. Swap them for actual document links when those are available.

import type { DocumentFacet, DocumentRow } from "@/components/documents/types";

export const hero = {
  eyebrow: "Official Documents",
  heading: "Publications",
  body: "Official publications, reports and documents released by Tamil Nadu e-Governance Agency.",
  orbs: [
    { color: "lavender", className: "-left-20 -top-20 h-[420px] w-[420px]" },
    { color: "sky", className: "-bottom-10 right-[80px] h-[340px] w-[340px]" },
  ] as const,
};

export const tableHeaders = ["Title", "Ref No", "Date", "Department", "Download"];

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
    ],
  },
  {
    id: "dept",
    kind: "select",
    ariaLabel: "Filter by department",
    initial: "all",
    options: [
      { value: "all", label: "All Departments" },
      { value: "tnega", label: "TNeGA" },
      { value: "itds", label: "IT&DS Department" },
      { value: "nic", label: "NIC" },
    ],
  },
];

export const rows: DocumentRow[] = [
  {
    id: "pub-01",
    searchText: "Annual Report 2024-25: Tamil Nadu e-Governance Agency",
    facets: { year: "2025", dept: "tnega" },
    cells: [
      { kind: "title", text: "Annual Report 2024-25: Tamil Nadu e-Governance Agency" },
      { kind: "ref", text: "TNeGA/AR/2025/001" },
      { kind: "date", text: "01 Apr 2025" },
      { kind: "badge", text: "TNeGA", tone: "violet" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Annual Report 2024-25 PDF" },
    ],
  },
  {
    id: "pub-02",
    searchText: "State e-Governance Policy Framework 2025",
    facets: { year: "2025", dept: "itds" },
    cells: [
      { kind: "title", text: "State e-Governance Policy Framework 2025" },
      { kind: "ref", text: "TNeGA/POL/2025/002" },
      { kind: "date", text: "15 Mar 2025" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download State e-Governance Policy Framework 2025 PDF" },
    ],
  },
  {
    id: "pub-03",
    searchText: "AI in Governance: Tamil Nadu Perspective",
    facets: { year: "2025", dept: "tnega" },
    cells: [
      { kind: "title", text: "AI in Governance: Tamil Nadu Perspective" },
      { kind: "ref", text: "TNeGA/AI/2025/003" },
      { kind: "date", text: "01 Feb 2025" },
      { kind: "badge", text: "TNeGA", tone: "violet" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download AI in Governance PDF" },
    ],
  },
  {
    id: "pub-04",
    searchText: "TNGIS: Geospatial Governance Report 2024",
    facets: { year: "2024", dept: "tnega" },
    cells: [
      { kind: "title", text: "TNGIS: Geospatial Governance Report 2024" },
      { kind: "ref", text: "TNeGA/GIS/2024/004" },
      { kind: "date", text: "15 Dec 2024" },
      { kind: "badge", text: "TNeGA", tone: "violet" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download TNGIS Geospatial Governance Report 2024 PDF" },
    ],
  },
  {
    id: "pub-05",
    searchText: "Data Purity Project: Impact Assessment Report",
    facets: { year: "2024", dept: "tnega" },
    cells: [
      { kind: "title", text: "Data Purity Project: Impact Assessment Report" },
      { kind: "ref", text: "TNeGA/DATA/2024/005" },
      { kind: "date", text: "01 Nov 2024" },
      { kind: "badge", text: "TNeGA", tone: "violet" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Data Purity Project Impact Assessment Report PDF" },
    ],
  },
  {
    id: "pub-06",
    searchText: "e-Office Implementation: State Progress Report 2024",
    facets: { year: "2024", dept: "tnega" },
    cells: [
      { kind: "title", text: "e-Office Implementation: State Progress Report 2024" },
      { kind: "ref", text: "TNeGA/EOFF/2024/006" },
      { kind: "date", text: "01 Oct 2024" },
      { kind: "badge", text: "TNeGA", tone: "violet" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download e-Office Implementation State Progress Report 2024 PDF" },
    ],
  },
  {
    id: "pub-07",
    searchText: "Nambikkai Inaiyam: Blockchain in Tamil Nadu Governance",
    facets: { year: "2024", dept: "tnega" },
    cells: [
      { kind: "title", text: "Nambikkai Inaiyam: Blockchain in Tamil Nadu Governance" },
      { kind: "ref", text: "TNeGA/BC/2024/007" },
      { kind: "date", text: "01 Sep 2024" },
      { kind: "badge", text: "TNeGA", tone: "violet" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Nambikkai Inaiyam Blockchain Report PDF" },
    ],
  },
  {
    id: "pub-08",
    searchText: "KMUT Scheme: Data-Driven Beneficiary Identification",
    facets: { year: "2024", dept: "itds" },
    cells: [
      { kind: "title", text: "KMUT Scheme: Data-Driven Beneficiary Identification" },
      { kind: "ref", text: "TNeGA/KMUT/2024/008" },
      { kind: "date", text: "01 Aug 2024" },
      { kind: "badge", text: "IT&DS Department", tone: "sky" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download KMUT Scheme Data-Driven Report PDF" },
    ],
  },
];

export const searchPlaceholder = "Search publications...";
export const noResultsText = "No publications match your filters.";
