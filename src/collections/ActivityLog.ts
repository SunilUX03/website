import type { CollectionConfig } from "payload";

// A single, unified "who changed what, when" feed across every collection
// in the custom admin — written by the log() helper in
// src/lib/portal/activity-log.ts, called from every create/update/delete
// Server Action rather than relying on each collection's own version
// history (which is per-collection and not something the UI can show as
// one combined list). Read-only from the admin UI itself — this is a
// record of actions, not something an editor edits directly.
export const ActivityLog: CollectionConfig = {
  slug: "activity-log",
  admin: {
    useAsTitle: "summary",
    defaultColumns: ["summary", "userEmail", "action", "createdAt"],
  },
  defaultSort: "-createdAt",
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: () => false,
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "userEmail", type: "text", required: true },
    {
      name: "action",
      type: "select",
      required: true,
      options: [
        { label: "Created", value: "created" },
        { label: "Updated", value: "updated" },
        { label: "Published", value: "published" },
        { label: "Unpublished", value: "unpublished" },
        { label: "Deleted", value: "deleted" },
      ],
    },
    { name: "section", type: "text", required: true, admin: { description: 'e.g. "Announcements", "Services"' } },
    { name: "summary", type: "text", required: true, admin: { description: 'e.g. "Updated \"e-Sevai Portal\""' } },
  ],
  timestamps: true,
};
