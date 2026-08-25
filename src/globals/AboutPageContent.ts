import type { GlobalConfig } from "payload";

// Backs the small text chrome across the whole About page: Hero, Who We
// Are, the 3-box reporting-line strip, Vision & Mission, Connect With Us,
// and the eyebrow/heading pair for every other section on the page
// (Organisation Structure, Leadership & Team, Governing Board, Awards,
// Roll of Honour) — bundled into one global rather than a separate
// settings screen per section, matching how an editor thinks of "the
// About page" as one thing to update, not several. Each of those other
// sections' own *content* (org chart boxes, team members, board seats,
// awards, honour roll) still lives in its own collection/global; only
// the section-level eyebrow/heading text lives here.
export const AboutPageContent: GlobalConfig = {
  slug: "about-page-content",
  admin: {
    description: "Hero, Who We Are, Vision & Mission, Connect With Us, and every section heading on the About page.",
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
        { name: "headline", type: "text", required: true, localized: true },
        { name: "description", type: "textarea", required: true, localized: true },
      ],
    },
    {
      name: "whoWeAre",
      type: "group",
      fields: [
        { name: "heading", type: "text", required: true, localized: true },
        { name: "paragraph", type: "textarea", required: true, localized: true },
      ],
    },
    {
      name: "hierarchy",
      type: "array",
      admin: { description: "The reporting-line boxes shown below Who We Are, top to bottom." },
      fields: [
        { name: "label", type: "text", required: true, localized: true },
        { name: "emphasized", type: "checkbox", defaultValue: false, admin: { description: "Highlight this box (used for TNeGA itself)." } },
      ],
    },
    {
      name: "visionMission",
      type: "array",
      admin: { description: "Normally exactly two: Vision and Mission." },
      fields: [
        { name: "label", type: "text", required: true, localized: true },
        { name: "title", type: "text", required: true, localized: true },
        { name: "description", type: "textarea", required: true, localized: true },
      ],
    },
    {
      name: "connectWithUs",
      type: "group",
      fields: [
        { name: "email", type: "text", required: true },
        {
          name: "social",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "orgChartSection",
      type: "group",
      admin: { description: 'The heading above the Organisation Structure chart, e.g. "Organisation Structure" / "How TNeGA is organised".' },
      fields: [
        { name: "eyebrow", type: "text", required: true, localized: true },
        { name: "heading", type: "text", required: true, localized: true },
      ],
    },
    {
      name: "leadershipSection",
      type: "group",
      admin: { description: 'The heading above the Leadership & Team cards, e.g. "Leadership & Team" / "The people behind TNeGA".' },
      fields: [
        { name: "eyebrow", type: "text", required: true, localized: true },
        { name: "heading", type: "text", required: true, localized: true },
      ],
    },
    {
      name: "boardSection",
      type: "group",
      admin: { description: 'The heading above the Governing Board, e.g. "Governing Board" / "Governing TNeGA\'s mission".' },
      fields: [
        { name: "eyebrow", type: "text", required: true, localized: true },
        { name: "heading", type: "text", required: true, localized: true },
      ],
    },
    {
      name: "awardsSection",
      type: "group",
      admin: { description: 'The heading above Awards & Recognition, e.g. "Awards & Recognition" / "Recognised for governance impact".' },
      fields: [
        { name: "eyebrow", type: "text", required: true, localized: true },
        { name: "heading", type: "text", required: true, localized: true },
      ],
    },
    {
      name: "rollOfHonourSection",
      type: "group",
      admin: { description: 'The heading above Roll of Honour, e.g. "Roll of Honour" / "Leading TNeGA since 2006".' },
      fields: [
        { name: "eyebrow", type: "text", required: true, localized: true },
        { name: "heading", type: "text", required: true, localized: true },
      ],
    },
  ],
};
