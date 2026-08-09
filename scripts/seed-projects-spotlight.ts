// One-off script: migrates the 6 projects that used to be `projects` in
// lib/content.ts into the new "projects-spotlight" Payload collection.
// Safe to re-run — upserts by name.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-projects-spotlight.ts
//
import { readFile } from "fs/promises";
import path from "path";
import { getPayload } from "payload";
import config from "../src/payload.config";

const SEEDS = [
  {
    name: "e-Sevai",
    description:
      "A unified digital service delivery platform enabling citizens to access essential Tamil Nadu Government services online and through 34,843 assisted centres across the state.",
    stats: [
      { value: 410, suffix: "", label: "Services" },
      { value: 34843, suffix: "", label: "CSCs" },
      { value: 4, suffix: " Crore+", label: "Transactions" },
    ],
    ctas: [
      { label: "Login to Portal", href: "https://tnesevai.tn.gov.in" },
      { label: "Know more", href: "/projects/e-sevai" },
    ],
    imagePath: "public/images/projects/e-sevai.png",
  },
  {
    name: "Namma Arasu",
    description:
      "Get government services directly on WhatsApp. Message 7845252525 to access 51 services across 16 departments, in Tamil or English, anytime, anywhere.",
    stats: [
      { value: 51, suffix: "", label: "Services" },
      { value: 16, suffix: "", label: "Departments" },
    ],
    ctas: [
      { label: "Message Now", href: "https://wa.me/917845252525" },
      { label: "Know more", href: "/projects/namma-arasu" },
    ],
    imagePath: "public/images/projects/namma-arasu/hero.png",
  },
  {
    name: "TN GIS",
    description:
      "Click anywhere on the map to get land parcel details, ownership records, guideline values, nearest hospitals, schools and ration shops, all in one place.",
    stats: [{ value: 400, suffix: "+", label: "Spatial Layers" }],
    ctas: [
      { label: "Access Portal", href: "https://tngis.tn.gov.in" },
      { label: "Know more", href: "/projects/tn-gis" },
    ],
    imagePath: "public/images/projects/tn-gis.png",
  },
  {
    name: "UMIS",
    description:
      "A single platform for all higher education institutions in Tamil Nadu, maintaining student information, courses and university data integrated with scholarship portals.",
    stats: [
      { value: 29, suffix: " Lakh", label: "Students" },
      { value: 81, suffix: "", label: "Universities" },
      { value: 5490, suffix: "", label: "Institutions" },
    ],
    ctas: [
      { label: "Login to Portal", href: "/projects/umis" },
      { label: "Know more", href: "/projects/umis" },
    ],
    imagePath: "public/images/projects/umis.png",
  },
  {
    name: "TNSSO",
    description:
      "Log in once to access all Tamil Nadu government services. A single verified credential gives citizens secure access to multiple G2C applications.",
    stats: [{ value: 9, suffix: "", label: "Applications Integrated" }],
    ctas: [{ label: "Know more", href: "/projects/tnsso" }],
    imagePath: "public/images/projects/tnsso.png",
    badge: "MeitY Approved",
  },
  {
    name: "e-Office",
    description:
      "A digital workflow and file management platform enabling government departments to process files, approvals and communications electronically.",
    stats: [
      { value: 128243, suffix: "", label: "Daily Users" },
      { value: 80, suffix: "%", label: "State Penetration" },
    ],
    ctas: [
      { label: "Login to Portal", href: "/projects/e-office" },
      { label: "Know more", href: "/projects/e-office" },
    ],
    imagePath: "public/images/projects/e-office.png",
  },
];

async function uploadLocalImage(payload: Awaited<ReturnType<typeof getPayload>>, relPath: string, alt: string, filename: string) {
  const absPath = path.resolve(process.cwd(), relPath);
  const data = await readFile(absPath);
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data,
      mimetype: "image/png",
      name: filename,
      size: data.byteLength,
    },
  });
  return doc.id;
}

async function main() {
  const payload = await getPayload({ config });

  for (const [index, seed] of SEEDS.entries()) {
    const existing = await payload.find({
      collection: "projects-spotlight",
      where: { name: { equals: seed.name } },
      limit: 1,
      overrideAccess: true,
    });

    const imageId = await uploadLocalImage(payload, seed.imagePath, seed.name, `project-spotlight-${index + 1}.png`);

    const data = {
      name: seed.name,
      description: seed.description,
      image: imageId,
      badge: seed.badge,
      stats: seed.stats,
      ctas: seed.ctas,
      order: index,
      _status: "published" as const,
    };

    if (existing.docs[0]) {
      await payload.update({ collection: "projects-spotlight", id: existing.docs[0].id, data, overrideAccess: true });
      console.log(`Updated: ${seed.name}`);
    } else {
      await payload.create({ collection: "projects-spotlight", data, overrideAccess: true });
      console.log(`Created: ${seed.name}`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
