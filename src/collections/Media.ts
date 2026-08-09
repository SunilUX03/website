import type { CollectionConfig } from "payload";

// The editable image library — Phase 1 wires actual site photos to pull
// from here instead of static files in /public, so an editor can swap a
// photo through a normal upload button instead of asking a developer to
// drop a file at an exact path.
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    // Photos need to be publicly loadable by the live site's <img> tags —
    // this is the one collection anonymous visitors can read.
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  upload: {
    // `staticDir` only matters if nothing else handles storage. The
    // vercelBlobStorage plugin (see payload.config.ts) takes over actual
    // file storage for this collection and disables local-disk writes —
    // left here only as the inert default if that plugin's ever removed.
    staticDir: "media",
    imageSizes: [
      { name: "thumbnail", width: 400, height: undefined, position: "centre" },
      { name: "card", width: 1200, height: undefined, position: "centre" },
    ],
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Describes the photo for screen readers — required for accessibility.",
      },
    },
  ],
};
