// One-off script: seeds the "board-content" Payload global with the
// values that used to be `governingBoard` in lib/about-content.ts.
// Always an update (globals always exist), safe to re-run.
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
        name: "Thiru Pradeep Yadav, IAS",
        title: "Additional Chief Secretary to Government, Information Technology and Digital Services Department",
      },
      memberSecretary: {
        role: "Member Secretary",
        name: "Dr. K.P. Karthikeyan, IAS",
        title: "Chief Executive Officer, Tamil Nadu e-Governance Agency",
      },
      members: [
        { name: "Tmt. Latha Krishnan, IAS", title: "Secretary (Expenditure) to Government, Finance Department", isPlaceholder: true },
        { name: "Thiru. R. Selvaraj, IAS", title: "Managing Director, Electronics Corporation of Tamil Nadu Ltd.", isPlaceholder: true },
        { name: "Thiru. M. Balamurugan, IAS", title: "Registrar of Cooperative Societies", isPlaceholder: true },
        { name: "Tmt. Kavitha Ramesh, IAS", title: "Managing Director, Tamil Nadu Corporation for Development of Women", isPlaceholder: true },
        { name: "Thiru. A. Gunasekaran, IAS", title: "Managing Director, Tamil Nadu Arasu Cable TV Corporation Ltd.", isPlaceholder: true },
        { name: "Dr. N. Vijayakumar", title: "State Informatics Officer, National Informatics Centre, Chennai", isPlaceholder: true },
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
