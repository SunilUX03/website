// One-off script: seeds the "pillars-content" Payload global with the
// chrome (title/description/linkLabel/bannerImage) that used to live in
// the `pillars` array in lib/content.ts. Always an update (globals always
// exist), safe to re-run — re-uploads the banner images each time, but
// that's cheap and idempotent enough for a one-off seed.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-pillars-content.ts
//
import { readFile } from "fs/promises";
import path from "path";
import { getPayload } from "payload";
import config from "../src/payload.config";

const SEEDS = [
  {
    title: "Citizen Services",
    description:
      "TNeGA delivers citizen-centric digital services through secure and accessible platforms, making Government services faster, simpler, and more convenient.",
    linkLabel: "View all Citizen Services",
    bannerImagePath: "public/images/pillars/citizen-services.png",
  },
  {
    title: "e-Governance Projects",
    description:
      "TNeGA collaborates with Government departments to design, develop, and implement digital solutions that improve governance and service delivery.",
    linkLabel: "View all e-Governance Projects",
    bannerImagePath: "public/images/pillars/e-governance-projects.png",
  },
  {
    title: "Services",
    description:
      "TNeGA provides shared digital services including digital identity, DBT, e-Sign, cybersecurity, and technology consulting to support e-Governance across Tamil Nadu.",
    linkLabel: "View all Services",
    bannerImagePath: "public/images/pillars/services.png",
  },
];

async function uploadLocalImage(payload: Awaited<ReturnType<typeof getPayload>>, relPath: string, alt: string) {
  const absPath = path.resolve(process.cwd(), relPath);
  const data = await readFile(absPath);
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data,
      mimetype: "image/png",
      name: path.basename(relPath),
      size: data.byteLength,
    },
  });
  return doc.id;
}

async function main() {
  const payload = await getPayload({ config });

  const pillars = [];
  for (const seed of SEEDS) {
    const bannerImage = await uploadLocalImage(payload, seed.bannerImagePath, seed.title);
    pillars.push({
      title: seed.title,
      description: seed.description,
      linkLabel: seed.linkLabel,
      bannerImage,
    });
  }

  await payload.updateGlobal({
    slug: "pillars-content",
    data: { pillars, _status: "published" },
    overrideAccess: true,
  });

  console.log("pillars-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
