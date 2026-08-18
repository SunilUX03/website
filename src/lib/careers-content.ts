// Content for the Careers page, ported from the standalone HTML
// prototype (src_careers.html).
//
// The openings themselves live in Payload (see lib/cms/job-openings.ts);
// the hero copy, openings note, and application steps live in the
// "careers-content" CMS global (see lib/cms/careers-content.ts). This
// file only keeps what's presentational or structural: the hero's
// decorative orb colours/positions.
//
// The "Role Applied For" dropdown is no longer a hand-kept list here —
// it's managed from the Career Portal's Roles page (Prisma JobRole
// model, see career-portal/roles) and fetched server-side by the Careers
// page itself, since roles need to stay editable by HR without a code
// change.
//
// jdHref on a Payload opening points at /public/documents/careers/<slug>.pdf
// — Next.js serves anything under /public as a static file at that same
// path, so dropping a real JD PDF at that exact filename is the only
// step needed to make an opening's "Download JD" link work; no code
// change required. Leave it blank on an opening to hide the button.

export const heroOrbs = [
  { color: "mint", className: "-left-20 -top-32 h-[440px] w-[440px]" },
  { color: "peach", className: "-bottom-16 right-[80px] h-[360px] w-[360px]" },
] as const;
