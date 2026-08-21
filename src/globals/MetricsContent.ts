import type { GlobalConfig } from "payload";

// Backs the 6 stat cards in the homepage's "Delivering Digital Governance
// at Scale" section. Text-only by explicit instruction — always exactly
// 6 cards, no add/remove UI, matching the same fixed-shape pattern as
// Leadership Band and the Org Chart branches.
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
      name: "metrics",
      type: "array",
      minRows: 6,
      maxRows: 6,
      fields: [
        { name: "value", type: "number", required: true },
        { name: "decimals", type: "number", admin: { description: "Decimal places to show, e.g. 2 for 24.27. Leave blank for a whole number." } },
        { name: "prefix", type: "text", admin: { description: 'e.g. "₹"' } },
        { name: "suffix", type: "text", admin: { description: 'e.g. "+", " Cr", " Lakh"' } },
        { name: "label", type: "text", required: true, localized: true },
      ],
    },
  ],
};
