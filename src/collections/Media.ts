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
    // Local disk storage (see payload.config.ts — no storage plugin is
    // configured, so this is the actual, active storage). Must be
    // "public/media", not a bare "media": a bare relative path resolves
    // to a project-root ./media directory that Next.js never serves and
    // that doesn't match where already-uploaded files live, which is
    // exactly what broke every existing image (500s reading a file that
    // "doesn't exist" because Payload was looking in the wrong folder).
    staticDir: "public/media",
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
