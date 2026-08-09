import type { CollectionConfig } from "payload";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** A single string as one array row — Payload arrays need an object per
 * row, so every string[] field in the old ServiceItem/RealContent shape
 * (statistics, keyFeatures, eligibility, ...) becomes an array of these. */
const stringListField = (name: string, label?: string) => ({
  name,
  type: "array" as const,
  admin: label ? { description: label } : undefined,
  fields: [{ name: "value", type: "text" as const, required: true }],
});

const qaListField = (name: string, label?: string) => ({
  name,
  type: "array" as const,
  admin: label ? { description: label } : undefined,
  fields: [
    { name: "q", type: "text" as const, required: true },
    { name: "a", type: "textarea" as const, required: true },
  ],
});

// Fourth and largest content type migrated onto the CMS: the 17 items
// across the /services 3-tab listing and their detail pages (see
// src/lib/cms/services.ts and service-detail-generator.ts). Mirrors the
// old ServiceItem/RealContent shape from lib/services-content.ts field
// for field, on purpose — service-detail-generator.ts already treats
// every `real.*` field as optional with a generated fallback (TNGIS and
// GRAINS have no `real` content today and rely entirely on that
// fallback), so keeping the same shape here means the generator and
// ServiceDetailContent.tsx need no logic changes, only a new data source.
export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "sections", "_status"],
  },
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
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "Used in the page URL. Auto-filled from the name." },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return slugify(value);
            if (data?.name) return slugify(data.name);
            return value;
          },
        ],
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: { description: "Shown on the card and as the About section's opening paragraph." },
    },
    {
      name: "stats",
      type: "text",
      required: true,
      admin: { description: 'A single " · "-joined line, e.g. "273 Services · 25,277 Centres · ...".' },
    },
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "accessPortalHref",
      type: "text",
      admin: {
        description: 'Presence decides the CTA/template: set (even "#" as a placeholder) for a citizen-facing "project" with an Access Portal button; leave blank for a department-facing "service" routed to /reach-us.',
      },
    },
    {
      name: "sections",
      type: "select",
      hasMany: true,
      required: true,
      options: [
        { label: "Citizen Services", value: "citizen-services" },
        { label: "e-Governance Projects", value: "e-governance-projects" },
        { label: "Services", value: "services" },
      ],
      admin: {
        description: "Every /services tab this item appears under. The first one picked is its \"home\" section for the breadcrumb and Related carousel.",
      },
    },
    {
      name: "real",
      type: "group",
      admin: {
        description: "Official submitted content for the detail page. Every field here is optional — service-detail-generator.ts fills in sensible generated copy for anything left blank.",
      },
      fields: [
        {
          name: "tagline",
          type: "text",
          admin: { description: "Short hero-only line. Falls back to the description above when blank." },
        },
        stringListField("statistics", "One stat per row, e.g. \"273 Government services\"."),
        stringListField("keyFeatures"),
        stringListField("keyFeatureDescriptions", "Optional, same order as Key Features — a one-line description per feature. Leave a row blank to use the generic fallback for that feature."),
        { name: "hideStatFeatureCards", type: "checkbox", defaultValue: false, admin: { description: "Statistics normally also become Key Feature cards — check this when Key Features is already complete on its own." } },
        stringListField("eligibility", "\"You can use this if...\" bullet points."),
        stringListField("whatYoullNeed"),
        qaListField("faqs"),
        qaListField("faqsMore", "Extra FAQs shown behind a \"View more\" toggle."),
        { name: "aboutSecondParagraph", type: "textarea" },
        { name: "hideAboutSecondParagraph", type: "checkbox", defaultValue: false },
        { name: "calloutText", type: "text", admin: { description: "A plain callout line in the About section, instead of a generated pull-quote." } },
        {
          name: "aboutLinkModal",
          type: "group",
          admin: { description: "Optional link in the About section that opens a modal listing items, e.g. a schemes list." },
          fields: [
            { name: "label", type: "text" },
            { name: "title", type: "text" },
            stringListField("items"),
          ],
        },
        {
          name: "productTour",
          type: "array",
          admin: { description: "Real product screenshots. Leave empty to show a generated stock-photo carousel instead." },
          fields: [
            { name: "photo", type: "upload", relationTo: "media", required: true },
            { name: "alt", type: "text", required: true },
          ],
        },
        { name: "productTourCaption", type: "text" },
        {
          name: "getStartedSteps",
          type: "array",
          admin: { description: "Overrides the generated \"How to access\" steps. Leave empty and check \"Hide steps\" below for an intro/outro-only Get Started section with no numbered steps." },
          fields: [
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
          ],
        },
        {
          name: "suppressGetStartedSteps",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Hide the numbered Get Started steps entirely (e.g. intro/outro prose only, like eOffice) rather than showing generated fallback steps." },
        },
        { name: "getStartedIntro", type: "textarea" },
        { name: "getStartedOutro", type: "textarea" },
        { name: "directLinkLabel", type: "text", admin: { description: "Label for the Get Started direct-link button (projects only). Defaults to \"Open\"." } },
        { name: "comingSoon", type: "checkbox", defaultValue: false, admin: { description: "Marks a pre-launch project: CTAs become \"Coming Soon\" / \"Contact TNeGA\"." } },
        { name: "gatedAccess", type: "checkbox", defaultValue: false, admin: { description: "Marks an access-gated project (staff login, not public self-service): CTAs become \"Avail Service\" → /reach-us." } },
        { name: "relatedCardStats", type: "text", admin: { description: "Overrides the stats line shown on cards elsewhere on the site (the Hero keeps showing the main stats field above)." } },
        {
          name: "typeLabel",
          type: "select",
          options: [
            { label: "Project", value: "Project" },
            { label: "Service", value: "Service" },
          ],
          admin: { description: "Overrides the \"Project\"/\"Service\" badge label shown on the page — independent of the Project/Service CTA behaviour, which is still driven by Access Portal Link above." },
        },
        {
          name: "contact",
          type: "group",
          admin: { description: "Overrides the sitewide footer contact info for this item's Contact section." },
          fields: [
            { name: "email", type: "text" },
            { name: "phone", type: "text" },
          ],
        },
      ],
    },
  ],
};
