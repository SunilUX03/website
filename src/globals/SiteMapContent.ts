import type { GlobalConfig } from "payload";

// Backs the /sitemap page — previously a hardcoded list in the page
// component itself with no CMS editing at all. A single flat array
// rather than nested group/link arrays (Payload supports nested arrays,
// but RepeatableRows — the admin's shared array-editor component — only
// understands one flat level of rows): each row carries its own group
// heading, and the page groups rows by that heading at render time,
// preserving the order groups first appear in the list. Moving/adding a
// link is then "add a row with the right heading," and starting a new
// group is just "use a heading that doesn't exist yet."
export const SiteMapContent: GlobalConfig = {
  slug: "site-map-content",
  admin: {
    description: "The /sitemap page's link groups.",
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
      name: "links",
      type: "array",
      required: true,
      // Custom dbName: the default derived name for the versions-side
      // locales table ("_site_map_content_v_version_links_locales_locale_
      // parent_id_unique", the unique index) exceeds Postgres's 63-char
      // identifier limit, which Payload enforces at boot (throws, does
      // not truncate) — same issue and same fix as
      // services-to-government-content's departmentContacts array (see
      // that migration's comment for the full naming breakdown).
      dbName: "sitemap_links",
      admin: {
        description: 'Rows sharing the same "Group heading" are shown together under one card, in the order each group first appears.',
      },
      fields: [
        { name: "groupHeading", type: "text", required: true, localized: true },
        { name: "label", type: "text", required: true, localized: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
};
