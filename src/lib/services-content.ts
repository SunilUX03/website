// Centralized copy for the /services page — 3 sections (Citizen Services,
// e-Governance Projects, Services), matching the categorisation used
// by Home's "How TNeGA powers governance" bands (see `pillars` in
// lib/content.ts and getServiceItemsByNames below) — replacing the earlier
// 2-section (Citizen Services / Govt Digital Services) split per explicit
// instruction.
//
// Each item lists every section it belongs to (`sections`) rather than
// living in a single section's array — UMIS is intentionally dual-listed
// (Citizen Services + e-Governance Projects), same as on Home. A
// dual-listed item still has exactly ONE detail page: it just appears as a
// card in both of its sections' grids. Aadhaar Services isn't referenced by
// any of Home's bands, so it stays single-listed under Citizen Services,
// where it already lived.
//
// Each item's `real` field carries the official PDF's own Statistics / Key
// Features / "You can use this if..." / "What you'll need" / FAQs sections
// verbatim — consumed by service-detail-generator.ts, which prefers this
// real content over its mechanically-generated fallback wherever it's
// present. TNGIS and GRAINS have no PDF content supplied, so they keep
// their previously-written placeholder copy and fall back to generated
// detail content.
//
// Images: real project photography (e-Sevai, Namma Arasu, TN GIS, UMIS,
// TNSSO, e-Office) reuses the same 6 files as Home's Projects Spotlight.
// Every other item uses a curated, on-theme stock photo from the shared
// STOCK pool (see lib/stock-photos.ts) — never an icon, never a visible
// "pending" label.
//
// CTA hrefs: `accessPortalHref: "#"` marks an item as citizen self-service
// ("project" type, Access Portal CTA); its absence marks a department-
// facing shared service ("service" type, Avail Service CTA via /reach-us).
// Real portal URLs are not yet supplied, so `#` stays an honest placeholder.

import { pexelsPhoto, STOCK } from "./stock-photos";

export const hero = {
  eyebrow: "What We Build",
  heading: "Initiatives Powering Tamil Nadu's Digital Future",
  body: "From citizen-facing portals to department platforms and emerging technology — TNeGA builds, operates and scales digital governance across Tamil Nadu.",
  orbs: [
    { color: "sky", className: "-left-32 -top-20 h-[420px] w-[420px]" },
    { color: "lavender", className: "-right-24 bottom-0 h-[360px] w-[360px]" },
  ] as const,
};

/** Real per-project content transcribed verbatim from the official PDF —
 * consumed by service-detail-generator.ts in place of generated copy. */
export interface RealContent {
  statistics: string[];
  keyFeatures: string[];
  eligibility: string[];
  whatYoullNeed: string[];
  faqs: { q: string; a: string }[];
}

export type ServiceSection = "citizen-services" | "e-governance-projects" | "services";

export type ServiceItem = {
  name: string;
  description: string;
  stats: string;
  image: string;
  accessPortalHref?: string;
  knowMoreHref: string;
  real?: RealContent;
  /** Every /services tab this item is listed under — first entry is its
   * "home" section, used for the detail page's breadcrumb/back-link and
   * "Related" carousel. Most items list exactly one section; UMIS
   * intentionally lists two, matching Home's bands. */
  sections: ServiceSection[];
};

const PROJECT_IMG = {
  eSevai: "/images/projects/e-sevai.png",
  nammaArasu: "/images/projects/namma-arasu.png",
  tnGis: "/images/projects/tn-gis.png",
  umis: "/images/projects/umis.png",
  tnsso: "/images/projects/tnsso.png",
  eOffice: "/images/projects/e-office.png",
} as const;

const serviceItemsRaw: ServiceItem[] = [
  // ---------- Citizen Services ----------
  {
    name: "e-Sevai Portal",
    description:
      "The e-Sevai Portal is Tamil Nadu's primary digital platform for Government-to-Citizen (G2C) services, enabling citizens to access a wide range of Government services through online channels and a statewide network of e-Sevai Centres.",
    stats: "273 Services · 25,277 Centres · 1,40,52,771 Transactions FY 2025–26",
    image: PROJECT_IMG.eSevai,
    accessPortalHref: "#",
    knowMoreHref: "#",
    sections: ["citizen-services"],
    real: {
      statistics: ["273 Government services", "25,277 Active e-Sevai Centres", "1,40,52,771 transactions in FY 2025–26"],
      keyFeatures: [
        "Access to multiple Government services",
        "Online application submission",
        "Statewide assisted service centres",
        "Secure digital processing",
      ],
      eligibility: [
        "You need to apply for Government certificates or services.",
        "You prefer visiting an assisted service centre.",
      ],
      whatYoullNeed: ["Relevant supporting documents based on the requested service.", "Identity details, where applicable."],
      faqs: [
        { q: "How many services are available?", a: "273 Government services." },
        { q: "Can I visit a physical centre?", a: "Yes. Services are available through 25,277 e-Sevai Centres." },
      ],
    },
  },
  {
    name: "Namma Arasu",
    description:
      "Namma Arasu is a WhatsApp-based governance platform that enables citizens to access Government services through a conversational interface without visiting Government offices or multiple portals.",
    stats: "76 Services · 20 Departments · 19.51 Lakh Users",
    image: PROJECT_IMG.nammaArasu,
    accessPortalHref: "#",
    knowMoreHref: "#",
    sections: ["citizen-services"],
    real: {
      statistics: ["76 services", "20 Departments", "19.51 lakh users", "6.01 lakh services delivered"],
      keyFeatures: ["WhatsApp-based service delivery", "AI-assisted conversations", "Secure payments", "Mobile-first experience"],
      eligibility: ["You want to access Government services using WhatsApp."],
      whatYoullNeed: ["A mobile phone with WhatsApp."],
      faqs: [
        { q: "Do I need to install another app?", a: "No. Services are available through WhatsApp." },
        { q: "How many services are available?", a: "76 services across 20 Government Departments." },
      ],
    },
  },
  {
    name: "Aadhaar Services",
    description:
      "TNeGA provides Aadhaar enrolment, biometric updates, authentication, and e-KYC services through Permanent Enrolment Centres across Tamil Nadu.",
    stats: "583 Enrolment Centres · 47.95 Cr Authentication Transactions",
    image: pexelsPhoto(STOCK.elderlyWomanPhone, 700, 500),
    accessPortalHref: "#",
    knowMoreHref: "#",
    sections: ["citizen-services"],
    real: {
      statistics: [
        "583 Permanent Enrolment Centres",
        "780 enrolment counters",
        "8.53 lakh new Aadhaar enrolments",
        "17.54 lakh biometric updates",
        "47.95 crore authentication transactions",
      ],
      keyFeatures: ["Aadhaar enrolment", "Mandatory biometric updates", "Authentication services", "e-KYC", "Face Authentication"],
      eligibility: [
        "You need a new Aadhaar enrolment.",
        "You need to update Aadhaar biometrics.",
        "You require Aadhaar-based authentication.",
      ],
      whatYoullNeed: ["Documents required for Aadhaar services, as applicable."],
      faqs: [{ q: "Is Aadhaar enrolment free?", a: "New enrolments and mandatory biometric updates are provided free of cost." }],
    },
  },
  {
    // Dual-listed on Home — also appears under e-Governance Projects.
    name: "UMIS",
    description:
      "The University Management Information System (UMIS) is Tamil Nadu's centralized digital platform for higher education, serving as the authenticated repository of student information. It standardizes student data across institutions and integrates with multiple Government databases to enable efficient administration and seamless delivery of education and welfare services.",
    stats: "24.27 Lakh Students · 84 Universities · 5,693 Institutions",
    image: PROJECT_IMG.umis,
    accessPortalHref: "#",
    knowMoreHref: "#",
    sections: ["citizen-services", "e-governance-projects"],
    real: {
      statistics: ["24,27,192 Active students", "84 Universities", "5,693 Institutions", "33 Beneficiary Departments"],
      keyFeatures: [
        "Centralized student information repository",
        "Integration with EMIS, Aadhaar, NPCI, e-Sevai, and other Government databases",
        "Integration with TNSSP, Naan Mudhalvan, and CM Dashboard",
        "Authenticated student database for welfare scheme delivery",
      ],
      eligibility: [
        "You are a student enrolled in a participating higher education institution.",
        "You are applying for Government welfare schemes or services that utilize UMIS data.",
      ],
      whatYoullNeed: [
        "Enrollment in a participating institution.",
        "Student information as maintained by your institution.",
        "Aadhaar and other details, where required for verification.",
      ],
      faqs: [
        { q: "What is UMIS?", a: "UMIS is the State's centralized repository for authenticated higher education student data." },
        {
          q: "How does UMIS benefit students?",
          a: "It enables verified student records and supports seamless access to welfare schemes and scholarship services.",
        },
        {
          q: "Which services use UMIS data?",
          a: "UMIS is integrated with the Tamil Nadu State Scholarship Portal (TNSSP), Naan Mudhalvan, the CM Dashboard, and serves as the authenticated database for schemes such as Tamizh Pudhalvan, Pudhumai Penn, and the Laptop Distribution Scheme for College Students.",
        },
      ],
    },
  },
  {
    name: "TNSSP",
    description:
      "TNSSP provides a unified platform for students to apply for scholarships, complete verification, and receive assistance through Direct Benefit Transfer.",
    stats: "27 Scholarship Schemes · 7 Departments",
    image: pexelsPhoto(STOCK.studentLaptop, 700, 500),
    accessPortalHref: "#",
    knowMoreHref: "#",
    sections: ["citizen-services"],
    real: {
      statistics: ["27 scholarship schemes", "7 Government Departments"],
      keyFeatures: ["Scholarship applications", "Digital verification", "DBT integration", "UMIS integration"],
      eligibility: ["You are applying for eligible Government scholarship schemes."],
      whatYoullNeed: ["Student details", "Educational information"],
      faqs: [{ q: "How many scholarship schemes are available?", a: "27 schemes across 7 Departments." }],
    },
  },
  {
    name: "e-Gazette Portal",
    description:
      "The e-Gazette Portal enables citizens to apply online for name change and other Gazette notification services with end-to-end digital processing.",
    stats: "Online Application · Digital Approval · Digital Publication",
    image: pexelsPhoto(STOCK.officeBuilding, 700, 500),
    accessPortalHref: "#",
    knowMoreHref: "#",
    sections: ["citizen-services"],
    real: {
      statistics: [],
      keyFeatures: ["Online application", "Digital approval", "Online payment", "Digital publication"],
      eligibility: ["You wish to publish eligible Gazette notifications online."],
      whatYoullNeed: ["Relevant application details and supporting documents."],
      faqs: [{ q: "Can I complete the process online?", a: "Yes. The portal supports end-to-end digital processing." }],
    },
  },

  // ---------- e-Governance Projects ----------
  {
    // No PDF content was supplied for TNGIS — per explicit instruction,
    // this keeps the previously-written placeholder copy unchanged.
    name: "TNGIS Tamil Nilam",
    description:
      "Click anywhere on the map to get land parcel details, ownership records, guideline values, nearest hospitals, schools and ration shops — all in one place.",
    stats: "400+ Spatial Layers · Public Access via tngis.tn.gov.in",
    image: PROJECT_IMG.tnGis,
    accessPortalHref: "#",
    knowMoreHref: "#",
    sections: ["e-governance-projects"],
  },
  {
    // No PDF content was supplied for GRAINS — per explicit instruction,
    // this keeps the previously-written placeholder copy unchanged.
    name: "GRAINS",
    description:
      "A unified database of farmers, land and crop details across Tamil Nadu — ensuring the right agricultural benefits reach the right farmers accurately.",
    stats: "Farmer · Land · Crop Database",
    image: pexelsPhoto(STOCK.serverRoom, 700, 500),
    accessPortalHref: "#",
    knowMoreHref: "#",
    sections: ["e-governance-projects"],
  },
  {
    name: "e-Office",
    description:
      "Digital Office Tamil Nadu (e-Office) is the Government of Tamil Nadu's digital workplace platform that enables end-to-end electronic file processing and workflow automation. It transforms paper-based administration into a secure, transparent, and accountable digital governance framework through electronic file management, digital correspondence, digital signatures, and inter-departmental collaboration.",
    stats: "65,95,723 e-Files Created · 1,49,535 Configured Users",
    image: PROJECT_IMG.eOffice,
    accessPortalHref: "#",
    knowMoreHref: "#",
    sections: ["e-governance-projects"],
    real: {
      statistics: [
        "65,95,723 e-files created",
        "1,49,535 configured users across three implementation phases",
        "46,645 users trained",
        "7,810 desktops deployed",
        "3,042 scanners deployed",
      ],
      keyFeatures: [
        "Electronic file management",
        "Workflow automation",
        "Digital correspondence",
        "Digital signatures",
        "Inter-departmental collaboration",
        "Real-time file tracking",
        "Secure digital record management",
        "Paperless office operations",
      ],
      eligibility: [
        "Your Government Department or office is implementing Digital Office Tamil Nadu (e-Office).",
        "You need to manage official files and correspondence digitally.",
        "Your office requires secure, paperless workflow management.",
      ],
      whatYoullNeed: [
        "Access to the e-Office platform provided by your Department.",
        "User credentials issued by the concerned Government Department.",
        "A configured workstation and digital signature, where applicable.",
      ],
      faqs: [
        { q: "What is e-Office?", a: "e-Office is the Government of Tamil Nadu's digital office platform for electronic file processing and workflow automation." },
        { q: "Who can use e-Office?", a: "It is intended for Government Departments and offices implementing the Digital Office Tamil Nadu platform." },
        {
          q: "What are the benefits of e-Office?",
          a: "Improves transparency in file processing, reduces dependency on physical files, streamlines workflow management, enables real-time file tracking, enhances accountability, and ensures secure management of digital records.",
        },
        {
          q: "How widely has e-Office been implemented?",
          a: "The platform has been rolled out in phases across Secretariat Departments, District Collectorates, subordinate offices, and Head of Department (HoD) offices, with over 65 lakh e-files created and 1.49 lakh configured users.",
        },
      ],
    },
  },
  {
    name: "Interdepartmental Technical Consulting",
    description:
      "TNeGA provides technology consulting, evaluation, software implementation, and project management support for digital transformation initiatives across Government Departments.",
    stats: "10+ Active Engagements · Multiple Departments",
    image: pexelsPhoto(STOCK.handshakeLeaders, 700, 500),
    knowMoreHref: "#",
    sections: ["e-governance-projects"],
    real: {
      statistics: [
        "STAR 3.0",
        "ERP 2.0 (Greater Chennai Police)",
        "PDS 2.0",
        "Naan Mudhalvan",
        "TWAD",
        "CMWSSB",
        "TANMAG",
        "DIPR 2.0",
        "e-Gazette Portal",
        "Sericulture Department and others",
      ],
      keyFeatures: ["Technical consulting", "Software development", "ERP implementation", "Portal development", "Project management"],
      eligibility: ["Your Department is planning or implementing an e-Governance initiative."],
      whatYoullNeed: ["Department requirements", "Project proposal"],
      faqs: [
        {
          q: "What kind of support does TNeGA provide?",
          a: "Technical consulting, solution design, implementation support, and digital transformation services.",
        },
      ],
    },
  },

  // ---------- Services ----------
  {
    name: "DBT",
    description:
      "The Direct Benefit Transfer (DBT) Platform enables Government Departments to disburse welfare benefits directly to eligible beneficiaries through Aadhaar and bank account validation.",
    stats: "62 Schemes Onboarded · ₹43,318 Cr Transferred",
    image: pexelsPhoto(STOCK.womanPhone, 700, 500),
    knowMoreHref: "#",
    sections: ["services"],
    real: {
      statistics: ["62 schemes onboarded", "₹43,318 crore transferred", "1.92 crore beneficiaries"],
      keyFeatures: ["Aadhaar validation", "Beneficiary verification", "Bank account validation", "APB & ACH integration", "Centralized welfare payments"],
      eligibility: ["Your Department administers welfare schemes requiring direct benefit transfer."],
      whatYoullNeed: ["Eligible scheme", "Beneficiary database", "Department onboarding"],
      faqs: [{ q: "How are benefits transferred?", a: "Through Aadhaar Payment Bridge (APB) and Automated Clearing House (ACH)." }],
    },
  },
  {
    name: "TNSSO",
    description:
      "Tamil Nadu Single Sign-On (TNSSO) is a unified authentication platform that enables Government officials and citizens to access multiple Government applications using a single set of credentials.",
    stats: "Pilot Phase · Unified Login",
    image: PROJECT_IMG.tnsso,
    knowMoreHref: "#",
    sections: ["services"],
    real: {
      statistics: ["Pilot integration underway — no usage figures available yet"],
      keyFeatures: ["Single authentication", "Multi-application access", "Centralized identity management"],
      eligibility: ["Your Department is integrating applications under TNSSO."],
      whatYoullNeed: ["Department application integration"],
      faqs: [{ q: "Does TNSSO replace multiple logins?", a: "Yes. It enables access using a single set of credentials." }],
    },
  },
  {
    name: "e-Sign",
    description:
      "The e-Sign Service Platform enables Government Departments to digitally sign documents securely using Aadhaar-based authentication.",
    stats: "26 Departments Onboarded · 4.35 Cr e-Signatures",
    image: pexelsPhoto(STOCK.itTechnician, 700, 500),
    knowMoreHref: "#",
    sections: ["services"],
    real: {
      statistics: ["26 Departments onboarded", "4.35 crore e-Signatures executed", "3 Departments under onboarding"],
      keyFeatures: ["Aadhaar OTP authentication", "Biometric authentication", "Paperless workflows", "Secure digital signatures"],
      eligibility: ["Your Department requires digital document signing."],
      whatYoullNeed: ["Department onboarding", "Aadhaar authentication integration"],
      faqs: [{ q: "Is the service compliant?", a: "Yes. It complies with CCA and UIDAI guidelines." }],
    },
  },
  {
    name: "SMS & WhatsApp Gateway",
    description:
      "TNeGA provides centralized SMS and WhatsApp Gateway services that enable Government Departments to communicate with citizens efficiently and at scale.",
    stats: "660.41 Cr SMS Sent · 30.18 Cr WhatsApp Messages",
    image: pexelsPhoto(STOCK.elderlyManPhone, 700, 500),
    knowMoreHref: "#",
    sections: ["services"],
    real: {
      statistics: [
        "115 Departments using SMS Gateway",
        "27 Departments using WhatsApp Gateway",
        "660.41 crore SMS sent",
        "30.18 crore WhatsApp messages sent",
      ],
      keyFeatures: ["Bulk SMS", "WhatsApp notifications", "Citizen outreach", "Government communications"],
      eligibility: ["Your Department needs to communicate scheme updates or service notifications."],
      whatYoullNeed: ["Department onboarding", "Approved communication templates"],
      faqs: [{ q: "Who can use the gateway?", a: "Government Departments, Boards, PSUs, and Agencies." }],
    },
  },
  {
    name: "IT Security Audit Framework",
    description:
      "TNeGA facilitates mandatory IT Security Audits for Government websites, mobile applications, APIs, and cloud applications through CERT-In empanelled agencies before deployment and during operational changes.",
    stats: "CERT-In Compliant · STQC Compliant",
    image: pexelsPhoto(STOCK.engineerAudit, 700, 500),
    knowMoreHref: "#",
    sections: ["services"],
    real: {
      statistics: [],
      keyFeatures: ["Security audits", "CERT-In compliance", "STQC compliance", "Cloud security validation"],
      eligibility: ["Your Department is deploying or upgrading a digital application."],
      whatYoullNeed: ["Application details", "Deployment environment"],
      faqs: [{ q: "When is an audit required?", a: "Before deployment, certificate expiry, major modifications, and cloud migration." }],
    },
  },
  {
    name: "Nambikkai Inaiyam",
    description:
      "Nambikkai Inaiyam (NI) is TNeGA's Blockchain-as-a-Service (BaaS) infrastructure, developed to secure Government documents and data against tampering. Built in line with the Tamil Nadu Blockchain Policy, the platform enables trusted verification of digital records while allowing citizens to access secured documents through the e-Pettagam wallet application.",
    stats: "27 Certificate Categories · 2 Crore+ Documents Secured",
    image: pexelsPhoto(STOCK.networkRack, 700, 500),
    accessPortalHref: "#",
    knowMoreHref: "#",
    sections: ["services"],
    real: {
      statistics: [
        "27 categories of e-Sevai certificates secured",
        "9 lakh+ e-Sevai certificates secured",
        "3 lakh+ education certificates and mark sheets secured",
        "2 crore+ registered documents secured",
      ],
      keyFeatures: [
        "Blockchain-based document security",
        "Tamper-proof digital records",
        "Secure verification of Government documents",
        "Integration with e-Sevai certificates, education certificates, and Registration Department records",
        "Citizen access through the e-Pettagam wallet application",
      ],
      eligibility: [
        "Your Government Department wants to secure digital records using blockchain.",
        "You need to verify blockchain-secured Government documents.",
        "You wish to access your secured documents through the e-Pettagam wallet.",
      ],
      whatYoullNeed: ["A Government-issued document available on the platform.", "Access to the e-Pettagam wallet application, where applicable."],
      faqs: [
        {
          q: "What is Nambikkai Inaiyam?",
          a: "It is Tamil Nadu's Blockchain-as-a-Service platform that secures Government documents and records against tampering.",
        },
        {
          q: "What types of documents are secured?",
          a: "The platform secures e-Sevai certificates, academic certificates and mark sheets, licences, and registered land documents.",
        },
        {
          q: "How can citizens access their secured documents?",
          a: "Citizens can access blockchain-secured documents through the e-Pettagam wallet application.",
        },
        {
          q: "Which department's records are automatically secured?",
          a: "Documents registered with the Registration Department are automatically fetched and secured on the platform.",
        },
      ],
    },
  },
];

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// One entry per unique item, hrefs resolved. Per-section display lists
// below are just filtered views of this — a dual-listed item is still a
// single object, so both views point at the exact same detail page.
const allItems: ServiceItem[] = serviceItemsRaw.map((item) => ({
  ...item,
  knowMoreHref: `/services/${slugify(item.name)}`,
}));

export const citizenServices: ServiceItem[] = allItems.filter((item) =>
  item.sections.includes("citizen-services")
);

export const eGovernanceProjects: ServiceItem[] = allItems.filter((item) =>
  item.sections.includes("e-governance-projects")
);

/** The 3rd /services tab — "shared digital services" per Home's own
 * description copy. Named to avoid colliding with this module's own
 * "services" subject matter. */
export const sharedServices: ServiceItem[] = allItems.filter((item) =>
  item.sections.includes("services")
);

export type ServiceItemType = "project" | "service";

export interface ServiceItemDetail extends ServiceItem {
  slug: string;
  type: ServiceItemType;
  /** The item's primary/home section (sections[0]) — used for the detail
   * page's breadcrumb, back-link, and "Related" carousel filter. */
  section: ServiceSection;
}

/** Flat, slug-keyed lookup of all 16 unique items for the /services/[slug]
 * detail route — each entry's `type` decides which template (Project vs
 * Service) it renders with, per the confirmed rule: has an Access Portal
 * -> Project, Know More only -> Service. */
export const allServiceItems: ServiceItemDetail[] = allItems.map((item) => ({
  ...item,
  slug: item.knowMoreHref.replace("/services/", ""),
  type: item.accessPortalHref ? "project" : "service",
  section: item.sections[0],
}));

export function getServiceItemBySlug(slug: string): ServiceItemDetail | undefined {
  return allServiceItems.find((item) => item.slug === slug);
}

/** Resolves a list of item names (as referenced by Home's pillar bands) to
 * the canonical service items, so those bands reuse this file's copy rather
 * than restating it. Throws rather than silently dropping a card, so a
 * mistyped name fails the build instead of shipping a short carousel. */
export function getServiceItemsByNames(names: string[]): ServiceItemDetail[] {
  return names.map((name) => {
    const item = allServiceItems.find((candidate) => candidate.name === name);
    if (!item) {
      throw new Error(
        `Unknown service item "${name}". Expected one of: ${allServiceItems.map((i) => i.name).join(", ")}`
      );
    }
    return item;
  });
}

/** Splits a " · "-joined stats/metrics line back into individual bullet
 * points — reused as-is for the detail page's Key Features / Impact list
 * so that content stays exactly the verified copy already on the card,
 * never invented. */
export function statsToBullets(stats: string): string[] {
  return stats.split("·").map((s) => s.trim()).filter(Boolean);
}
