// One-off script: migrates the 21 historical Director/CEO entries that
// used to be built by buildRollOfHonour() in lib/about-content.ts into the
// new "roll-of-honour" Payload collection. Safe to re-run — upserts by
// `order` since designation/name repeat across entries but order is unique.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-roll-of-honour.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

// The first entry used to be computed from the current CEO in the
// team-members collection (Dr. K.P. Karthikeyan, IAS); now a plain,
// independently-editable row like every other entry here.
const SEEDS = [
  { designation: "Director / CEO", name: "Dr. K.P. Karthikeyan, IAS", range: "July 2026 – Present" },
  { designation: "Director / CEO", name: "Dr. Alby John Varghese, I.A.S.", range: "25 Jun 2025 – 30 Jul 2026" },
  { designation: "Director / CEO", name: "Thiru. M. Govinda Rao, IAS", range: "30 Dec 2024 – 24 Jun 2025" },
  { designation: "Director / CEO", name: "Thiru. Praveen. P. Nair, I.A.S", range: "18 Jul 2022 – 29 Dec 2024" },
  { designation: "Commissioner/CEO (F.A.C)", name: "Thiru. S. Nagarajan, I.A.S", range: "09 Jun 2022 – 16 Jul 2022" },
  { designation: "Director/CEO", name: "Thiru. Vijayendra Pandian, I.A.S.", range: "01 Aug 2021 – 01 Jun 2022" },
  { designation: "Commissioner/CEO, i/c.", name: "Thiru. Ajay Yadav, I.A.S.", range: "01 Jul 2021 – 01 Aug 2021" },
  { designation: "Commissioner/CEO", name: "Mr. Santosh K Misra, I.A.S.", range: "02 Jan 2018 – 23 Jun 2021" },
  { designation: "Commissioner/CEO", name: "Mr. Anand Rao V. Patil, I.A.S.", range: "01 Jan 2017 – 01 Jan 2018" },
  { designation: "Director/CEO (F.A.C)", name: "Mr. J. Kumaragurubaran, IAS", range: "14 Jan 2016 – 14 Jan 2017" },
  { designation: "Director/CEO", name: "Mr. S. Nagarajan, IAS", range: "14 Jan 2015 – 15 Jan 2016" },
  { designation: "Director/CEO", name: "Mr. S Nagarajan, IAS", range: "14 Jan 2014 – 30 Jun 2014" },
  { designation: "Director/CEO (F.A.C)", name: "Mr. J. Kumaragurubaran, IAS", range: "13 Jan 2014 – 13 Jan 2015" },
  { designation: "Commissioner/CEO (F.A.C)", name: "Mr. Atul Anand, IAS", range: "14 Jan 2011 – 14 Jan 2014" },
  { designation: "Commissioner/CEO (F.A.C)", name: "Dr. Santhosh Babu, IAS", range: "15 Jan 2008 – 16 Jan 2011" },
  { designation: "Director/CEO", name: "Mr. T. Udhayachandran, IAS", range: "14 Jan 2008 – 30 Jun 2008" },
  { designation: "Commissioner/CEO i/c", name: "Dr. C. Chandramouli, IAS", range: "14 Jan 2008 – 30 Jun 2008" },
  { designation: "Commissioner/CEO", name: "Dr. Neeraj Mittal, IAS", range: "14 Jan 2008 – 30 Jun 2008" },
  { designation: "Director/CEO i/c.", name: "Mr. Kumar Jayant, IAS", range: "14 Jan 2007 – 14 Jan 2008" },
  {
    designation: "Officer on Special Duty i/c. and Director/CEO i/c.",
    name: "Mr. Sunil Paliwal, IAS",
    range: "14 Jan 2007 – 30 Jun 2007",
  },
  {
    designation: "Officer on Special Duty and Officer on Special Duty i/c.",
    name: "Mr. Atul Anand, IAS",
    range: "29 Dec 2006 – 04 Jun 2007",
  },
];

async function main() {
  const payload = await getPayload({ config });

  for (const [index, seed] of SEEDS.entries()) {
    const order = index;
    const existing = await payload.find({
      collection: "roll-of-honour",
      where: { order: { equals: order } },
      limit: 1,
      overrideAccess: true,
    });

    const data = {
      designation: seed.designation,
      name: seed.name,
      range: seed.range,
      order,
      _status: "published" as const,
    };

    if (existing.docs[0]) {
      await payload.update({ collection: "roll-of-honour", id: existing.docs[0].id, data, overrideAccess: true });
      console.log(`Updated (order ${order}): ${seed.name}`);
    } else {
      await payload.create({ collection: "roll-of-honour", data, overrideAccess: true });
      console.log(`Created (order ${order}): ${seed.name}`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
