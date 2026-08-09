// One-off script: seeds the "org-chart-content" Payload global with the
// values that used to be `orgChart` in lib/about-content.ts. Always an
// update (globals always exist), safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-org-chart-content.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  const branch = {
    director: "Joint Director / DRO",
    engineer: "System Engineer / Deputy Collector",
    manager: "Project Manager",
    base: "ASE",
  };

  await payload.updateGlobal({
    slug: "org-chart-content",
    data: {
      topPrimary: "CEO",
      topSecondary: "JCEO",
      branches: [
        branch,
        branch,
        branch,
        branch,
        branch,
        { director: "Project Director", engineer: null, manager: "Project Manager", base: "ASE / Developers" },
      ],
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("org-chart-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
