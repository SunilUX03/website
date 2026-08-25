import type { CollectionConfig } from "payload";

// Backs the /citizen-services page's cards — deliberately minimal: each
// card is just a photo, a description, and a button out to the portal
// (per explicit instruction — "thats it nothing else is required", the
// same design intent CitizenServiceCard.tsx has documented since it was
// first built). Previously this page merged a hardcoded 2-item array
// (lib/content.ts) with a slug lookup into the Services collection —
// genuinely not manageable from the CMS at all. This collection replaces
// both: a real, freely add/remove/reorder list, the same pattern as
// Awards/Roll of Honour.
export const CitizenServices: CollectionConfig = {
  slug: "citizen-services",
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
    { name: "name", type: "text", required: true, localized: true, admin: { description: "Shown as the card's heading." } },
    { name: "description", type: "textarea", required: true, localized: true },
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "buttonLabel",
      type: "text",
      localized: true,
      admin: { description: 'Button text. Leave blank to use the automatic "Open {name}".' },
    },
    {
      name: "buttonHref",
      type: "text",
      required: true,
      admin: { description: "Where the button goes — usually an external portal URL." },
    },
    {
      name: "externalLink",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Opens in a new tab. Leave checked for an external portal (the usual case); uncheck only for a link within this site." },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Lower numbers show first." },
    },
  ],
};
