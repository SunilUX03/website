// Content for Policies & Guidelines, ported from the standalone HTML prototype
// (src_policies-guidelines.html). Table rows, filter options and hero copy were
// extracted from the prototype markup rather than retyped, so the data
// matches the source exactly. The rows themselves (titles, dates,
// categories) are still placeholder/demo entries pending a real content
// brief.
//
// Download hrefs point at /public/documents/policies-guidelines/<row id>.pdf
// (e.g. policy-01.pdf), matching each row's own `id` above — Next.js
// serves anything under /public as a static file at that same path, so
// dropping a real PDF at that exact filename is the only step needed to
// make a row's download link work; no code change required.

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
    id: "cat",
    kind: "select",
    ariaLabel: "Filter by category",
    initial: "all",
    options: [
      { value: "all", label: "All Categories" },
      { value: "cyber", label: "Cybersecurity" },
      { value: "data", label: "Data Policy" },
      { value: "egov", label: "e-Governance Standards" },
      { value: "infra", label: "IT Infrastructure" },
      { value: "access", label: "Accessibility" },
    ],
  },
];

export const rows: DocumentRow[] = [
  {
    id: "policy-01",
    searchText: "Tamil Nadu Cybersecurity Policy 2024",
    facets: { year: "2024", cat: "cyber" },
    cells: [
      { kind: "title", text: "Tamil Nadu Cybersecurity Policy 2024" },
      { kind: "ref", text: "TNeGA/CYB/2024/001" },
      { kind: "date", text: "01 Jan 2024" },
      { kind: "badge", text: "Cybersecurity", tone: "pink" },
      { kind: "download", href: "/documents/policies-guidelines/policy-01.pdf", label: "PDF", ariaLabel: "Download Tamil Nadu Cybersecurity Policy 2024 PDF" },
    ],
  },
  {
    id: "policy-02",
    searchText: "State Data Sharing and Accessibility Policy",
    facets: { year: "2023", cat: "data" },
    cells: [
      { kind: "title", text: "State Data Sharing and Accessibility Policy" },
      { kind: "ref", text: "TNeGA/DATA/2023/002" },
      { kind: "date", text: "15 Jun 2023" },
      { kind: "badge", text: "Data Policy", tone: "sky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-02.pdf", label: "PDF", ariaLabel: "Download State Data Sharing and Accessibility Policy PDF" },
    ],
  },
  {
    id: "policy-03",
    searchText: "e-Governance Application Development Standards",
    facets: { year: "2023", cat: "egov" },
    cells: [
      { kind: "title", text: "e-Governance Application Development Standards" },
      { kind: "ref", text: "TNeGA/STD/2023/003" },
      { kind: "date", text: "01 Mar 2023" },
      { kind: "badge", text: "e-Governance Standards", tone: "violet" },
      { kind: "download", href: "/documents/policies-guidelines/policy-03.pdf", label: "PDF", ariaLabel: "Download e-Governance Application Development Standards PDF" },
    ],
  },
  {
    id: "policy-04",
    searchText: "Cloud Computing Policy for Government Departments",
    facets: { year: "2023", cat: "infra" },
    cells: [
      { kind: "title", text: "Cloud Computing Policy for Government Departments" },
      { kind: "ref", text: "TNeGA/CLOUD/2023/004" },
      { kind: "date", text: "01 Feb 2023" },
      { kind: "badge", text: "IT Infrastructure", tone: "amber" },
      { kind: "download", href: "/documents/policies-guidelines/policy-04.pdf", label: "PDF", ariaLabel: "Download Cloud Computing Policy for Government Departments PDF" },
    ],
  },
  {
    id: "policy-05",
    searchText: "Website Accessibility Guidelines — WCAG 2AA Compliance",
    facets: { year: "2022", cat: "access" },
    cells: [
      { kind: "title", text: "Website Accessibility Guidelines — WCAG 2AA Compliance" },
      { kind: "ref", text: "TNeGA/ACC/2022/005" },
      { kind: "date", text: "15 Dec 2022" },
      { kind: "badge", text: "Accessibility", tone: "green" },
      { kind: "download", href: "/documents/policies-guidelines/policy-05.pdf", label: "PDF", ariaLabel: "Download Website Accessibility Guidelines WCAG 2AA Compliance PDF" },
    ],
  },
  {
    id: "policy-06",
    searchText: "Software Security Audit Guidelines for Departments",
    facets: { year: "2022", cat: "cyber" },
    cells: [
      { kind: "title", text: "Software Security Audit Guidelines for Departments" },
      { kind: "ref", text: "TNeGA/SEC/2022/006" },
      { kind: "date", text: "01 Nov 2022" },
      { kind: "badge", text: "Cybersecurity", tone: "pink" },
      { kind: "download", href: "/documents/policies-guidelines/policy-06.pdf", label: "PDF", ariaLabel: "Download Software Security Audit Guidelines for Departments PDF" },
    ],
  },
  {
    id: "policy-07",
    searchText: "Data Centre Hosting Policy 2021",
    facets: { year: "2021", cat: "infra" },
    cells: [
      { kind: "title", text: "Data Centre Hosting Policy 2021" },
      { kind: "ref", text: "TNeGA/DC/2021/007" },
      { kind: "date", text: "15 Mar 2021" },
      { kind: "badge", text: "IT Infrastructure", tone: "amber" },
      { kind: "download", href: "/documents/policies-guidelines/policy-07.pdf", label: "PDF", ariaLabel: "Download Data Centre Hosting Policy 2021 PDF" },
    ],
  },
  {
    id: "policy-08",
    searchText: "Open Data Policy — Tamil Nadu Government",
    facets: { year: "2021", cat: "data" },
    cells: [
      { kind: "title", text: "Open Data Policy — Tamil Nadu Government" },
      { kind: "ref", text: "TNeGA/OD/2021/008" },
      { kind: "date", text: "01 Jan 2021" },
      { kind: "badge", text: "Data Policy", tone: "sky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-08.pdf", label: "PDF", ariaLabel: "Download Open Data Policy Tamil Nadu Government PDF" },
    ],
  },
];

export const searchPlaceholder = "Search policies and guidelines...";
export const noResultsText = "No policies match your filters.";
