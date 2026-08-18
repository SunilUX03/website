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
  // Local (non-cloud-storage) uploads default `doc.url` to Payload's own
  // API route (/api/payload/media/file/...), which reads the file off
  // disk inside the request handler at runtime — fine locally, but on
  // Vercel that handler runs in a serverless function that doesn't have
  // public/ available for arbitrary dynamic fs reads (only Next's own
  // static file serving does, which is what actually served every image
  // before this). Rewriting url/sizes[].url to the plain "/media/..."
  // path here means every existing `doc.url` read across the codebase
  // resolves to a static asset in both environments, no server code
  // involved on either — same fix as Documents.ts.
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc.filename) doc.url = `/media/${doc.filename}`;
        if (doc.sizes) {
          for (const size of Object.values(doc.sizes) as { filename?: string; url?: string }[]) {
            if (size?.filename) size.url = `/media/${size.filename}`;
          }
        }
        return doc;
      },
    ],
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
