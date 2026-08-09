// One-off script: migrates the 5 job openings that used to live in
// lib/careers-content.ts into the new Payload `job-openings` collection.
// Safe to re-run — upserts by role rather than inserting duplicates.
//
// None of these had a real JD PDF uploaded yet (see the old comment in
// careers-content.ts — placeholder entries pending real postings), so
// jdHref is left blank here too; the Download JD button just won't show
// until an editor fills it in.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-job-openings.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

const SEEDS = [
  { role: "Project Manager, e-Governance", type: "Contract", department: "IT Consultancy & Project Management", deadline: "2026-07-31" },
  { role: "Data Analyst", type: "Contract", department: "State Family Database (SFDB)", deadline: "2026-07-31" },
  { role: "GIS Specialist", type: "Contract", department: "TNGIS (Tamil Nadu GIS)", deadline: "2026-08-15" },
  { role: "AI / ML Engineer", type: "Contract", department: "AI Centre of Excellence", deadline: "2026-08-15" },
  { role: "Software Security Analyst", type: "Contract", department: "IT Security Audit", deadline: "2026-08-20" },
];

async function main() {
  const payload = await getPayload({ config });

  for (const seed of SEEDS) {
    const existing = await payload.find({
      collection: "job-openings",
      where: { role: { equals: seed.role } },
      limit: 1,
      overrideAccess: true,
    });

    const data = { ...seed, _status: "published" as const };

    if (existing.docs[0]) {
      await payload.update({ collection: "job-openings", id: existing.docs[0].id, data, overrideAccess: true });
      console.log(`Updated: ${seed.role}`);
    } else {
      await payload.create({ collection: "job-openings", data, overrideAccess: true });
      console.log(`Created: ${seed.role}`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
