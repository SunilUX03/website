import type { GlobalConfig } from "payload";

// Backs the Careers page's hero copy, the note under the openings list,
// and the 4 "How to Apply" steps. Shared verbatim with the About page's
// "Join Us" teaser (same hero fields), so there's exactly one place to
// edit this copy rather than two drifting copies.
//
// Deliberately NOT here: the hero's decorative orb colours/positions and
// its "View Openings" anchor href (presentational/structural, stay in
// lib/careers-content.ts), and the application form's role dropdown —
// that's the Career Portal's Roles page (Prisma JobRole), not this CMS
// global, since HR now manages the whole Careers pipeline from there.
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
        { name: "eyebrow", type: "text", required: true, localized: true },
        { name: "heading", type: "text", required: true, localized: true },
        { name: "body", type: "textarea", required: true, localized: true },
        { name: "ctaLabel", type: "text", required: true, localized: true },
      ],
    },
    { name: "openingsNote", type: "textarea", required: true, localized: true },
    {
      name: "applicationSteps",
      type: "array",
      minRows: 4,
      maxRows: 4,
      admin: { description: "The 4 \"How to Apply\" steps, in order." },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "description", type: "textarea", required: true, localized: true },
      ],
    },
    {
      name: "howToApplySection",
      type: "group",
      admin: { description: 'The heading above the "How to Apply" steps, e.g. "How to Apply" / "A simple four step process to join our team."' },
      fields: [
        { name: "heading", type: "text", required: true, localized: true },
        { name: "sub", type: "textarea", required: true, localized: true },
      ],
    },
    {
      name: "openingsSection",
      type: "group",
      admin: { description: 'The heading above the Current Openings list, e.g. "Current Openings".' },
      fields: [
        { name: "heading", type: "text", required: true, localized: true },
      ],
    },
    {
      name: "applySection",
      type: "group",
      admin: { description: 'The heading above the Apply Now form, e.g. "Apply Now" / "Fill in your details below and we will get back to you."' },
      fields: [
        { name: "heading", type: "text", required: true, localized: true },
        { name: "sub", type: "textarea", required: true, localized: true },
      ],
    },
  ],
};
