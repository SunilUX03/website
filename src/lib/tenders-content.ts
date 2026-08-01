// Content for Tenders, ported from the standalone HTML prototype
// (src_tenders.html). Table rows, filter options and hero copy were
// extracted from the prototype markup rather than retyped, so the data
// matches the source exactly.
//
// Download hrefs are "#" placeholders — the prototype had no real PDF
// URLs. Swap them for actual document links when those are available.

import type { DocumentFacet, DocumentRow } from "@/components/documents/types";

export const hero = {
  eyebrow: "Procurement",
  heading: "Tenders & Procurement Opportunities",
  body: "Active and upcoming tenders from Tamil Nadu e-Governance Agency. Download documents and submit bids before closing dates.",
  orbs: [
    { color: "peach", className: "-left-16 -top-20 h-[400px] w-[400px]" },
    { color: "lavender", className: "-bottom-16 left-[260px] h-[340px] w-[340px]" },
  ] as const,
};

export const tableHeaders = ["Name of Tender", "Ref No", "Published", "Closing Date", "Bid Opening", "Status", "Download"];

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
    ],
  },
  {
    id: "status",
    kind: "pills",
    ariaLabel: "Filter by status",
    initial: "all",
    options: [
      { value: "all", label: "All" },
      { value: "open", label: "Open" },
      { value: "closed", label: "Closed" },
      { value: "awarded", label: "Awarded" },
    ],
  },
];

export const rows: DocumentRow[] = [
  {
    id: "tender-01",
    searchText: "Empanelment of IT Security Audit Agencies",
    facets: { status: "open", year: "2026" },
    cells: [
      { kind: "title", text: "Empanelment of IT Security Audit Agencies" },
      { kind: "ref", text: "TNeGA/SEC/2026/001" },
      { kind: "date", text: "01 Jan 2026" },
      { kind: "date", text: "31 Jan 2026" },
      { kind: "date", text: "05 Feb 2026" },
      { kind: "badge", text: "Open", tone: "green" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Empanelment of IT Security Audit Agencies PDF" },
    ],
  },
  {
    id: "tender-02",
    searchText: "Supply of Biometric Devices for e-Sevai Centres",
    facets: { status: "open", year: "2026" },
    cells: [
      { kind: "title", text: "Supply of Biometric Devices for e-Sevai Centres" },
      { kind: "ref", text: "TNeGA/PROC/2026/002" },
      { kind: "date", text: "10 Jan 2026" },
      { kind: "date", text: "10 Feb 2026" },
      { kind: "date", text: "15 Feb 2026" },
      { kind: "badge", text: "Open", tone: "green" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Supply of Biometric Devices PDF" },
    ],
  },
  {
    id: "tender-03",
    searchText: "Development of Tamil Open Data Platform",
    facets: { status: "open", year: "2026" },
    cells: [
      { kind: "title", text: "Development of Tamil Open Data Platform" },
      { kind: "ref", text: "TNeGA/DEV/2026/003" },
      { kind: "date", text: "15 Jan 2026" },
      { kind: "date", text: "28 Feb 2026" },
      { kind: "date", text: "05 Mar 2026" },
      { kind: "badge", text: "Open", tone: "green" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Development of Tamil Open Data Platform PDF" },
    ],
  },
  {
    id: "tender-04",
    searchText: "Selection of System Integrator for TNSSO",
    facets: { status: "awarded", year: "2025" },
    cells: [
      { kind: "title", text: "Selection of System Integrator for TNSSO" },
      { kind: "ref", text: "TNeGA/SI/2025/018" },
      { kind: "date", text: "01 Nov 2025" },
      { kind: "date", text: "30 Nov 2025" },
      { kind: "date", text: "05 Dec 2025" },
      { kind: "badge", text: "Awarded", tone: "ink" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Selection of System Integrator for TNSSO PDF" },
    ],
  },
  {
    id: "tender-05",
    searchText: "Procurement of Cloud Infrastructure Services",
    facets: { status: "awarded", year: "2025" },
    cells: [
      { kind: "title", text: "Procurement of Cloud Infrastructure Services" },
      { kind: "ref", text: "TNeGA/CLOUD/2025/017" },
      { kind: "date", text: "01 Oct 2025" },
      { kind: "date", text: "31 Oct 2025" },
      { kind: "date", text: "05 Nov 2025" },
      { kind: "badge", text: "Awarded", tone: "ink" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Procurement of Cloud Infrastructure Services PDF" },
    ],
  },
  {
    id: "tender-06",
    searchText: "Annual Maintenance Contract for e-Office Platform",
    facets: { status: "closed", year: "2025" },
    cells: [
      { kind: "title", text: "Annual Maintenance Contract for e-Office Platform" },
      { kind: "ref", text: "TNeGA/AMC/2025/016" },
      { kind: "date", text: "15 Sep 2025" },
      { kind: "date", text: "15 Oct 2025" },
      { kind: "date", text: "20 Oct 2025" },
      { kind: "badge", text: "Closed", tone: "neutral" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Annual Maintenance Contract for e-Office Platform PDF" },
    ],
  },
  {
    id: "tender-07",
    searchText: "Empanelment of GIS Consultants for TNGIS Phase 2",
    facets: { status: "closed", year: "2025" },
    cells: [
      { kind: "title", text: "Empanelment of GIS Consultants for TNGIS Phase 2" },
      { kind: "ref", text: "TNeGA/GIS/2025/015" },
      { kind: "date", text: "01 Aug 2025" },
      { kind: "date", text: "31 Aug 2025" },
      { kind: "date", text: "05 Sep 2025" },
      { kind: "badge", text: "Closed", tone: "neutral" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Empanelment of GIS Consultants PDF" },
    ],
  },
  {
    id: "tender-08",
    searchText: "Supply and Installation of Servers for State Data Centre",
    facets: { status: "closed", year: "2025" },
    cells: [
      { kind: "title", text: "Supply and Installation of Servers for State Data Centre" },
      { kind: "ref", text: "TNeGA/SDC/2025/014" },
      { kind: "date", text: "01 Jul 2025" },
      { kind: "date", text: "31 Jul 2025" },
      { kind: "date", text: "05 Aug 2025" },
      { kind: "badge", text: "Closed", tone: "neutral" },
      { kind: "download", href: "#", label: "PDF", ariaLabel: "Download Supply and Installation of Servers PDF" },
    ],
  },
];

export const searchPlaceholder = "Search tenders...";
export const noResultsText = "No tenders match your filters.";
