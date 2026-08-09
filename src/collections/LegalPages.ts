import type { CollectionConfig } from "payload";

// Backs Privacy Policy, Terms & Conditions, Terms of Use, Disclaimer,
// Help, and Feedback's intro copy — all previously hardcoded JSX with
// the same shape (a short intro + a few heading+paragraph sections), so
// one generic collection covers all of them instead of a bespoke schema
// per page. A bullet list is written as lines starting with "- " inside
// a section's body — rendered as a <ul> when every line in a paragraph
// starts that way, a <p> otherwise (see lib/cms/legal-pages.ts).
export const LegalPages: CollectionConfig = {
  slug: "legal-pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status"],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return { _status: { equals: "published" } };
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "slug",
      type: "select",
      required: true,
      unique: true,
      options: [
        { label: "Privacy Policy", value: "privacy-policy" },
        { label: "Terms & Conditions", value: "terms-conditions" },
        { label: "Terms of Use", value: "terms-of-use" },
        { label: "Disclaimer", value: "disclaimer" },
        { label: "Help", value: "help" },
        { label: "Feedback (intro only)", value: "feedback" },
      ],
      admin: {
        description: "Which page this content backs — matches a fixed route, not a URL you can change.",
      },
    },
    { name: "title", type: "text", required: true },
    { name: "eyebrow", type: "text", defaultValue: "Legal" },
    { name: "intro", type: "textarea" },
    {
      name: "sections",
      type: "array",
      fields: [
        { name: "heading", type: "text", required: true },
        {
          name: "body",
          type: "textarea",
          required: true,
          admin: {
            description: 'Separate paragraphs with a blank line. A paragraph where every line starts with "- " renders as a bullet list.',
          },
        },
      ],
    },
  ],
};
