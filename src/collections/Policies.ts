import type { CollectionConfig } from "payload";

// Backs /notifications/policies-guidelines. Same shape as
// GovernmentOrders.ts, with `category` in place of `department` — kept
// as separate collections rather than one shared one because the two
// public pages, filters, and editorial categorisation are genuinely
// distinct (matching the site's existing separate content files).
export const Policies: CollectionConfig = {
  slug: "policies",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "year", "_status"],
  },
  defaultSort: "-year",
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
    { name: "title", type: "text", required: true, admin: { description: 'e.g. "Cyber Security Policy 2020"' } },
    { name: "year", type: "text", required: true },
    { name: "category", type: "text", required: true, localized: true, admin: { description: 'Shown as a badge, e.g. "Cyber Security"' } },
    { name: "file", type: "upload", relationTo: "documents", required: true },
  ],
};
