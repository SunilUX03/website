import type { CollectionConfig } from "payload";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// First real content migrated off a static lib/*.ts file and onto the
// CMS — the homepage teaser, the /notifications/announcements list, and
// each announcement's own detail page all read from this collection now
// (see src/lib/cms/announcements.ts) instead of a hardcoded array.
export const Announcements: CollectionConfig = {
  slug: "announcements",
  admin: {
    useAsTitle: "heading",
    defaultColumns: ["heading", "date", "_status"],
  },
  // Drafts: an editor's change doesn't reach the live site until
  // explicitly published — a typo or a bad photo shouldn't go live the
  // instant someone hits save on a government site.
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      // Logged-in CMS users (previewing in the admin UI) see drafts too;
      // the public site only ever gets published documents.
      if (user) return true;
      return { _status: { equals: "published" } };
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Used in the page URL. Auto-filled from the heading — only change this if you need a specific URL.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return slugify(value);
            if (data?.heading) return slugify(data.heading);
            return value;
          },
        ],
      },
    },
    {
      name: "date",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: "dayOnly" },
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      localized: true,
      admin: {
        description: "Short summary shown on the announcement card (homepage and listing page).",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      // Deliberately optional — a text-only update (e.g. a helpline
      // change) shouldn't be forced to carry a stock photo.
    },
    {
      name: "category",
      type: "text",
      localized: true,
      admin: {
        description: 'Short label shown above the headline on the detail page, e.g. "Service Launch".',
      },
    },
    {
      name: "body",
      type: "richText",
      localized: true,
      admin: {
        description: "Full announcement body, shown on its own page. Leave blank to show only the summary.",
      },
    },
    {
      name: "facts",
      type: "array",
      admin: {
        description: 'Optional "at a glance" figures shown on the detail page (e.g. Services live: 10).',
      },
      fields: [
        { name: "label", type: "text", required: true, localized: true },
        { name: "value", type: "text", required: true },
      ],
    },
    {
      name: "tickerFeatured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Show this announcement in the homepage scrolling ticker.",
      },
    },
    {
      name: "tickerOrder",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Lower numbers show first in the ticker. Only matters when \"Show in ticker\" is checked.",
      },
    },
    {
      name: "links",
      type: "array",
      admin: {
        description: "Optional related links shown on the detail page (e.g. to a service or Government Orders).",
      },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
};
