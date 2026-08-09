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

export const facets: DocumentFacet[] = [
  {
    id: "year",
    kind: "select",
    ariaLabel: "Filter by year",
    initial: "all",
    options: [
      { value: "all", label: "All Years" },
      { value: "2025", label: "2025" },
      { value: "2024", label: "2024" },
      { value: "2023", label: "2023" },
      { value: "2022", label: "2022" },
      { value: "2021", label: "2021" },
      { value: "2020", label: "2020" },
      { value: "2019", label: "2019" },
      { value: "2018", label: "2018" },
      { value: "2017", label: "2017" },
      { value: "2016", label: "2016" },
      { value: "2015", label: "2015" },
      { value: "2014", label: "2014" },
    ],
  },
  {
    id: "cat",
    kind: "select",
    ariaLabel: "Filter by category",
    initial: "all",
    options: [
      { value: "all", label: "All Categories" },
      { value: "it-policy", label: "Annual IT Policy" },
      { value: "cyber", label: "Cybersecurity" },
      { value: "data", label: "Data Policy" },
      { value: "ai", label: "AI Policy" },
      { value: "blockchain", label: "Blockchain Policy" },
      { value: "egov", label: "e-Governance Standards" },
      { value: "other", label: "Other" },
    ],
  },
];

export const rows: DocumentRow[] = [
  {
    id: "policy-01",
    searchText: "Blockchain Policy 2020",
    facets: { cat: "blockchain", year: "2020" },
    cells: [
      { kind: "title", text: "Blockchain Policy 2020" },
      { kind: "ref", text: "Blockchain Policy 2020" },
      { kind: "date", text: "2020" },
      { kind: "badge", text: "Blockchain Policy", tone: "amber" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_Blockchain_policy_2020.pdf", label: "PDF", ariaLabel: "Download Blockchain Policy 2020 PDF" },
    ],
  },
  {
    id: "policy-02",
    searchText: "CSR Policy",
    facets: { cat: "other" },
    cells: [
      { kind: "title", text: "CSR Policy" },
      { kind: "ref", text: "CSR Policy" },
      { kind: "date", text: "Not Applicable" },
      { kind: "badge", text: "Other", tone: "neutral" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_CSR_Policy.pdf", label: "PDF", ariaLabel: "Download CSR Policy PDF" },
    ],
  },
  {
    id: "policy-03",
    searchText: "Cyber Security Policy 2020",
    facets: { cat: "cyber", year: "2020" },
    cells: [
      { kind: "title", text: "Cyber Security Policy 2020" },
      { kind: "ref", text: "Cyber Security Policy 2020" },
      { kind: "date", text: "2020" },
      { kind: "badge", text: "Cybersecurity", tone: "pink" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_Cyber_Security_Policy_2020.pdf", label: "PDF", ariaLabel: "Download Cyber Security Policy 2020 PDF" },
    ],
  },
  {
    id: "policy-04",
    searchText: "Data Centre Policy 2021",
    facets: { cat: "data", year: "2021" },
    cells: [
      { kind: "title", text: "Data Centre Policy 2021" },
      { kind: "ref", text: "Data Centre Policy 2021" },
      { kind: "date", text: "2021" },
      { kind: "badge", text: "Data Policy", tone: "sky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_Data_Centre_Policy_2021.pdf", label: "PDF", ariaLabel: "Download Data Centre Policy 2021 PDF" },
    ],
  },
  {
    id: "policy-05",
    searchText: "ICT Policy 2018",
    facets: { cat: "egov", year: "2018" },
    cells: [
      { kind: "title", text: "ICT Policy 2018" },
      { kind: "ref", text: "ICT Policy 2018" },
      { kind: "date", text: "2018" },
      { kind: "badge", text: "e-Governance Standards", tone: "violet" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_ICT_policy_2018.pdf", label: "PDF", ariaLabel: "Download ICT Policy 2018 PDF" },
    ],
  },
  {
    id: "policy-06",
    searchText: "IT Policy 2014-2015",
    facets: { cat: "it-policy", year: "2014" },
    cells: [
      { kind: "title", text: "IT Policy 2014-2015" },
      { kind: "ref", text: "IT Policy 2014-2015" },
      { kind: "date", text: "2014" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2014_-_2015.pdf", label: "PDF", ariaLabel: "Download IT Policy 2014-2015 PDF" },
    ],
  },
  {
    id: "policy-07",
    searchText: "IT Policy 2015-2016",
    facets: { cat: "it-policy", year: "2015" },
    cells: [
      { kind: "title", text: "IT Policy 2015-2016" },
      { kind: "ref", text: "IT Policy 2015-2016" },
      { kind: "date", text: "2015" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2015_-_2016.pdf", label: "PDF", ariaLabel: "Download IT Policy 2015-2016 PDF" },
    ],
  },
  {
    id: "policy-08",
    searchText: "IT Policy 2016-2017",
    facets: { cat: "it-policy", year: "2016" },
    cells: [
      { kind: "title", text: "IT Policy 2016-2017" },
      { kind: "ref", text: "IT Policy 2016-2017" },
      { kind: "date", text: "2016" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2016_-_2017.pdf", label: "PDF", ariaLabel: "Download IT Policy 2016-2017 PDF" },
    ],
  },
  {
    id: "policy-09",
    searchText: "IT Policy 2017-2018",
    facets: { cat: "it-policy", year: "2017" },
    cells: [
      { kind: "title", text: "IT Policy 2017-2018" },
      { kind: "ref", text: "IT Policy 2017-2018" },
      { kind: "date", text: "2017" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2017_-_2018.pdf", label: "PDF", ariaLabel: "Download IT Policy 2017-2018 PDF" },
    ],
  },
  {
    id: "policy-10",
    searchText: "IT Policy 2018-2019",
    facets: { cat: "it-policy", year: "2018" },
    cells: [
      { kind: "title", text: "IT Policy 2018-2019" },
      { kind: "ref", text: "IT Policy 2018-2019" },
      { kind: "date", text: "2018" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2018_-_2019.pdf", label: "PDF", ariaLabel: "Download IT Policy 2018-2019 PDF" },
    ],
  },
  {
    id: "policy-11",
    searchText: "IT Policy 2019-2020",
    facets: { cat: "it-policy", year: "2019" },
    cells: [
      { kind: "title", text: "IT Policy 2019-2020" },
      { kind: "ref", text: "IT Policy 2019-2020" },
      { kind: "date", text: "2019" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2019_-_2020.pdf", label: "PDF", ariaLabel: "Download IT Policy 2019-2020 PDF" },
    ],
  },
  {
    id: "policy-12",
    searchText: "IT Policy 2020-2021",
    facets: { cat: "it-policy", year: "2020" },
    cells: [
      { kind: "title", text: "IT Policy 2020-2021" },
      { kind: "ref", text: "IT Policy 2020-2021" },
      { kind: "date", text: "2020" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2020_-_2021.pdf", label: "PDF", ariaLabel: "Download IT Policy 2020-2021 PDF" },
    ],
  },
  {
    id: "policy-13",
    searchText: "IT Policy 2021-2022",
    facets: { cat: "it-policy", year: "2021" },
    cells: [
      { kind: "title", text: "IT Policy 2021-2022" },
      { kind: "ref", text: "IT Policy 2021-2022" },
      { kind: "date", text: "2021" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2021_-_2022.pdf", label: "PDF", ariaLabel: "Download IT Policy 2021-2022 PDF" },
    ],
  },
  {
    id: "policy-14",
    searchText: "IT Policy 2022-2023",
    facets: { cat: "it-policy", year: "2022" },
    cells: [
      { kind: "title", text: "IT Policy 2022-2023" },
      { kind: "ref", text: "IT Policy 2022-2023" },
      { kind: "date", text: "2022" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2022_-_2023.pdf", label: "PDF", ariaLabel: "Download IT Policy 2022-2023 PDF" },
    ],
  },
  {
    id: "policy-15",
    searchText: "IT Policy 2023-2024",
    facets: { cat: "it-policy", year: "2023" },
    cells: [
      { kind: "title", text: "IT Policy 2023-2024" },
      { kind: "ref", text: "IT Policy 2023-2024" },
      { kind: "date", text: "2023" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2023_-_2024.pdf", label: "PDF", ariaLabel: "Download IT Policy 2023-2024 PDF" },
    ],
  },
  {
    id: "policy-16",
    searchText: "IT Policy 2024-2025",
    facets: { cat: "it-policy", year: "2024" },
    cells: [
      { kind: "title", text: "IT Policy 2024-2025" },
      { kind: "ref", text: "IT Policy 2024-2025" },
      { kind: "date", text: "2024" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2024_-_2025.pdf", label: "PDF", ariaLabel: "Download IT Policy 2024-2025 PDF" },
    ],
  },
  {
    id: "policy-17",
    searchText: "IT Policy 2025-2026",
    facets: { cat: "it-policy", year: "2025" },
    cells: [
      { kind: "title", text: "IT Policy 2025-2026" },
      { kind: "ref", text: "IT Policy 2025-2026" },
      { kind: "date", text: "2025" },
      { kind: "badge", text: "Annual IT Policy", tone: "deepSky" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_IT_POLICY_2025_-_2026.pdf", label: "PDF", ariaLabel: "Download IT Policy 2025-2026 PDF" },
    ],
  },
  {
    id: "policy-18",
    searchText: "Rural BPO",
    facets: { cat: "other" },
    cells: [
      { kind: "title", text: "Rural BPO" },
      { kind: "ref", text: "Rural BPO" },
      { kind: "date", text: "Not Applicable" },
      { kind: "badge", text: "Other", tone: "neutral" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_Rural_BPO.pdf", label: "PDF", ariaLabel: "Download Rural BPO PDF" },
    ],
  },
  {
    id: "policy-19",
    searchText: "Safe Ethical AI Policy 2020",
    facets: { cat: "ai", year: "2020" },
    cells: [
      { kind: "title", text: "Safe Ethical AI Policy 2020" },
      { kind: "ref", text: "Safe Ethical AI Policy 2020" },
      { kind: "date", text: "2020" },
      { kind: "badge", text: "AI Policy", tone: "lime" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_Safe_Ethical_AI_Policy_2020.pdf", label: "PDF", ariaLabel: "Download Safe Ethical AI Policy 2020 PDF" },
    ],
  },
  {
    id: "policy-20",
    searchText: "Tamil Nadu Blockchain Policy 2020",
    facets: { cat: "blockchain", year: "2020" },
    cells: [
      { kind: "title", text: "Tamil Nadu Blockchain Policy 2020" },
      { kind: "ref", text: "Tamil Nadu Blockchain Policy 2020" },
      { kind: "date", text: "2020" },
      { kind: "badge", text: "Blockchain Policy", tone: "amber" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_Tamil_Nadu_Blockchain_Policy_2020.pdf", label: "PDF", ariaLabel: "Download Tamil Nadu Blockchain Policy 2020 PDF" },
    ],
  },
  {
    id: "policy-21",
    searchText: "Tamil Nadu Policy for Safe and Ethical AI 2020",
    facets: { cat: "ai", year: "2020" },
    cells: [
      { kind: "title", text: "Tamil Nadu Policy for Safe and Ethical AI 2020" },
      { kind: "ref", text: "Tamil Nadu Policy for Safe and Ethical AI 2020" },
      { kind: "date", text: "2020" },
      { kind: "badge", text: "AI Policy", tone: "lime" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_Tamil_Nadu_Policy_for_Safe_and_Ethical_AI_2020.pdf", label: "PDF", ariaLabel: "Download Tamil Nadu Policy for Safe and Ethical AI 2020 PDF" },
    ],
  },
  {
    id: "policy-22",
    searchText: "e-Governance Connect 2018",
    facets: { cat: "egov", year: "2018" },
    cells: [
      { kind: "title", text: "e-Governance Connect 2018" },
      { kind: "ref", text: "e-Governance Connect 2018" },
      { kind: "date", text: "2018" },
      { kind: "badge", text: "e-Governance Standards", tone: "violet" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_e-Governance_Connect_2018.pdf", label: "PDF", ariaLabel: "Download e-Governance Connect 2018 PDF" },
    ],
  },
  {
    id: "policy-23",
    searchText: "e-Governance Policy 2017",
    facets: { cat: "egov", year: "2017" },
    cells: [
      { kind: "title", text: "e-Governance Policy 2017" },
      { kind: "ref", text: "e-Governance Policy 2017" },
      { kind: "date", text: "2017" },
      { kind: "badge", text: "e-Governance Standards", tone: "violet" },
      { kind: "download", href: "/documents/policies-guidelines/policy-guidelines_e-Governance_Policy_2017.pdf", label: "PDF", ariaLabel: "Download e-Governance Policy 2017 PDF" },
    ],
  },
];

export const searchPlaceholder = "Search policies and guidelines...";
export const noResultsText = "No policies match your filters.";
