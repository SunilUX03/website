import type { GlobalConfig } from "payload";

// Backs the 3 "Enabling Digital Governance" pillar cards' chrome (title,
// description, link label, banner image) on the Home and About pages.
// Fixed at exactly 3 cards (Citizen Services / e-Governance Projects /
// Services) with no add/remove UI — each card's underlying project list
// and page anchor (`itemNames`/`href`) stay in code (lib/content.ts)
// since they're structural references into the Services collection and
// the /services page's section anchors, not freeform copy.
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
      name: "pillars",
      type: "array",
      minRows: 3,
      maxRows: 3,
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "description", type: "textarea", required: true, localized: true },
        { name: "linkLabel", type: "text", required: true, localized: true },
        { name: "bannerImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
