import type { GlobalConfig } from "payload";

// Backs the entire Services to Government page: hero, a growable list of
// service blocks (previously fixed at exactly 4), the department-contact
// table's intro copy, and — folded in here so the whole page is one CMS
// screen — the department-contact rows themselves (previously the
// separate "department-contacts" collection, with its own list/new/edit
// pages). Row order in `departmentContacts` IS the display order
// (drag-reorderable in the CMS), so there's no separate `order` number to
// keep in sync.
export const ServicesToGovernmentContent: GlobalConfig = {
  slug: "services-to-government-content",
  admin: {
    description: "The Services to Government page: hero, service blocks, and department contacts.",
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
      name: "tableColumnHeaders",
      type: "group",
      admin: { description: "The column headings on the department-contacts table." },
      fields: [
        { name: "serialNumber", type: "text", required: true, localized: true, defaultValue: "S.No" },
        { name: "department", type: "text", required: true, localized: true, defaultValue: "Department" },
        { name: "contact", type: "text", required: true, localized: true, defaultValue: "Contact" },
        { name: "email", type: "text", required: true, localized: true, defaultValue: "Email" },
        { name: "phone", type: "text", required: true, localized: true, defaultValue: "Phone" },
      ],
    },
    {
      name: "departmentContacts",
      type: "array",
      // Custom, short dbName: the default name (parent table name +
      // "_department_contacts", then the versions-side "_v_locales"
      // suffix on top) blows past Postgres's 63-char identifier limit —
      // Payload throws at boot rather than silently truncating. See the
      // migration for the exact resulting table names.
      dbName: "svcgov_dept_contacts",
      admin: {
        description: "Which Government Department maps to which TNeGA Project Manager. Drag to reorder.",
      },
      fields: [
        { name: "department", type: "text", required: true, localized: true },
        {
          name: "contact",
          type: "text",
          required: true,
          admin: { description: 'The assigned Project Manager, e.g. "PM I"' },
        },
        { name: "email", type: "email", required: true },
        { name: "phone", type: "text", required: true },
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
