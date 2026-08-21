import type { GlobalConfig } from "payload";

const linkGroup = (name: string, description: string) => ({
  name,
  type: "array" as const,
  admin: { description },
  fields: [
    { name: "label" as const, type: "text" as const, required: true, localized: true },
    { name: "href" as const, type: "text" as const, required: true },
  ],
});

// Backs the sitewide Footer. `mapsHref` isn't a field here — it's always
// derived from `address` at render time (see lib/cms/footer.ts), so the
// two can never point at different places.
export const FooterContent: GlobalConfig = {
  slug: "footer-content",
  admin: {
    description: "The footer shown at the bottom of every page.",
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "description", type: "text", required: true, localized: true },
    { name: "address", type: "textarea", required: true, localized: true },
    { name: "phone", type: "text", required: true },
    { name: "email", type: "text", required: true },
    {
      name: "socialLinks",
      type: "array",
      admin: { description: "The icon shown is looked up from the platform name, so it must be one of the options below." },
      fields: [
        {
          name: "label",
          type: "select",
          required: true,
          options: ["Facebook", "X", "YouTube", "Instagram", "LinkedIn"],
        },
        { name: "href", type: "text", required: true },
      ],
    },
    linkGroup("quickLinks", "Quick Links column."),
    linkGroup("citizenServices", "Citizen Services column."),
    linkGroup("helpSupport", "Help & Support column."),
  ],
};
