import type { GlobalConfig } from "payload";

const nodeFields = [
  { name: "label" as const, type: "text" as const, required: true, localized: true as const },
  {
    name: "sublabel" as const,
    type: "text" as const,
    localized: true as const,
    admin: { description: "Second line inside the box, e.g. the person's role under a short code like \"Proc 1\". Leave blank for a plain (unboxed) row." },
  },
  {
    name: "muted" as const,
    type: "checkbox" as const,
    defaultValue: false,
    admin: { description: "Plain grey text with no box border — for individual-contributor rows between the numbered/lettered role boxes (e.g. \"Asst. System Engineer\", \"Technical Associate\")." },
  },
];

const branchFields = [
  { name: "title" as const, type: "text" as const, required: true, localized: true as const },
  { name: "subtitle" as const, type: "text" as const, required: true, localized: true as const },
  {
    name: "nodes" as const,
    type: "array" as const,
    fields: nodeFields,
  },
];

// Backs the CEO -> seven-division organisation chart on the About page.
// Each division's own staff list is a variable-length, sequential chain
// (2 rows for the smallest division, 18 for Project Division) — not a
// fixed shape like the chart this replaced — so `nodes` is a genuine
// admin-editable array per branch, not fixed-count labels.
export const OrgChartContent: GlobalConfig = {
  slug: "org-chart-content",
  admin: {
    description: "The organisation chart on the About page: one CEO box, then each division's own title/subtitle and staff list.",
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "topLabel", type: "text", required: true, localized: true, defaultValue: "Chief Executive Officer" },
    { name: "jceoLabel", type: "text", required: true, localized: true, defaultValue: "JCEO" },
    {
      name: "branches",
      type: "array",
      minRows: 7,
      maxRows: 7,
      fields: branchFields,
    },
  ],
};
