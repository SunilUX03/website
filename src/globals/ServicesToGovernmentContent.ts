import type { GlobalConfig } from "payload";

// Backs the Services to Government page's hero, its 4 fixed service
// blocks, and the department-contact table's intro copy (the table rows
// themselves are the separate "department-contacts" collection — a real
// list of entities, not page chrome). Previously all hardcoded in
// ServicesToGovernmentContent.tsx.
export const ServicesToGovernmentContent: GlobalConfig = {
  slug: "services-to-government-content",
  admin: {
    description: "The Services to Government page: hero, the 4 service blocks, and the contact table's intro copy.",
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
      name: "hero",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true, localized: true },
        { name: "heading", type: "text", required: true, localized: true },
        { name: "body", type: "textarea", required: true, localized: true },
      ],
    },
    {
      name: "services",
      type: "array",
      minRows: 4,
      maxRows: 4,
      fields: [
        { name: "name", type: "text", required: true, localized: true },
        { name: "description", type: "textarea", required: true, localized: true },
      ],
    },
    {
      name: "tableIntro",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true, localized: true },
        { name: "heading", type: "text", required: true, localized: true },
        { name: "body", type: "textarea", required: true, localized: true },
      ],
    },
    {
      name: "raiseTicketLabel",
      type: "text",
      required: true,
      defaultValue: "Raise a Ticket",
      localized: true,
    },
    {
      name: "raiseTicketHref",
      type: "text",
      required: true,
      defaultValue: "#",
      admin: { description: "Where both \"Raise a Ticket\" buttons link to." },
    },
  ],
};
