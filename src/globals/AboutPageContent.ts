import type { GlobalConfig } from "payload";

// Backs the top portion of the About page: Hero, Who We Are, the 3-box
// reporting-line strip, Vision & Mission, and Connect With Us — all
// small, mostly-text sections bundled into one global rather than five
// separate settings screens, matching how an editor thinks of "the About
// page" as one thing to update, not five.
export const AboutPageContent: GlobalConfig = {
  slug: "about-page-content",
  admin: {
    description: "Hero, Who We Are, Vision & Mission, and Connect With Us on the About page.",
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
        { name: "headline", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "whoWeAre",
      type: "group",
      fields: [
        { name: "heading", type: "text", required: true },
        { name: "paragraph", type: "textarea", required: true },
      ],
    },
    {
      name: "hierarchy",
      type: "array",
      admin: { description: "The reporting-line boxes shown below Who We Are, top to bottom." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "emphasized", type: "checkbox", defaultValue: false, admin: { description: "Highlight this box (used for TNeGA itself)." } },
      ],
    },
    {
      name: "visionMission",
      type: "array",
      admin: { description: "Normally exactly two: Vision and Mission." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
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
  ],
};
