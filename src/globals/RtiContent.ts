import type { GlobalConfig } from "payload";

// Backs the RTI page: hero, the 2 key-contact cards, the Section 4(1)(b)
// disclosure table, and the "How to File" panel. The hero's decorative
// orb colours/positions stay in lib/rti-content.ts (presentational, not
// content).
//
// A contact's detail lines and a disclosure group's sub-rows are each
// stored as one line-delimited textarea rather than a nested repeatable
// field (Payload arrays can nest, but the portal's generic RepeatableRows
// admin widget only handles one level) — same "plain text, one item per
// line" convention already used for Legal Pages' bullet lists. Convention:
// a contact detail line is `text` or `text :: href` (add ` :: href` to
// make it a link, e.g. `044 4016 4900 :: tel:04440164900`); a disclosure
// row is `detail :: info`.
export const RtiContent: GlobalConfig = {
  slug: "rti-content",
  admin: {
    description: "The RTI page: hero, key contacts, Section 4(1)(b) disclosures, and How to File.",
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
      name: "contacts",
      type: "array",
      minRows: 2,
      maxRows: 2,
      admin: { description: "Always exactly 2 cards: Appellate Authority and Public Information Officer." },
      fields: [
        { name: "badge", type: "text", required: true, localized: true },
        { name: "tone", type: "select", required: true, defaultValue: "light", options: [{ label: "Light", value: "light" }, { label: "Dark", value: "dark" }] },
        { name: "name", type: "text", required: true },
        { name: "designation", type: "text", required: true, localized: true },
        {
          name: "detailsText",
          type: "textarea",
          required: true,
          localized: true,
          admin: { description: 'One detail per line. Add " :: href" to make a line a link, e.g. "044 4016 4900 :: tel:04440164900".' },
        },
      ],
    },
    {
      name: "disclosures",
      type: "array",
      admin: { description: 'Each row of the Section 4(1)(b) table. "Sub-rows" text: one per line, formatted "Detail :: Info".' },
      fields: [
        { name: "sno", type: "text", required: true },
        { name: "item", type: "textarea", required: true, localized: true },
        { name: "rowsText", type: "textarea", required: true, localized: true, admin: { description: 'One sub-row per line, formatted "Detail :: Info".' } },
      ],
    },
    {
      name: "howToFile",
      type: "group",
      fields: [
        { name: "heading", type: "text", required: true, localized: true },
        { name: "sub", type: "text", required: true, localized: true },
        { name: "body", type: "textarea", required: true, localized: true },
        { name: "ctaLabel", type: "text", required: true, localized: true },
        { name: "ctaHref", type: "text", required: true },
        { name: "redirectNote", type: "text", required: true, localized: true },
        { name: "email", type: "text", required: true },
        { name: "phone", type: "text", required: true },
        { name: "phoneHref", type: "text", required: true },
      ],
    },
  ],
};
