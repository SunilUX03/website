// Safety-net script: dumps every collection's documents and every
// global's content to timestamped JSON files on disk, independent of
// any database-level recovery (Neon restore, migration rollback). Run
// this before any migration that touches existing schema/data.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/backup-all-cms-data.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";
import fs from "fs";
import path from "path";

const COLLECTIONS = [
  "cms-users",
  "media",
  "announcements",
  "media-items",
  "job-openings",
  "team-members",
  "services",
  "documents",
  "government-orders",
  "policies",
  "activity-log",
  "legal-pages",
  "awards",
  "roll-of-honour",
  "projects-spotlight",
  "social-posts",
  "department-contacts",
];

const GLOBALS = [
  "nav-content",
  "board-content",
  "hero-content",
  "leadership-band-content",
  "footer-content",
  "about-page-content",
  "org-chart-content",
  "metrics-content",
  "pillars-content",
  "careers-content",
  "rti-content",
  "tenders-content",
  "site-copy-content",
  "services-to-government-content",
];

async function main() {
  const payload = await getPayload({ config });
  const dir = process.argv[2] || `backups/${new Date().toISOString().slice(0, 10)}`;
  fs.mkdirSync(dir, { recursive: true });

  const manifest: Record<string, { type: string; count?: number; error?: string }> = {};

  for (const slug of COLLECTIONS) {
    try {
      const result = await payload.find({ collection: slug as any, limit: 5000, draft: true, overrideAccess: true, depth: 0 });
      fs.writeFileSync(path.join(dir, `collection-${slug}.json`), JSON.stringify(result.docs, null, 2));
      manifest[slug] = { type: "collection", count: result.docs.length };
      console.log(`Backed up collection "${slug}": ${result.docs.length} docs`);
    } catch (err: any) {
      manifest[slug] = { type: "collection", error: err.message };
      console.error(`FAILED collection "${slug}": ${err.message}`);
    }
  }

  for (const slug of GLOBALS) {
    try {
      const doc = await payload.findGlobal({ slug: slug as any, draft: true, overrideAccess: true, depth: 0 });
      fs.writeFileSync(path.join(dir, `global-${slug}.json`), JSON.stringify(doc, null, 2));
      manifest[slug] = { type: "global" };
      console.log(`Backed up global "${slug}"`);
    } catch (err: any) {
      manifest[slug] = { type: "global", error: err.message };
      console.error(`FAILED global "${slug}": ${err.message}`);
    }
  }

  fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nBackup complete: ${dir}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
