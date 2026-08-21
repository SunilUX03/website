import type { CollectionConfig } from "payload";

// Backs the About page's historical Director/CEO timeline. A plain,
// fully editable ordered list per explicit instruction — including the
// "current" entry, which is a normal editable row here rather than
// auto-linked to the Team Members collection's CEO (same choice already
// made for Board Content's Chairman/Member Secretary names): one extra
// place to update when the CEO changes, in exchange for an admin who can
// add, edit and reorder every entry the same simple way.
export const RollOfHonour: CollectionConfig = {
  slug: "roll-of-honour",
  admin: {
    useAsTitle: "designation",
    defaultColumns: ["designation", "name", "range", "_status"],
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
    { name: "designation", type: "text", required: true, localized: true },
    { name: "name", type: "text" },
    { name: "range", type: "text", localized: true, admin: { description: 'e.g. "July 2026 – Present"' } },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Lower numbers show first (most recent first)." },
    },
  ],
};
