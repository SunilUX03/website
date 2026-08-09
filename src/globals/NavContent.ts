import type { GlobalConfig } from "payload";

// Phase 2, first target: the header nav and top accessibility bar, shown
// on every page (see src/components/nav/TopNav.tsx). A global rather than
// a collection — there's exactly one nav, not a list of them — mirroring
// the fixed groups the site already has (About / Services / Notifications
// -> Updates + Documents) rather than a generic menu builder, since that's
// the actual shape MainNav.tsx and MobileDrawer.tsx render.
const linkGroup = (label: string) => ({
  name: label,
  type: "array" as const,
  fields: [
    { name: "label", type: "text" as const, required: true },
    { name: "href", type: "text" as const, required: true },
  ],
});

export const NavContent: GlobalConfig = {
  slug: "nav-content",
  admin: {
    description: "The header navigation and top accessibility bar, shown on every page.",
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
      name: "govLabel",
      type: "text",
      required: true,
      admin: {
        description: "Top bar link label to tn.gov.in, e.g. \"தமிழ்நாடு அரசு | Government of Tamil Nadu\".",
      },
    },
    linkGroup("about"),
    linkGroup("services"),
    linkGroup("notificationsUpdates"),
    linkGroup("notificationsDocuments"),
  ],
};
