import type { CollectionConfig } from "payload";

// Manual social-post entries — see /cms/social-media. Not a live API
// integration (Facebook/Instagram/X/YouTube Graph APIs all need
// developer credentials this project doesn't have yet); an admin pastes
// in each post's text/image/date/link by hand whenever they post
// something on the real platform.
export const SocialPosts: CollectionConfig = {
  slug: "social-posts",
  admin: {
    useAsTitle: "text",
    defaultColumns: ["platform", "text", "date", "_status"],
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
      name: "platform",
      type: "select",
      required: true,
      options: [
        { label: "Facebook", value: "facebook" },
        { label: "Instagram", value: "instagram" },
        { label: "X", value: "x" },
        { label: "YouTube", value: "youtube" },
        { label: "LinkedIn", value: "linkedin" },
      ],
    },
    {
      name: "text",
      type: "textarea",
      required: true,
      admin: { description: "The post's caption/text, as shown on the Home page feed." },
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: { date: { pickerAppearance: "dayOnly" }, description: "The date this was actually posted." },
    },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "link",
      type: "text",
      admin: { description: "Link to the actual post. Leave blank to link to the platform's profile page instead." },
    },
  ],
};
