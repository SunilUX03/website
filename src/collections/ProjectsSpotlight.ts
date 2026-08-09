import type { CollectionConfig } from "payload";

// Backs the homepage's "Projects Spotlight" carousel — unlike Metrics or
// the Org Chart, this is a genuine list of highlighted projects with no
// fixed count, so it's a normal add/edit/delete collection like
// Announcements or Awards rather than a fixed-shape global.
export const ProjectsSpotlight: CollectionConfig = {
  slug: "projects-spotlight",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order", "_status"],
  },
  defaultSort: "order",
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
    { name: "name", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "badge", type: "text", admin: { description: 'Optional small badge, e.g. "MeitY Approved".' } },
    {
      name: "stats",
      type: "array",
      admin: { description: "The numbers shown under the description, e.g. \"410 Services\"." },
      fields: [
        { name: "value", type: "number", required: true },
        { name: "suffix", type: "text", admin: { description: 'e.g. " Crore+", "%"' } },
        { name: "label", type: "text", required: true },
      ],
    },
    {
      name: "ctas",
      type: "array",
      admin: { description: "The buttons shown on the card, e.g. \"Login to Portal\" / \"Know more\"." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Lower numbers show first in the carousel." },
    },
  ],
};
