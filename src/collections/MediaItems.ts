import type { CollectionConfig } from "payload";

// Second content type migrated onto the CMS — backs the Photos/Videos
// grid on /notifications/media-press (see src/lib/cms/media-items.ts).
// Single collection for both tabs, distinguished by `type`, matching how
// the static lib/media-content.ts prototype kept both in one shape.
export const MediaItems: CollectionConfig = {
  slug: "media-items",
  admin: {
    useAsTitle: "caption",
    defaultColumns: ["caption", "type", "date", "_status"],
  },
  defaultSort: "-date",
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
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "photo",
      options: [
        { label: "Photo", value: "photo" },
        { label: "Video", value: "video" },
      ],
    },
    {
      name: "caption",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "Shown under the thumbnail on the media grid.",
      },
    },
    {
      name: "altText",
      type: "text",
      localized: true,
      admin: {
        description: "Accessibility description of the image. Falls back to the caption if left blank.",
      },
    },
    {
      name: "date",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: "dayOnly" },
        description: "Only the month and year are shown on the site.",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
  ],
};
