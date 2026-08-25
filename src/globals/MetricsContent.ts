import type { GlobalConfig } from "payload";

// Backs the 6 stat cards in the homepage's "Delivering Digital Governance
// at Scale" section. Text-only by explicit instruction — always exactly
// 6 cards, no add/remove UI, matching the same fixed-shape pattern as
// Leadership Band and the Org Chart branches. Each card is just two
// plain fields (Metric, Label) — the previous value/decimals/prefix/
// suffix split (feeding an animated count-up) was simpler for the site
// but confusing to fill in from the admin; the CMS owner asked for a
// single freeform "Metric" field instead, at the cost of the animation.
export const MetricsContent: GlobalConfig = {
  slug: "metrics-content",
  admin: {
    description: "The 6 stat cards on the homepage. Values and labels only — always exactly 6 cards.",
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
      name: "heading",
      type: "text",
      required: true,
      localized: true,
      admin: { description: 'The section heading, e.g. "Delivering Digital Governance at Scale".' },
    },
    {
      name: "metrics",
      type: "array",
      minRows: 6,
      maxRows: 6,
      fields: [
        { name: "metric", type: "text", required: true, admin: { description: 'The figure exactly as shown, e.g. "273+", "₹43,318 Cr", "24.27 Lakh".' } },
        { name: "label", type: "text", required: true, localized: true },
      ],
    },
  ],
};
