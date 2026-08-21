import type { GlobalConfig } from "payload";

const pageHeroFields = [
  { name: "eyebrow" as const, type: "text" as const, required: true, localized: true },
  { name: "heading" as const, type: "text" as const, required: true, localized: true },
  { name: "body" as const, type: "textarea" as const, required: true, localized: true },
];

// A catch-all for small bits of page copy that were missed when their
// surrounding collection got migrated: each Notifications list page's own
// hero blurb (the item lists themselves are already the Announcements /
// Government Orders / Policies / Media Items collections, and /services'
// hero, plus the homepage's two "Reach Us" / "Current Openings" promo
// panels. Each page hero's decorative orb colours/positions stay in that
// page's own lib/*-content.ts file (presentational, not content).
export const SiteCopyContent: GlobalConfig = {
  slug: "site-copy-content",
  admin: {
    description: "Small page-hero copy for the Notifications/Services pages, and the homepage's Reach Us panels.",
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "announcementsHero", type: "group", fields: pageHeroFields },
    { name: "governmentOrdersHero", type: "group", fields: pageHeroFields },
    { name: "policiesHero", type: "group", fields: pageHeroFields },
    { name: "mediaHero", type: "group", fields: pageHeroFields },
    { name: "servicesHero", type: "group", fields: pageHeroFields },
    {
      name: "reachUsPanels",
      type: "array",
      minRows: 2,
      maxRows: 2,
      admin: { description: "The homepage's 2 promo panels: Reach Us and Current Openings." },
      fields: [
        { name: "eyebrow", type: "text", required: true, localized: true },
        { name: "title", type: "text", required: true, localized: true },
        { name: "description", type: "textarea", required: true, localized: true },
        { name: "ctaLabel", type: "text", required: true, localized: true },
      ],
    },
  ],
};
