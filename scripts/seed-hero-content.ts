// One-off script: seeds the "hero-content" global with the values that
// used to be lib/content.ts's `hero` export (the Hero.tsx-only fields).
// Always an update (globals always exist), safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-hero-content.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "hero-content",
    data: {
      agencyLabelCycle: [
        { text: "Tamil Nadu e-Governance Agency" },
        { text: "தமிழ்நாடு மின்-ஆளுமை முகமை" },
      ],
      headlineTemplate: "Powering Digital {word} in Tamil Nadu",
      headlineCycleWords: [{ word: "Governance" }, { word: "Services" }, { word: "Infrastructure" }],
      tagline: "Building secure, citizen-first Digital Public Infrastructure across Tamil Nadu.",
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("hero-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
