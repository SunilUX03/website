// One-off script: migrates the previously-hardcoded Services to Government
// page content (hero copy, service blocks, department-contact table
// intro copy) out of ServicesToGovernmentContent.tsx and into the
// "services-to-government-content" global. Safe to re-run — the global is
// a single doc (upsert).
//
// The department-contact rows this script used to seed into a separate
// "department-contacts" collection have since been folded into this same
// global's own `departmentContacts` array field (drag-reorderable in the
// CMS, no more separate collection/page) — that collection is no longer
// registered in payload.config.ts. Its tables/rows are left in the
// database untouched as a backup; this script no longer touches it.
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

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "services-to-government-content",
    data: { ...CONTENT, _status: "published" },
    overrideAccess: true,
  });
  console.log("Updated services-to-government-content global.");

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
