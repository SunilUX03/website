import type { CollectionConfig } from "payload";

// PDF library for Government Orders / Policies & Guidelines — mirrors
// Media.ts but for documents instead of photos: same Vercel Blob storage
// plugin, same "publicly readable, admin-managed" access shape.
export const Documents: CollectionConfig = {
  slug: "documents",
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  upload: {
    staticDir: "documents",
    mimeTypes: ["application/pdf"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "Shown in the media library list — not on the public site." },
    },
  ],
};
