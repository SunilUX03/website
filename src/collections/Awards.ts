import type { CollectionConfig } from "payload";

const MAX_DESCRIPTION_WORDS = 35;

function validateWordLimit(max: number) {
  return (value: string | null | undefined) => {
    if (!value) return true;
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    return words <= max ? true : `Keep this to ${max} words or fewer (currently ${words}).`;
  };
}

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
    { name: "title", type: "text", required: true, localized: true },
    { name: "year", type: "text", required: true },
    {
      name: "description",
      type: "textarea",
      required: true,
      localized: true,
      validate: validateWordLimit(MAX_DESCRIPTION_WORDS),
      admin: { description: `Keep it to ${MAX_DESCRIPTION_WORDS} words or fewer — the card has no fixed height, so a long description makes it noticeably taller than the others in the row.` },
    },
    { name: "image", type: "upload", relationTo: "media", required: true },
  ],
};
