// One-off script: seeds the 6 "projects-spotlight" entries, each linked
// to its matching "services" collection item by slug rather than
// duplicating name/description/image (see the schema comment on
// src/collections/ProjectsSpotlight.ts for why). Safe to re-run — upserts
// by linked service.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-projects-spotlight.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

const SEEDS = [
  {
    serviceSlug: "e-sevai-portal",
    stats: [
      { value: 410, suffix: "", label: "Services" },
      { value: 34843, suffix: "", label: "CSCs" },
      { value: 4, suffix: " Crore+", label: "Transactions" },
    ],
    ctas: [
      { label: "Login to Portal", href: "https://tnesevai.tn.gov.in" },
      { label: "Know more", href: "/projects/e-sevai" },
    ],
  },
  {
    serviceSlug: "namma-arasu",
    stats: [
      { value: 51, suffix: "", label: "Services" },
      { value: 16, suffix: "", label: "Departments" },
    ],
    ctas: [
      { label: "Message Now", href: "https://wa.me/917845252525" },
      { label: "Know more", href: "/projects/namma-arasu" },
    ],
  },
  {
    serviceSlug: "tngis-tamil-nilam",
    stats: [{ value: 400, suffix: "+", label: "Spatial Layers" }],
    ctas: [
      { label: "Access Portal", href: "https://tngis.tn.gov.in" },
      { label: "Know more", href: "/projects/tn-gis" },
    ],
  },
  {
    serviceSlug: "umis",
    stats: [
      { value: 29, suffix: " Lakh", label: "Students" },
      { value: 81, suffix: "", label: "Universities" },
      { value: 5490, suffix: "", label: "Institutions" },
    ],
    ctas: [
      { label: "Login to Portal", href: "/projects/umis" },
      { label: "Know more", href: "/projects/umis" },
    ],
  },
  {
    serviceSlug: "tnsso",
    stats: [{ value: 9, suffix: "", label: "Applications Integrated" }],
    ctas: [{ label: "Know more", href: "/projects/tnsso" }],
    badge: "MeitY Approved",
  },
  {
    serviceSlug: "e-office",
    stats: [
      { value: 128243, suffix: "", label: "Daily Users" },
      { value: 80, suffix: "%", label: "State Penetration" },
    ],
    ctas: [
      { label: "Login to Portal", href: "/projects/e-office" },
      { label: "Know more", href: "/projects/e-office" },
    ],
  },
];

async function main() {
  const payload = await getPayload({ config });

  for (const [index, seed] of SEEDS.entries()) {
    const { docs: services } = await payload.find({
      collection: "services",
      where: { slug: { equals: seed.serviceSlug } },
      limit: 1,
      overrideAccess: true,
    });
    const service = services[0];
    if (!service) {
      console.log(`No service found for slug "${seed.serviceSlug}", skipping.`);
      continue;
    }

    const existing = await payload.find({
      collection: "projects-spotlight",
      where: { service: { equals: service.id } },
      limit: 1,
      overrideAccess: true,
    });

    const data = {
      service: service.id,
      badge: seed.badge,
      stats: seed.stats,
      ctas: seed.ctas,
      order: index,
      _status: "published" as const,
    };

    if (existing.docs[0]) {
      await payload.update({ collection: "projects-spotlight", id: existing.docs[0].id, data, overrideAccess: true });
      console.log(`Updated: ${service.name}`);
    } else {
      await payload.create({ collection: "projects-spotlight", data, overrideAccess: true });
      console.log(`Created: ${service.name}`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
