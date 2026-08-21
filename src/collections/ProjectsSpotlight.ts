import type { CollectionConfig } from "payload";

// Backs the homepage's "Projects Spotlight" carousel. Each entry points
// at an existing "services" collection item rather than duplicating its
// name/description/image — the admin picks which service(s) to feature
// (see the portal's /cms/projects-spotlight/add screen) and only sets the
// spotlight-specific extras here: the big carousel stat numbers (which
// differ in shape from a service's own single joined `stats` string),
// the CTA buttons, an optional badge, and the carousel order.
export const ProjectsSpotlight: CollectionConfig = {
  slug: "projects-spotlight",
  admin: {
    useAsTitle: "service",
    defaultColumns: ["service", "order", "_status"],
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
    { name: "service", type: "relationship", relationTo: "services", required: true, hasMany: false },
    { name: "badge", type: "text", localized: true, admin: { description: 'Optional small badge, e.g. "MeitY Approved".' } },
    {
      name: "stats",
      type: "array",
      admin: { description: "The numbers shown under the description, e.g. \"410 Services\"." },
      fields: [
        { name: "value", type: "number", required: true },
        { name: "suffix", type: "text", admin: { description: 'e.g. " Crore+", "%"' } },
        { name: "label", type: "text", required: true, localized: true },
      ],
    },
    {
      name: "ctas",
      type: "array",
      admin: { description: "The buttons shown on the card, e.g. \"Login to Portal\" / \"Know more\"." },
      fields: [
        { name: "label", type: "text", required: true, localized: true },
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
