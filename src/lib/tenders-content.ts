// Content for Tenders. The page no longer lists tenders directly (see
// tenderPortal below) — active/upcoming tenders live on the Government of
// Tamil Nadu's own e-Tendering portal instead of a locally maintained PDF
// table, so this page just points there.

export const hero = {
  eyebrow: "Procurement",
  heading: "Tenders & Procurement Opportunities",
  body: "Active and upcoming tenders from Tamil Nadu e-Governance Agency are published on the Tamil Nadu Government e-Tendering portal.",
  orbs: [
    { color: "peach", className: "-left-16 -top-20 h-[400px] w-[400px]" },
    { color: "lavender", className: "-bottom-16 left-[260px] h-[340px] w-[340px]" },
  ] as const,
};

export const tenderPortal = {
  heading: "View Active Tenders",
  sub: "TNeGA's tenders are listed on the Government of Tamil Nadu's centralized e-Tendering portal.",
  body: "All active and upcoming tenders published by the Department of Information Technology, including Tamil Nadu e-Governance Agency, are listed on the official e-Tendering portal.",
  ctaLabel: "View Tenders",
  ctaHref:
    "https://tntenders.gov.in/nicgep/app?page=FrontEndLatestActiveTendersOrgwise&service=page&org=DepartmentofInformationTechnology",
  redirectNote: "You will be redirected to the Tamil Nadu e-Tendering portal at tntenders.gov.in",
};
