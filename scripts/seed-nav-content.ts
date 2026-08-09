// One-off script: seeds the "nav-content" Payload global with the values
// that used to be the static `nav` export in lib/content.ts. Globals
// always exist (with empty defaults) once registered, so this is always
// an update, never a create — safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-nav-content.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "nav-content",
    data: {
      govLabel: "தமிழ்நாடு அரசு | Government of Tamil Nadu",
      about: [
        { label: "Overview", href: "/about" },
        { label: "Leadership", href: "/about#leadership" },
        { label: "Organisation structure", href: "/about#organisation-structure" },
        { label: "Careers", href: "/about/careers" },
      ],
      services: [
        { label: "Citizen Services", href: "/services#citizen-services" },
        { label: "e-Governance Projects", href: "/services#e-governance-projects" },
        { label: "Services", href: "/services#services" },
      ],
      notificationsUpdates: [
        { label: "Announcements", href: "/notifications/announcements" },
        { label: "Media & Press", href: "/notifications/media-press" },
      ],
      notificationsDocuments: [
        { label: "RTI", href: "/notifications/rti" },
        { label: "Tenders", href: "/notifications/tenders" },
        { label: "Government Orders", href: "/notifications/government-orders" },
        { label: "Policies & Guidelines", href: "/notifications/policies-guidelines" },
      ],
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("nav-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
