// One-off script: seeds the "about-page-content" Payload global with the
// values that used to be aboutHero/whoWeAre/hierarchy/visionMission/
// connectWithUs in lib/about-content.ts. Always an update (globals always
// exist), safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-about-page-content.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "about-page-content",
    data: {
      hero: {
        eyebrow: "Who We Are",
        headline: "Transforming Governance Through Technology",
        description:
          "The Tamil Nadu e-Governance Agency (TNeGA) is the Government of Tamil Nadu's principal technology implementation agency, driving the State's digital transformation by building robust Digital Public Infrastructure (DPI) and delivering innovative e-Governance solutions. Working at the intersection of policy and technology, TNeGA enables Government departments to provide secure, transparent, efficient, and citizen-centric digital services.",
      },
      whoWeAre: {
        heading: "Who We Are",
        paragraph:
          "Established as the State Nodal Agency for e-Governance, TNeGA partners with Government departments to design, develop, and implement digital platforms that improve public service delivery and modernize governance. The Agency provides technology consulting, in-house software development, project management, and shared digital services that power a wide range of Government initiatives across Tamil Nadu.",
      },
      hierarchy: [
        { label: "IT & Digital Services Department", emphasized: false },
        { label: "Directorate of e-Governance", emphasized: false },
        { label: "Tamil Nadu e-Governance Agency", emphasized: true },
      ],
      visionMission: [
        {
          label: "Vision",
          title: "Good Governance Through Technology.",
          description:
            "To enable inclusive, accessible, secure, and future-ready digital governance by leveraging technology to improve public service delivery and create greater value for citizens, businesses, and Government departments across Tamil Nadu.",
        },
        {
          label: "Mission",
          title: "Improving Quality of Life.",
          description:
            "To accelerate Tamil Nadu's digital transformation by developing secure, scalable, and citizen-centric digital solutions that empower Government departments, strengthen public service delivery, and build an inclusive Digital Public Infrastructure for all.",
        },
      ],
      connectWithUs: {
        email: "tnega@tn.gov.in",
        social: [
          { label: "Facebook", href: "https://www.facebook.com/TNeGovernance" },
          { label: "X", href: "https://x.com/tnega" },
          { label: "YouTube", href: "https://www.youtube.com/@tnega" },
          { label: "LinkedIn", href: "https://www.linkedin.com/company/tnega" },
          { label: "Instagram", href: "https://www.instagram.com/tnega" },
        ],
      },
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("about-page-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
