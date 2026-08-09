import type { GlobalConfig } from "payload";

// Backs the "Leading Digital Tamil Nadu" band on the homepage
// (AboutLeadership.tsx) — the CM/IT Minister signature strip just below
// the Hero. Kept separate from HeroContent even though both used to live
// under one `hero` export in lib/content.ts: this is a different,
// visually distinct section further down the page, and splitting them
// means an editor working on the Hero doesn't also see photos of the
// Chief Minister mixed into the same form.
export const LeadershipBandContent: GlobalConfig = {
  slug: "leadership-band-content",
  admin: {
    description: '"Leading Digital Tamil Nadu" band on the homepage — the CM/Minister signature strip.',
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
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "leaders",
      type: "array",
      required: true,
      minRows: 2,
      maxRows: 2,
      admin: {
        description: "Exactly two — shown as a larger (first) and smaller (second) signature.",
      },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "photo", type: "upload", relationTo: "media", required: true },
        {
          name: "photoPosition",
          type: "text",
          defaultValue: "50% 50%",
          admin: {
            description: 'CSS object-position for the photo crop, e.g. "50% 20%" to bias toward the top.',
          },
        },
        {
          name: "quote",
          type: "textarea",
          admin: {
            description: "Not currently shown on the site — reserved for future use.",
          },
        },
      ],
    },
  ],
};
