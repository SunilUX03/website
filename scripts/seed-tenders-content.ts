// One-off script: seeds the "tenders-content" Payload global with the
// values that used to be `hero`/`tenderPortal` in lib/tenders-content.ts.
// Always an update (globals always exist), safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-tenders-content.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "tenders-content",
    data: {
      hero: {
        eyebrow: "Procurement",
        heading: "Tenders & Procurement Opportunities",
        body: "Active and upcoming tenders from Tamil Nadu e-Governance Agency are published on the Tamil Nadu Government e-Tendering portal.",
      },
      tenderPortal: {
        heading: "View Active Tenders",
        sub: "TNeGA's tenders are listed on the Government of Tamil Nadu's centralized e-Tendering portal.",
        body: "All active and upcoming tenders published by the Department of Information Technology, including Tamil Nadu e-Governance Agency, are listed on the official e-Tendering portal.",
        ctaLabel: "View Tenders",
        ctaHref:
          "https://tntenders.gov.in/nicgep/app?page=FrontEndLatestActiveTendersOrgwise&service=page&org=DepartmentofInformationTechnology",
        redirectNote: "You will be redirected to the Tamil Nadu e-Tendering portal at tntenders.gov.in",
      },
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("tenders-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
