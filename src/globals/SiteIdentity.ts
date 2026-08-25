import type { GlobalConfig } from "payload";

// The state emblem, TNeGA mark, and bilingual organisation name shown in
// both the header (MainNav.tsx) and footer (FooterClient.tsx) — a single
// global rather than duplicating these fields into NavContent and
// FooterContent, so there's exactly one place to update the branding and
// it can never go out of sync between header and footer (the same
// staleness-of-truth problem this session's edit-locking work exists to
// prevent, just at the schema level instead of the save-timing level).
//
// `nameTamil`/`nameEnglish` are plain (non-localized) text: both lines
// render together always, regardless of the active site locale — this is
// a bilingual wordmark treatment, not a translated label.
export const SiteIdentity: GlobalConfig = {
  slug: "site-identity",
  admin: {
    description: "The government emblem, TNeGA mark, and organisation name shown in the header and footer on every page.",
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
      name: "emblemImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "Government of Tamil Nadu emblem." },
    },
    {
      name: "markImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "TNeGA circular mark." },
    },
    {
      name: "faviconImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "The browser tab icon. Kept separate from the TNeGA mark above — a favicon needs to stay readable at a very small size, which sometimes means a simplified crop rather than the exact same file. Falls back to the TNeGA mark if left empty.",
      },
    },
    {
      name: "nameTamil",
      type: "text",
      required: true,
      admin: { description: 'Tamil line of the organisation name, e.g. "தமிழ்நாடு மின்-ஆளுமை முகமை". Always shown alongside the English line, regardless of site language.' },
    },
    {
      name: "nameEnglish",
      type: "text",
      required: true,
      admin: { description: 'English line of the organisation name, e.g. "Tamil Nadu e-Governance Agency". Always shown alongside the Tamil line, regardless of site language.' },
    },
  ],
};
