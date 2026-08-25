import type { GlobalConfig } from "payload";

// Backs the "Enabling Digital Governance" section on the Home page: its
// own eyebrow/heading, plus the 3 pillar cards' chrome (title, link
// label, banner image) on the Home and About pages. Fixed at exactly 3
// cards (Citizen Services / e-Governance Projects / Services) with no
// add/remove UI — each card's underlying project list and page anchor
// (`itemNames`/`href`) stay in code (lib/content.ts) since they're
// structural references into the Services collection and the /services
// page's section anchors, not freeform copy. No per-card `description`
// field — PillarCard.tsx doesn't render one (heading + item list only).
export const PillarsContent: GlobalConfig = {
  slug: "pillars-content",
  admin: {
    description: "The 3 pillar cards' chrome on the Home and About pages. Always exactly 3 cards.",
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
      name: "eyebrow",
      type: "text",
      required: true,
      localized: true,
      admin: { description: 'The section eyebrow, e.g. "Enabling Digital Governance".' },
    },
    {
      name: "heading",
      type: "text",
      required: true,
      localized: true,
      admin: { description: 'The section heading, e.g. "How TNeGA powers governance across Tamil Nadu".' },
    },
    {
      name: "pillars",
      type: "array",
      minRows: 3,
      maxRows: 3,
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "linkLabel", type: "text", required: true, localized: true },
        { name: "bannerImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
