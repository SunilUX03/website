// One-off script: migrates the 8 award cards that used to be `awards` in
// lib/about-content.ts into the new "awards" Payload collection. Safe to
// re-run — upserts by (title, year) since some titles repeat across years.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-awards.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

function pexelsPhoto(id: number, width = 700, height = 500) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`;
}

const SEEDS = [
  {
    title: "Chief Minister's Best Practices Award",
    year: "2023",
    description:
      "Awarded to TNeGA for the mobile app and real-time dashboard built to monitor the Chief Minister's Breakfast Scheme, tracking implementation in every school from meal preparation through to serving, with GPS-tracked food delivery.",
    photoId: 3321791,
  },
  {
    title: "SKOCH Silver Award",
    year: "2025",
    description:
      "Awarded to the University Management Information System (UMIS), TNeGA's single-window platform integrating student, institution and course data across higher education in Tamil Nadu.",
    photoId: 37730212,
  },
  {
    title: "Educational Technology Transformation Award",
    year: "2025",
    description:
      "Presented at the 19th Digital Transformation Conclave & Awards, recognising UMIS's integration with Aadhaar, EMIS, NPCI, e-Sevai and scholarship platforms to power accurate, duplicate-free student data statewide.",
    photoId: 37605911,
  },
  {
    title: "SKOCH Gold Award",
    year: "2022",
    description:
      "Awarded for the Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme (Pudhumai Penn), TNeGA's paperless DBT scholarship platform supporting higher education for girl students from Government schools.",
    photoId: 4622108,
  },
  {
    title: "SKOCH Gold Award",
    year: "2025",
    description:
      "Awarded for the Tamil Pudhalvan Scheme, TNeGA's paperless DBT scholarship platform supporting higher education for boy students from Government schools, integrated with UMIS.",
    photoId: 33714873,
  },
  {
    title: "Technology Sabha Excellence Award",
    year: "2025",
    description:
      "Awarded by The Indian Express Group in recognition of e-Sevai's citizen-centric service delivery through centres statewide and a 24x7 citizen portal.",
    photoId: 8069428,
  },
  {
    title: "SKOCH Silver Award",
    year: "2022",
    description:
      "Awarded for e-Munnetram, TNeGA's WebGIS-based platform tracking the finances and progress of every major infrastructure project valued over ₹100 crore.",
    photoId: 17323801,
  },
  {
    title: "Certificate of Excellence",
    year: "2025",
    description:
      "Awarded by the Unique Identification Authority of India (UIDAI), recognising Tamil Nadu as the best-performing state for pioneering Aadhaar authentication in public service delivery.",
    photoId: 33175650,
  },
];

async function uploadImage(payload: Awaited<ReturnType<typeof getPayload>>, url: string, alt: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data: Buffer.from(arrayBuffer),
      mimetype: "image/jpeg",
      name: filename,
      size: arrayBuffer.byteLength,
    },
  });
  return doc.id;
}

async function main() {
  const payload = await getPayload({ config });

  for (const [index, seed] of SEEDS.entries()) {
    const existing = await payload.find({
      collection: "awards",
      where: { and: [{ title: { equals: seed.title } }, { year: { equals: seed.year } }] },
      limit: 1,
      overrideAccess: true,
    });

    const imageId = await uploadImage(payload, pexelsPhoto(seed.photoId), seed.title, `award-${index + 1}.jpg`);

    const data = {
      title: seed.title,
      year: seed.year,
      description: seed.description,
      image: imageId,
      _status: "published" as const,
    };

    if (existing.docs[0]) {
      await payload.update({ collection: "awards", id: existing.docs[0].id, data, overrideAccess: true });
      console.log(`Updated: ${seed.title} (${seed.year})`);
    } else {
      await payload.create({ collection: "awards", data, overrideAccess: true });
      console.log(`Created: ${seed.title} (${seed.year})`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
