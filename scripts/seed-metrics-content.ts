// One-off script: seeds the "metrics-content" Payload global with the
// values that used to be `metrics` in lib/content.ts. Always an update
// (globals always exist), safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-metrics-content.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "metrics-content",
    data: {
      metrics: [
        { value: 273, prefix: "", suffix: "+", label: "e-Services Available Online" },
        { value: 25277, prefix: "", suffix: "", label: "e-Sevai Centres Statewide" },
        { value: 43318, prefix: "₹", suffix: " Cr", label: "Transferred via DBT Since 2023" },
        { value: 24.27, prefix: "", suffix: " Lakh", label: "Students on UMIS", decimals: 2 },
        { value: 48, prefix: "", suffix: " Crore", label: "Aadhaar Authentication Transactions" },
        { value: 2, prefix: "", suffix: "+ Crore", label: "Documents Secured on Blockchain" },
      ],
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("metrics-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
