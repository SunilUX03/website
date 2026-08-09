import type { CollectionConfig } from "payload";

// Third content type migrated onto the CMS — backs "Current Openings" on
// /about/careers (see src/lib/cms/job-openings.ts). Separate from the
// existing Prisma-backed Careers system (AdminUser/JobApplication,
// /admin/careers) on purpose: that system handles applications HR
// already reviews through a working pipeline, this only edits what
// openings are advertised on the public page — no shared tables, no
// shared login.
export const JobOpenings: CollectionConfig = {
  slug: "job-openings",
  admin: {
    useAsTitle: "role",
    defaultColumns: ["role", "department", "deadline", "_status"],
  },
  defaultSort: "deadline",
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
      name: "role",
      type: "text",
      required: true,
    },
    {
      name: "type",
      type: "text",
      required: true,
      defaultValue: "Contract",
      admin: {
        description: 'Employment type shown as a small badge, e.g. "Contract" or "Full-time".',
      },
    },
    {
      name: "department",
      type: "text",
      required: true,
    },
    {
      name: "deadline",
      type: "date",
      required: true,
      admin: {
        date: { pickerAppearance: "dayOnly" },
        description: "Last date to apply.",
      },
    },
    {
      name: "jdHref",
      type: "text",
      admin: {
        description:
          "Link to the job description PDF, e.g. /documents/careers/role-name.pdf after dropping the file in public/documents/careers/. Leave blank to hide the Download JD button.",
      },
    },
  ],
};
