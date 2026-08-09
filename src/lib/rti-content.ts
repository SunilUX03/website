// Content for the RTI page. hero copy/contacts/disclosures/howToFile now
// live in the "rti-content" CMS global (see lib/cms/rti-content.ts) —
// this file only keeps the hero's decorative orb colours/positions,
// which are presentational, not content.

export const heroOrbs = [
  { color: "sky", className: "-left-20 -top-24 h-[420px] w-[420px]" },
  { color: "lavender", className: "-bottom-16 right-[60px] h-[360px] w-[360px]" },
] as const;
