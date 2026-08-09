// One-off script: migrates the CEO + 5 team members that used to be
// teamCeo/team in lib/about-content.ts into the "team-members" Payload
// collection. Safe to re-run — upserts by name.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-team-members.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

// Same curated Pexels IDs the old static data used (lib/stock-photos.ts'
// STOCK.presentation/developer/programmer/itTechnician/officeBuilding/
// engineerAudit) — real, content-appropriate stand-ins per the site's
// placeholder photo policy, not fabricated headshots.
const SEEDS = [
  { name: "Dr. K.P. Karthikeyan, IAS", designation: "Director / CEO", subject: undefined, order: 0, photoId: 3321791 },
  { name: "Tmt. Priya", designation: "General Manager", subject: "Procurement/ DRO", order: 1, photoId: 36706460 },
  { name: "Thiru. Rajarajan", designation: "General Manager", subject: "Procurement/ DRO", order: 2, photoId: 12899156 },
  { name: "Tmt. Preethi Parkavi", designation: "General Manager", subject: "e-Sevai/ DRO", order: 3, photoId: 37605911 },
  { name: "Vacant", designation: "General Manager", subject: "Technical", order: 4, photoId: 17391303 },
  { name: "Thiru. Jayachandran", designation: "General Manager/ Program Director", subject: "GIS", order: 5, photoId: 19226354 },
];

function pexelsPhoto(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=320`;
}

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
      collection: "team-members",
      where: { name: { equals: seed.name } },
      limit: 1,
      overrideAccess: true,
    });

    const photoId = await uploadImage(payload, pexelsPhoto(seed.photoId), seed.name, `team-member-${index + 1}.jpg`);

    const data = {
      name: seed.name,
      designation: seed.designation,
      subject: seed.subject,
      order: seed.order,
      photo: photoId,
      _status: "published" as const,
    };

    if (existing.docs[0]) {
      await payload.update({ collection: "team-members", id: existing.docs[0].id, data, overrideAccess: true });
      console.log(`Updated: ${seed.name}`);
    } else {
      await payload.create({ collection: "team-members", data, overrideAccess: true });
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
