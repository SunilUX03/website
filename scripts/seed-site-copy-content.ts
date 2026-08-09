// One-off script: seeds the "site-copy-content" Payload global with the
// values that used to be `hero` in announcements-content.ts,
// government-orders-content.ts, policies-guidelines-content.ts,
// media-content.ts, services-content.ts, and the two hardcoded panels in
// ReachUs.tsx. Always an update (globals always exist), safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-site-copy-content.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "site-copy-content",
    data: {
      announcementsHero: {
        eyebrow: "Updates",
        heading: "Announcements",
        body: "Launches, milestones and service updates from Tamil Nadu e-Governance Agency, the latest news on the platforms that deliver government services across the state.",
      },
      governmentOrdersHero: {
        eyebrow: "Official Orders",
        heading: "Government Orders",
        body: "Official Government Orders issued by the IT & Digital Services Department and Tamil Nadu e-Governance Agency.",
      },
      policiesHero: {
        eyebrow: "Standards",
        heading: "Policies & Guidelines",
        body: "Technology policies, data standards, cybersecurity guidelines and e-Governance frameworks for Tamil Nadu.",
      },
      mediaHero: {
        eyebrow: "Latest Updates",
        heading: "News, Events & Media from TNeGA",
        body: "Stay updated with the latest photos, videos and press coverage from Tamil Nadu e-Governance Agency.",
      },
      servicesHero: {
        eyebrow: "What We Build",
        heading: "Initiatives Powering Tamil Nadu's Digital Future",
        body: "From citizen-facing portals to department platforms and emerging technology, TNeGA builds, operates and scales digital governance across Tamil Nadu.",
      },
      reachUsPanels: [
        {
          eyebrow: "Support",
          title: "Reach Us",
          description: "Raise a ticket with our support team through the official TNeGA ticketing portal. Login required to track your request.",
          ctaLabel: "Raise a Ticket",
        },
        {
          eyebrow: "Careers",
          title: "Current Openings",
          description: "Join TNeGA and help build the digital infrastructure powering governance across Tamil Nadu.",
          ctaLabel: "View Openings",
        },
      ],
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("site-copy-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
