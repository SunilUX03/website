import type { CollectionConfig } from "payload";

export const Awards: CollectionConfig = {
  slug: "awards",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "year", "_status"],
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
    { name: "title", type: "text", required: true },
    { name: "year", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "image", type: "upload", relationTo: "media", required: true },
  ],
};
