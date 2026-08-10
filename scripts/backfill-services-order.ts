// One-off script: backfills the new "order" field on the "services"
// collection now that it exists — assigns sequential order values by
// ascending id, which matches the collection's original seed order (the
// same order the static services-content.ts list used before migration).
// Safe to re-run (idempotent: always sets order = ascending id rank).
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/backfill-services-order.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "services", sort: "id", limit: 200, overrideAccess: true });

  for (const [index, doc] of docs.entries()) {
    if (doc.order === index) continue;
    const isDraft = doc._status === "draft";
    await payload.update({
      collection: "services",
      id: doc.id,
      data: { order: index },
      ...(isDraft ? { draft: true as const } : {}),
      overrideAccess: true,
    });
    console.log(`Set order ${index} for "${doc.name}"`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
