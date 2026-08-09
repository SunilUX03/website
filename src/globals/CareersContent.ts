import type { GlobalConfig } from "payload";

// Backs the Careers page's hero copy, the note under the openings list,
// and the 4 "How to Apply" steps. Shared verbatim with the About page's
// "Join Us" teaser (same hero fields), so there's exactly one place to
// edit this copy rather than two drifting copies.
//
// Deliberately NOT here: the hero's decorative orb colours/positions and
// its "View Openings" anchor href (presentational/structural, stay in
// lib/careers-content.ts), and the application form's role dropdown
// (roleOptions) — kept a hand-kept static list, not coupled to the CMS
// Job Openings collection, per the same reasoning already applied
// elsewhere: a typo or renamed role there shouldn't silently break the
// existing Prisma-backed application form.
export const CareersContent: GlobalConfig = {
  slug: "careers-content",
  admin: {
    description: "The Careers page hero, openings note, and How to Apply steps.",
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "heading", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
        { name: "ctaLabel", type: "text", required: true },
      ],
    },
    { name: "openingsNote", type: "textarea", required: true },
    {
      name: "applicationSteps",
      type: "array",
      minRows: 4,
      maxRows: 4,
      admin: { description: "The 4 \"How to Apply\" steps, in order." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
  ],
};
