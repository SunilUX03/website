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
const stringListField = (name: string, label?: string, valueRequired = true, valueMaxLength?: number) => ({
  name,
  type: "array" as const,
  admin: label ? { description: label } : undefined,
  fields: [{ name: "value", type: "text" as const, required: valueRequired, localized: true as const, ...(valueMaxLength ? { maxLength: valueMaxLength } : {}) }],
});

const qaListField = (name: string, label?: string) => ({
  name,
  type: "array" as const,
  admin: label ? { description: label } : undefined,
  fields: [
    { name: "q", type: "text" as const, required: true, localized: true as const },
    { name: "a", type: "textarea" as const, required: true, localized: true as const },
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
    { name: "name", type: "text", required: true, localized: true },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Controls this item's position on the /services page and anywhere else it's listed. Lower numbers show first." },
    },
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
      localized: true,
      admin: { description: "Shown on the card and as the About section's opening paragraph." },
    },
    {
      name: "stats",
      type: "text",
      required: true,
      localized: true,
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
        description: "This is the actual detail-page content — Key Features, Eligibility, Get Started, FAQs, etc. It must be filled in with the real submitted content before publishing. (Technically nothing here is schema-required, since service-detail-generator.ts can fall back to generic placeholder copy for anything left blank — but that fallback exists as a safety net for content still in progress, not as an acceptable end state for a published page.)",
      },
      fields: [
        {
          name: "tagline",
          type: "text",
          localized: true,
          admin: { description: "Short hero-only line. Falls back to the description above when blank." },
        },
        { name: "aboutHeading", type: "text", localized: true, admin: { description: 'The section heading. Defaults to "What {name} does".' } },
        { name: "aboutEyebrow", type: "text", localized: true, admin: { description: 'Small sub heading above the About heading. Defaults to "About the Project/Initiative" based on the Badge label.' } },
        stringListField("statistics", "One stat per row, e.g. \"273 Government services\"."),
        stringListField("keyFeatures"),
        stringListField("keyFeatureDescriptions", "Optional, same order as Key Features — a one-line description per feature (max 150 characters). Leave a row blank to use the generic fallback for that feature.", false, 150),
        { name: "featuresEyebrow", type: "text", localized: true, admin: { description: 'Defaults to "Capabilities".' } },
        { name: "featuresHeading", type: "text", localized: true, admin: { description: 'Defaults to "Key Features".' } },
        { name: "hideFeaturesSection", type: "checkbox", defaultValue: false, admin: { description: "Don't show the Key Features section on this page at all." } },
        stringListField("eligibility", "\"You can use this if...\" bullet points."),
        stringListField("whatYoullNeed"),
        { name: "eligibilityEyebrow", type: "text", localized: true, admin: { description: 'Defaults to "Eligibility".' } },
        { name: "eligibilityHeading", type: "text", localized: true, admin: { description: 'Defaults to "Who can use this".' } },
        { name: "eligibilityWhoHeading", type: "text", localized: true, admin: { description: 'Defaults to "You can use this if".' } },
        { name: "eligibilityDocsHeading", type: "text", localized: true, admin: { description: 'Defaults to "What you\'ll need".' } },
        { name: "hideEligibilitySection", type: "checkbox", defaultValue: false, admin: { description: "Don't show the Eligibility section on this page at all." } },
        qaListField("faqs"),
        qaListField("faqsMore", "Extra FAQs shown behind a \"View more\" toggle."),
        { name: "faqEyebrow", type: "text", localized: true, admin: { description: 'Defaults to "Questions".' } },
        { name: "faqHeading", type: "text", localized: true, admin: { description: 'Defaults to "Frequently asked questions".' } },
        { name: "hideFaqSection", type: "checkbox", defaultValue: false, admin: { description: "Don't show the FAQs section on this page at all." } },
        { name: "aboutSecondParagraph", type: "textarea", localized: true },
        { name: "hideAboutSecondParagraph", type: "checkbox", defaultValue: false },
        { name: "calloutText", type: "text", localized: true, admin: { description: "A plain callout line in the About section, instead of a generated pull-quote." } },
        {
          name: "aboutLinkModal",
          type: "group",
          admin: { description: "Optional link in the About section that opens a modal listing items, e.g. a schemes list." },
          fields: [
            { name: "label", type: "text", localized: true },
            { name: "title", type: "text", localized: true },
            stringListField("items"),
          ],
        },
        {
          name: "productTour",
          type: "array",
          admin: { description: "Real product screenshots. Leave empty to show a generated stock-photo carousel instead." },
          fields: [
            { name: "photo", type: "upload", relationTo: "media", required: true },
            { name: "alt", type: "text", required: true, localized: true },
          ],
        },
        { name: "productTourHeading", type: "text", localized: true, admin: { description: 'The section heading. Defaults to "A look at {name}".' } },
        { name: "hideProductTourSection", type: "checkbox", defaultValue: false, admin: { description: "Don't show the Product Tour section on this page at all." } },
        {
          name: "getStartedSteps",
          type: "array",
          admin: { description: "Overrides the generated \"How to access\" steps. Leave empty and check \"Hide steps\" below for an intro/outro-only Get Started section with no numbered steps." },
          fields: [
            { name: "title", type: "text", required: true, localized: true },
            { name: "description", type: "textarea", required: true, localized: true },
          ],
        },
        {
          name: "suppressGetStartedSteps",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Hide the numbered Get Started steps entirely (e.g. intro/outro prose only, like eOffice) rather than showing generated fallback steps." },
        },
        { name: "getStartedIntro", type: "textarea", localized: true },
        { name: "getStartedOutro", type: "textarea", localized: true },
        { name: "directLinkLabel", type: "text", localized: true, admin: { description: "Label for the Get Started direct-link button (projects only). Defaults to \"Open\"." } },
        { name: "directLinkPortalLabel", type: "text", localized: true, admin: { description: 'Text next to the direct-link button (projects only). Defaults to "{name} Portal".' } },
        { name: "getStartedEyebrow", type: "text", localized: true, admin: { description: 'Defaults to "Get started".' } },
        { name: "getStartedHeading", type: "text", localized: true, admin: { description: 'Defaults to "How to access {name}".' } },
        { name: "hideGetStartedSection", type: "checkbox", defaultValue: false, admin: { description: "Don't show the Get Started section on this page at all." } },
        { name: "comingSoon", type: "checkbox", defaultValue: false, admin: { description: "Marks a pre-launch project: CTAs become \"Coming Soon\" / \"Contact TNeGA\"." } },
        { name: "gatedAccess", type: "checkbox", defaultValue: false, admin: { description: "Marks an access-gated project (staff login, not public self-service): CTAs become \"Avail Service\" → /reach-us." } },
        {
          name: "ctaLabel",
          type: "text",
          localized: true,
          admin: {
            description: "Overrides the main button's text (Hero and card), e.g. \"Register Now\". Leave blank to use the automatic label (Access Portal / Avail Service / Coming Soon).",
          },
        },
        {
          name: "typeLabel",
          type: "select",
          required: true,
          options: [
            { label: "Project", value: "Project" },
            { label: "Initiative", value: "Initiative" },
          ],
          admin: {
            description: 'The badge shown at the top of the page. Every item is either a "Project" (has its own self-service portal) or an "Initiative".',
          },
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
