import type { CollectionConfig } from "payload";

// Backs /notifications/government-orders. "Title" doubles as the G.O.
// reference number (e.g. "G.O. (Ms).No. 2") — every row in the original
// static data used the same text for both, since that number IS a
// Government Order's identity.
export const GovernmentOrders: CollectionConfig = {
  slug: "government-orders",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "department", "year", "_status"],
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
    { name: "title", type: "text", required: true, admin: { description: 'e.g. "G.O. (Ms).No. 2"' } },
    { name: "year", type: "text", required: true },
    { name: "department", type: "text", required: true, localized: true, admin: { description: 'Shown as a badge, e.g. "IT&DS Department"' } },
    { name: "file", type: "upload", relationTo: "documents", required: true },
  ],
};
