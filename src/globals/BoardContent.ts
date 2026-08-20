import type { GlobalConfig } from "payload";

// Backs "Governing TNeGA's mission" on /about (BoardOfDirectors.tsx). A
// global, not a collection: chairman/memberSecretary are specific fixed
// seats, not one-of-many documents, matching the shape the component
// already renders (governingBoard.chairman/memberSecretary/members).
const seatFields = (roleDefault: string) => [
  { name: "role" as const, type: "text" as const, required: true, defaultValue: roleDefault },
  { name: "name" as const, type: "text" as const, required: true },
  // Optional: seats can hold just a designation (no confirmed appointee
  // name yet), in which case there's no secondary line to show.
  { name: "title" as const, type: "text" as const, required: false },
];

export const BoardContent: GlobalConfig = {
  slug: "board-content",
  admin: {
    description: "Governing Board shown on the About page.",
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "chairman",
      type: "group",
      fields: seatFields("Chairman"),
    },
    {
      name: "memberSecretary",
      type: "group",
      fields: seatFields("Member Secretary"),
    },
    {
      name: "members",
      type: "array",
      admin: {
        description: "Regular Governing Board members, shown in the carousel below the two seats above.",
      },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "title", type: "text", required: false },
        {
          name: "isPlaceholder",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Check if this name is a placeholder rather than the real, confirmed appointee — a reminder for editors to replace it once the real name is available. Doesn't change what's shown on the site.",
          },
        },
      ],
    },
  ],
};
