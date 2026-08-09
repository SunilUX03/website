// One-off script: migrates the 9 photos + 6 videos that used to live in
// lib/media-content.ts into the new Payload `media-items` collection.
// Safe to re-run — upserts by caption rather than inserting duplicates.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-media-items.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

type Seed = {
  type: "photo" | "video";
  src: string;
  alt: string;
  caption: string;
  date: string; // ISO
};

// Same picsum.photos placeholders the prototype used, downloaded once and
// stored in Payload's own media library rather than left hotlinked.
const SEEDS: Seed[] = [
  { type: "photo", src: "https://picsum.photos/400/280?random=1", alt: "TNeGA Workshop on GIS for Smart Governance", caption: "TNeGA Workshop on GIS for Smart Governance", date: "2025-05-01" },
  { type: "photo", src: "https://picsum.photos/400/280?random=2", alt: "e-Sevai Platinum Jubilee: 4 Crore Transactions", caption: "e-Sevai Platinum Jubilee: 4 Crore Transactions Milestone", date: "2025-04-01" },
  { type: "photo", src: "https://picsum.photos/400/280?random=3", alt: "Namma Arasu WhatsApp Service Launch", caption: "Namma Arasu WhatsApp Service Launch: January 2026", date: "2026-01-01" },
  { type: "photo", src: "https://picsum.photos/400/280?random=4", alt: "KMUT: 1 Crore Beneficiaries Celebration", caption: "KMUT: 1.14 Crore Beneficiaries Celebration Event", date: "2025-03-01" },
  { type: "photo", src: "https://picsum.photos/400/280?random=5", alt: "TNeGA AI Centre of Excellence Launch", caption: "TNeGA AI Centre of Excellence: Inauguration Ceremony", date: "2026-02-01" },
  { type: "photo", src: "https://picsum.photos/400/280?random=6", alt: "e-Office Secretariat 100% Rollout", caption: "e-Office 100% Rollout Across Tamil Nadu Secretariat", date: "2024-12-01" },
  { type: "photo", src: "https://picsum.photos/400/280?random=7", alt: "TNSSP: 29 Lakh Scholarship Beneficiaries", caption: "TNSSP: 29 Lakh Scholarship Beneficiaries Benefited", date: "2024-11-01" },
  { type: "photo", src: "https://picsum.photos/400/280?random=8", alt: "Data Purity Drive: ₹1,350 Cr Savings", caption: "Data Purity Drive: ₹1,350 Cr Annual Savings Achieved", date: "2024-09-01" },
  { type: "photo", src: "https://picsum.photos/400/280?random=9", alt: "TNGIS Tamil Nilam: Public Portal Launch", caption: "TNGIS Tamil Nilam: Public Geospatial Portal Launch", date: "2024-08-01" },
  { type: "video", src: "https://picsum.photos/400/280?random=10", alt: "SimpleGov Launch: Chief Minister's Address", caption: "SimpleGov Launch: Chief Minister's Address", date: "2025-05-01" },
  { type: "video", src: "https://picsum.photos/400/280?random=11", alt: "Namma Arasu: How It Works", caption: "Namma Arasu: How to Access Government Services on WhatsApp", date: "2026-02-01" },
  { type: "video", src: "https://picsum.photos/400/280?random=12", alt: "TNeGA at Digital India Summit 2025", caption: "TNeGA at Digital India Summit 2025: Panel Discussion", date: "2025-10-01" },
  { type: "video", src: "https://picsum.photos/400/280?random=13", alt: "e-Parvai AI Eye Screening Demo", caption: "e-Parvai: AI-Powered Cataract Detection in Action", date: "2025-07-01" },
  { type: "video", src: "https://picsum.photos/400/280?random=14", alt: "KMUT DBT: Beneficiary Stories", caption: "KMUT: Beneficiary Stories from Across Tamil Nadu", date: "2025-04-01" },
  { type: "video", src: "https://picsum.photos/400/280?random=15", alt: "TNeGA Annual Review 2024–25", caption: "TNeGA Annual Review 2024–25: Key Achievements", date: "2025-03-01" },
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
      collection: "media-items",
      where: { caption: { equals: seed.caption } },
      limit: 1,
      overrideAccess: true,
    });

    const imageId = await uploadImage(payload, seed.src, seed.alt, `media-item-${index + 1}.jpg`);

    const data = {
      type: seed.type,
      caption: seed.caption,
      altText: seed.alt,
      date: seed.date,
      image: imageId,
      _status: "published" as const,
    };

    if (existing.docs[0]) {
      await payload.update({ collection: "media-items", id: existing.docs[0].id, data, overrideAccess: true });
      console.log(`Updated: ${seed.caption}`);
    } else {
      await payload.create({ collection: "media-items", data, overrideAccess: true });
      console.log(`Created: ${seed.caption}`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
