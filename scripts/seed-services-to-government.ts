// One-off script: migrates the previously-hardcoded Services to Government
// page content (hero copy, 4 service blocks, department-contact table
// intro copy, and all 39 department rows) out of
// ServicesToGovernmentContent.tsx and into the new
// "services-to-government-content" global + "department-contacts"
// collection. Safe to re-run — the global is a single doc (upsert), and
// department rows upsert by `order` (department names repeat contact
// groups but order is unique), same pattern as seed-roll-of-honour.ts.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-services-to-government.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

const CONTENT = {
  hero: {
    eyebrow: "For Government Departments",
    heading: "Services to Government",
    body: "TNeGA provides shared technology services for Government Departments: software development, security audits, citizen communication gateways, and Aadhaar-based authentication, each backed by a dedicated department contact.",
  },
  services: [
    {
      name: "Software Development / Procurement",
      description:
        "Software development and IT hardware/software procurement support for Government Departments.",
    },
    {
      name: "IT Security Audit",
      description:
        "Mandatory IT security audits for Government websites, apps, APIs and cloud applications through CERT-In empanelled agencies.",
    },
    {
      name: "SMS / WhatsApp Gateway",
      description:
        "Centralized SMS and WhatsApp Gateway services enabling Government Departments to communicate with citizens efficiently and at scale.",
    },
    {
      name: "Aadhaar Services",
      description:
        "Aadhaar-based authentication and e-KYC services for Government Departments, delivered as the State's designated Authentication User Agency (AUA) and KYC User Agency (KUA).",
    },
  ],
  tableIntro: {
    eyebrow: "Contact for departments",
    heading: "Whom to reach out",
    body: "Each Government Department is assigned a Project Manager (PM) at TNeGA. Contact them directly, or raise a ticket here.",
  },
  raiseTicketLabel: "Raise a Ticket",
  raiseTicketHref: "#",
};

// Department groupings and phone numbers sourced from ELCOT's own contact
// listing (elcotangadi.tn.gov.in/it-hardware-procurement.html), where each
// group is assigned a shared "Client Relationship Manager" (CRM I-VI)
// rather than an individually named contact per department. Relabeled as
// "Project Manager" (PM I-VI) with a tnega.in email per group instead of
// ELCOT's own domain. Sorted alphabetically by department.
const DEPARTMENT_CONTACTS = [
  { department: "Adi Dravidar and Tribal Welfare Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Agriculture & Farmers Welfare Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Animal Husbandry, Dairying, Fisheries and Fishermen Welfare Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "BC, MBC & Minorities Welfare Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Commercial Taxes and Registration Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Co-operation, Food and Consumer Protection Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Energy Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Environment, Climate Change and Forests Department", contact: "PM II", email: "pm2@tnega.in", phone: "78248 59002" },
  { department: "Finance Department", contact: "PM II", email: "pm2@tnega.in", phone: "78248 59002" },
  { department: "Handlooms, Handicrafts, Textiles and Khadi Department", contact: "PM II", email: "pm2@tnega.in", phone: "78248 59002" },
  { department: "Health and Family Welfare Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Higher Education Department", contact: "PM II", email: "pm2@tnega.in", phone: "78248 59002" },
  { department: "Highways and Minor Ports Department", contact: "PM II", email: "pm2@tnega.in", phone: "78248 59002" },
  { department: "Home, Prohibition and Excise Department – High Court", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Home, Prohibition and Excise Department – Police", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Housing and Urban Development Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Human Resources Management Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Industries, Investment Promotion & Commerce Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Information Technology and Digital Services Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Labour Welfare and Skill Development Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Law Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Legislative Assembly Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Micro, Small and Medium Enterprises Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Mudhalvarin Mugavari Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Municipal Administration and Water Supply Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Natural Resources Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Planning, Development and Special Initiatives Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Public Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Public (Elections) Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Public Works Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Revenue and Disaster Management Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Rural Development and Panchayat Raj Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "School Education Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Social Reforms Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Social Welfare and Women Empowerment Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Special Programme Implementation", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Tamil Development and Information Department", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Tourism, Culture and Religious Endowments Department", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Transport Department", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Water Resources Department", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Welfare of Differently Abled Persons", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Youth Welfare and Sports Development Department", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
];

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "services-to-government-content",
    data: { ...CONTENT, _status: "published" },
    overrideAccess: true,
  });
  console.log("Updated services-to-government-content global.");

  for (const [index, seed] of DEPARTMENT_CONTACTS.entries()) {
    const order = index;
    const existing = await payload.find({
      collection: "department-contacts",
      where: { order: { equals: order } },
      limit: 1,
      overrideAccess: true,
    });

    const data = { ...seed, order, _status: "published" as const };

    if (existing.docs[0]) {
      await payload.update({ collection: "department-contacts", id: existing.docs[0].id, data, overrideAccess: true });
      console.log(`Updated (order ${order}): ${seed.department}`);
    } else {
      await payload.create({ collection: "department-contacts", data, overrideAccess: true });
      console.log(`Created (order ${order}): ${seed.department}`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
