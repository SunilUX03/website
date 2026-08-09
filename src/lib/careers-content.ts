// Content for the Careers page, ported from the standalone HTML
// prototype (src_careers.html).
//
// The openings themselves now live in the CMS (see
// lib/cms/job-openings.ts); the hero copy, openings note, and application
// steps now live in the "careers-content" CMS global (see
// lib/cms/careers-content.ts). This file only keeps what's presentational
// or structural: the hero's decorative orb colours/positions (heroOrbs)
// and the role dropdown for the application form. That form posts to the
// existing Prisma-backed Careers system (/admin/careers), a separate,
// already-working pipeline this CMS work deliberately leaves alone —
// so roleOptions stays a hand-kept list rather than being derived from
// the CMS openings, to avoid coupling the two systems.
//
// jdHref on a CMS opening points at /public/documents/careers/<slug>.pdf
// — Next.js serves anything under /public as a static file at that same
// path, so dropping a real JD PDF at that exact filename is the only
// step needed to make an opening's "Download JD" link work; no code
// change required. Leave it blank on an opening to hide the button.

export const heroOrbs = [
  { color: "mint", className: "-left-20 -top-32 h-[440px] w-[440px]" },
  { color: "peach", className: "-bottom-16 right-[80px] h-[360px] w-[360px]" },
] as const;

/** Options for the "Role Applied For" select on the application form. */
export const roleOptions = [
  { value: "", label: "Select a role" },
  { value: "pm", label: "Project Manager, e-Governance" },
  { value: "da", label: "Data Analyst" },
  { value: "gis", label: "GIS Specialist" },
  { value: "aiml", label: "AI / ML Engineer" },
  { value: "ssa", label: "Software Security Analyst" },
];
