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
    // Must match where the bulk-downloaded PDF library actually lives —
    // see the matching comment in Media.ts for why a bare "documents"
    // (resolving to a project-root ./documents Next.js never serves) is
    // wrong.
    staticDir: "public/documents",
    mimeTypes: ["application/pdf"],
  },
  // See the matching comment in Media.ts — local uploads default doc.url
  // to Payload's own API route, which can't read public/ files at
  // runtime in a Vercel serverless function. This rewrites it to a plain
  // "/documents/filename.pdf" static path instead.
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc.filename) doc.url = `/documents/${doc.filename}`;
        return doc;
      },
    ],
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
