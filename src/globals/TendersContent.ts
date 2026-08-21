import type { GlobalConfig } from "payload";

// Backs the Tenders page: hero + the "View Active Tenders" panel pointing
// to the Government of Tamil Nadu's own e-Tendering portal. No document
// list — active/upcoming tenders live entirely on that external portal,
// not here. The hero's decorative orb colours/positions stay in
// lib/tenders-content.ts (presentational, not content).
export const TendersContent: GlobalConfig = {
  slug: "tenders-content",
  admin: {
    description: "The Tenders page: hero and the link out to the Government e-Tendering portal.",
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
      ],
    },
    {
      name: "tenderPortal",
      type: "group",
      fields: [
        { name: "heading", type: "text", required: true, localized: true },
        { name: "sub", type: "text", required: true, localized: true },
        { name: "body", type: "textarea", required: true, localized: true },
        { name: "ctaLabel", type: "text", required: true, localized: true },
        { name: "ctaHref", type: "text", required: true },
        { name: "redirectNote", type: "text", required: true, localized: true },
      ],
    },
  ],
};
