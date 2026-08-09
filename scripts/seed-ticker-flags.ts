// One-off script: flags the same 4 announcements that used to be the
// hardcoded homepage ticker as "show in ticker", in their original order
// — so the ticker isn't empty the moment this ships. Safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-ticker-flags.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

const TICKER_SLUGS = ["simplegov-launch", "namma-arasu-live", "cm-award", "e-sevai-helpline"];

async function main() {
  const payload = await getPayload({ config });

  for (const [order, slug] of TICKER_SLUGS.entries()) {
    const existing = await payload.find({
      collection: "announcements",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    const doc = existing.docs[0];
    if (!doc) {
      console.log(`Skipped (not found): ${slug}`);
      continue;
    }
    await payload.update({
      collection: "announcements",
      id: doc.id,
      data: { tickerFeatured: true, tickerOrder: order },
      overrideAccess: true,
    });
    console.log(`Flagged for ticker: ${slug} (order ${order})`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
