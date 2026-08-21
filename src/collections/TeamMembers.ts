import type { CollectionConfig } from "payload";

// Backs "The people behind TNeGA" on /about (LeadershipTeam.tsx) — the
// CEO and the rest of the leadership team in one collection, ordered by
// `order` (CEO first), matching how the component already treats them as
// one flat list rather than a featured CEO card above the rest.
export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "designation", "order", "_status"],
  },
  defaultSort: "order",
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
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: 'Use "Vacant" for a currently-unfilled post rather than inventing a name.',
      },
    },
    {
      name: "designation",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "subject",
      type: "text",
      localized: true,
      admin: {
        description: 'Department/division, e.g. "GIS" or "Procurement/ DRO". Leave blank for the CEO.',
      },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        description: "Lower numbers show first. The CEO is normally 0.",
      },
    },
  ],
};
