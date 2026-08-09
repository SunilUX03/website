// One-off script: seeds the "leadership-band-content" global with the
// values that used to be lib/content.ts's `hero.description`/`hero.leaders`
// (the AboutLeadership.tsx-only fields). Uploads the two leaders' real
// local photos (public/images/leaders/*) into Payload Media rather than
// a stock substitute — these are real photos, not placeholders. Always
// an update (globals always exist), safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-leadership-band.ts
//
import { readFile } from "fs/promises";
import path from "path";
import { getPayload } from "payload";
import config from "../src/payload.config";

async function uploadLocalImage(payload: Awaited<ReturnType<typeof getPayload>>, relPath: string, alt: string) {
  const absPath = path.resolve(process.cwd(), "public", relPath);
  const data = await readFile(absPath);
  const filename = path.basename(relPath);
  const mimetype = filename.endsWith(".png") ? "image/png" : "image/jpeg";
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    file: { data, mimetype, name: filename, size: data.byteLength },
  });
  return doc.id;
}

async function main() {
  const payload = await getPayload({ config });

  const cmPhotoId = await uploadLocalImage(payload, "images/leaders/cm-photo.jpg", "Thiru C. Joseph Vijay, Hon'ble Chief Minister of Tamil Nadu");
  const ministerPhotoId = await uploadLocalImage(payload, "images/leaders/it-minister-photo.jpg", "Dr. R. Kumar, Hon'ble Minister of IT&DS");

  await payload.updateGlobal({
    slug: "leadership-band-content",
    data: {
      description:
        "Tamil Nadu e-Governance Agency (TNeGA) is the Government of Tamil Nadu's nodal agency for digital governance, driving the State's vision of technology-enabled, citizen-centric public service delivery. TNeGA designs, develops, and implements Digital Public Infrastructure (DPI) that empowers Government departments to deliver services that are seamless, secure, transparent, and accessible.",
      leaders: [
        {
          name: "Thiru C. Joseph Vijay",
          title: "Hon'ble Chief Minister of Tamil Nadu",
          photo: cmPhotoId,
          photoPosition: "50% 50%",
        },
        {
          name: "Dr. R. Kumar",
          title: "Hon'ble Minister of IT&DS",
          photo: ministerPhotoId,
          photoPosition: "50% 20%",
        },
      ],
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("leadership-band-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
