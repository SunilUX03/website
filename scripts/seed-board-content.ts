// One-off script: seeds the "board-content" Payload global. Per explicit
// instruction, seats hold designations only (no real appointee names) —
// `title` is optional in the schema for exactly this case. Always an
// update (globals always exist), safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-board-content.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "board-content",
    data: {
      chairman: {
        role: "Chairman",
        name: "The Secretary to Government, Information Technology and Digital Services Department",
        title: "",
      },
      memberSecretary: {
        role: "Member Secretary",
        name: "The Chief Executive Officer, Tamil Nadu e-Governance Agency",
        title: "",
      },
      members: [
        { name: "The State Informatics Officer, National Informatics Centre (NIC)", title: "", isPlaceholder: false },
        { name: "The Secretary to Government, Finance (Expenditure) Department", title: "", isPlaceholder: false },
        { name: "The Managing Director, ELCOT", title: "", isPlaceholder: false },
        { name: "The Managing Director, TACTV", title: "", isPlaceholder: false },
        { name: "The Registrar of Co-operative Societies", title: "", isPlaceholder: false },
        { name: "The Managing Director, Tamil Nadu Corporation for Development of Women", title: "", isPlaceholder: false },
      ],
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("board-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
