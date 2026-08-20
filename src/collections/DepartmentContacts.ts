import type { CollectionConfig } from "payload";

// Backs the department contact table on /services-to-government — who at
// TNeGA (Project Manager, email, phone) each Government Department should
// reach out to. Previously hardcoded as a 39-row array in
// ServicesToGovernmentContent.tsx; a plain editable list per the same
// reasoning as Roll of Honour — one row per department, freely add/edit/
// reorder/delete rather than grouped by PM with shared contact fields, so
// an editor can update a single department without touching its neighbours.
export const DepartmentContacts: CollectionConfig = {
  slug: "department-contacts",
  admin: {
    useAsTitle: "department",
    defaultColumns: ["department", "contact", "email", "phone", "_status"],
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
    { name: "department", type: "text", required: true },
    { name: "contact", type: "text", required: true, admin: { description: 'The assigned Project Manager, e.g. "PM I"' } },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text", required: true },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Lower numbers show first." },
    },
  ],
};
