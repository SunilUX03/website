// Content for Tenders. hero copy/tenderPortal now live in the
// "tenders-content" CMS global (see lib/cms/tenders-content.ts) — this
// file only keeps the hero's decorative orb colours/positions, which are
// presentational, not content. The page no longer lists tenders directly
// — active/upcoming tenders live on the Government of Tamil Nadu's own
// e-Tendering portal instead of a locally maintained PDF table.

export const heroOrbs = [
  { color: "peach", className: "-left-16 -top-20 h-[400px] w-[400px]" },
  { color: "lavender", className: "-bottom-16 left-[260px] h-[340px] w-[340px]" },
] as const;
