import type { GlobalConfig } from "payload";

const branchFields = [
  { name: "director" as const, type: "text" as const, required: true },
  {
    name: "engineer" as const,
    type: "text" as const,
    admin: { description: "Leave blank to draw a pass-through line instead of a box at this level (as the Project Director branch does)." },
  },
  { name: "manager" as const, type: "text" as const, required: true },
  { name: "base" as const, type: "text" as const, required: true },
];

// Backs the CEO -> JCEO -> six-branch organisation chart on the About
// page. Text-only by design — the shape (2 top boxes, exactly 6
// branches) mirrors the real reporting structure and isn't meant to be
// restructured from the admin, only relabelled, so there's no add/remove
// UI for branches even though the field itself is a normal array.
export const OrgChartContent: GlobalConfig = {
  slug: "org-chart-content",
  admin: {
    description: "The organisation chart on the About page. Labels only — the chart's shape is fixed.",
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "topPrimary", type: "text", required: true, defaultValue: "CEO" },
    { name: "topSecondary", type: "text", required: true, defaultValue: "JCEO" },
    {
      name: "branches",
      type: "array",
      minRows: 6,
      maxRows: 6,
      fields: branchFields,
    },
  ],
};
