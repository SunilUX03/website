// One-off script: seeds the "careers-content" Payload global with the
// values that used to be `hero`/`openingsNote`/`applicationSteps` in
// lib/careers-content.ts. Always an update (globals always exist), safe
// to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-careers-content.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "careers-content",
    data: {
      hero: {
        eyebrow: "Join Us",
        heading: "Build Tamil Nadu's Digital Future",
        body: "At TNeGA, your work doesn't just run on servers, it runs on the lives of millions of Tamil Nadu citizens. Join a team that builds real technology for real governance challenges at a scale very few organisations in the country can match.",
        ctaLabel: "View Openings",
      },
      openingsNote: "All positions are contractual. TNeGA is an equal opportunity employer.",
      applicationSteps: [
        {
          title: "Fill the Application Form",
          description: "Complete the online application form below with your personal details, role preference and resume.",
        },
        {
          title: "HR Screening",
          description: "Our HR team reviews your application and screens candidates based on the role requirements and qualifications.",
        },
        {
          title: "Interview",
          description: "Shortlisted candidates will be contacted and their interview will be scheduled at a convenient time.",
        },
        {
          title: "Offer Letter",
          description: "Finalised candidates receive their official offer letter completing the selection process.",
        },
      ],
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("careers-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
