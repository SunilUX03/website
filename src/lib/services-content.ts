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
import { DBT_SCHEMES } from "./dbt-schemes";

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
  /** Real one-line description per `keyFeatures` entry, same index —
   * replaces the generated "A core capability of {name}." filler when
   * present. Optional/partial: falls back to the generic line for any
   * index left out. */
  keyFeatureDescriptions?: string[];
  eligibility: string[];
  whatYoullNeed: string[];
  faqs: { q: string; a: string }[];
  // Everything below is optional — only items with a fuller real-content
  // submission (starting with Namma Arasu) set these; every other item
  // keeps behaving exactly as before via the generator's fallbacks.
  /** Short hero-only line, distinct from `description` (which is reused
   * as the About section's opening paragraph). Falls back to
   * `description` when absent, matching the original single-field
   * behaviour. */
  tagline?: string;
  /** Overrides the auto-generated About section's second paragraph. */
  aboutSecondParagraph?: string;
  /** Overrides the auto-generated pull-quote card in the About section
   * with a plain callout line (no generated "— TNeGA — Section" source). */
  calloutText?: string;
  /** Optional text link rendered after the About section's paragraphs —
   * opens a modal listing `items` (e.g. "50+ schemes covered"). */
  aboutLinkModal?: { label: string; title: string; items: string[] };
  /** `statistics` normally also becomes one Key Feature card per stat —
   * set this when a submission's Key Features list is already complete
   * on its own and shouldn't be padded with duplicate stat cards. */
  hideStatFeatureCards?: boolean;
  /** Real Product Tour images, replacing the generated stock-photo
   * carousel. */
  productTour?: { src: string; alt: string }[];
  productTourCaption?: string;
  /** Overrides the generated "How to access" steps. */
  getStartedSteps?: { title: string; description: string }[];
  /** Label for the Get Started card's direct-link button (project items
   * only) — defaults to "Open". */
  directLinkLabel?: string;
  /** Optional line shown above the Get Started steps — e.g. framing them
   * as a preview of a not-yet-live flow. */
  getStartedIntro?: string;
  /** Optional line shown below the Get Started steps. */
  getStartedOutro?: string;
  /** Marks a Project item as pre-launch: the Hero and Get Started CTAs
   * become "Coming Soon" / "Contact TNeGA" (linking to the page's own
   * #contact section) instead of the live Access Portal / Direct link,
   * on both this detail page and its card everywhere else on the site. */
  comingSoon?: boolean;
  /** Overrides the stats line shown on grid/related-service cards
   * elsewhere on the site, which otherwise reuses the Hero's own `stats`
   * string — for cases where the two contexts should say different
   * things (e.g. a pre-launch item flagging "Coming Soon" on cards while
   * the Hero still shows its planned feature stats). */
  relatedCardStats?: string;
  /** Marks a Project item whose real portal is access-gated (credential-
   * login for authorized staff, not public self-service): the Hero and
   * card CTAs become "Avail Service" → /reach-us instead of "Access
   * Portal" → accessPortalHref, while the Get Started section's Direct
   * link panel still shows the real portal for reference. */
  gatedAccess?: boolean;
  /** Skips the About section's auto-generated second paragraph (used
   * when a submission only has one About paragraph plus a closing
   * `calloutText`, and the generated fallback text — built from
   * `statistics`/`stats` — wouldn't make sense here). */
  hideAboutSecondParagraph?: boolean;
  /** Additional FAQs shown behind a "View more" toggle, kept separate
   * from the primary `faqs` shown by default. */
  faqsMore?: { q: string; a: string }[];
  /** Overrides the site-wide footer contact info for this item's Contact
   * section — e.g. a service-specific helpdesk. */
  contact?: { email?: string; phone?: string };
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
  tnGis: "/images/projects/tn-gis.png",
  umis: "/images/projects/umis.png",
  tnsso: "/images/projects/tnsso.png",
  eOffice: "/images/projects/e-office.png",
} as const;

// Real submission images for the Namma Arasu detail page — see the
// content update sourced from NammaArasu_Content_&_Image_Submission.pdf.
const NAMMA_ARASU_IMG = {
  hero: "/images/projects/namma-arasu/hero.png",
  productTour1: "/images/projects/namma-arasu/product-tour-1.png",
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
    // Source of truth: NammaArasu_Content_&_Image_Submission.pdf — all
    // previous placeholder numbers on this page have been discarded.
    name: "Namma Arasu",
    description:
      "Namma Arasu is the Government of Tamil Nadu's official WhatsApp-based governance platform, enabling citizens to access a wide range of government services directly through WhatsApp — without needing to install a separate app, use a portal, or visit an e-Sevai centre.",
    stats: "74 Services · 20 Departments · 6,57,239 Transactions since launch (Jan 2026)",
    image: NAMMA_ARASU_IMG.hero,
    accessPortalHref: "https://wa.me/917845252525",
    knowMoreHref: "#",
    sections: ["citizen-services"],
    real: {
      tagline:
        "Government of Tamil Nadu's official WhatsApp-based governance platform — access government services without an app, portal, or e-Sevai centre visit.",
      aboutSecondParagraph:
        "Citizens save one WhatsApp number and get a guided, step-by-step flow in Tamil and English across all departments — including paying electricity, water, and property tax bills — with real-time sync to e-Sevai and departmental databases. The platform is built to stay stable even during peak-traffic events like exam-result days.",
      calloutText: "Rated 4.1/5 by citizens across departments",
      statistics: ["74 Services", "20 Departments", "6,57,239 Transactions since launch (Jan 2026)"],
      hideStatFeatureCards: true,
      keyFeatures: [
        "One WhatsApp number (78452 52525) for every government service",
        "Guided, step-by-step service flow in Tamil and English",
        "All departments accessible in a single chat window",
        "Pay electricity, water, and property tax bills without leaving the chat",
        "Real-time sync with e-Sevai and departmental databases",
        "Built to handle peak traffic (e.g., exam-result days) without downtime",
        "Secure WhatsApp payments — ₹2,17,53,558 collected to date",
        'Bilingual support — reply "T" anytime to switch to Tamil',
      ],
      productTour: [
        { src: NAMMA_ARASU_IMG.productTour1, alt: "Namma Arasu — Government at your fingertips, a 3-step visual: Join, select department, complete request" },
      ],
      productTourCaption: "See how citizens start a request on Namma Arasu",
      eligibility: [
        "You're a Tamil Nadu resident with a WhatsApp-enabled mobile number",
        "You find it hard to travel to a centre or navigate a web portal — especially useful for farmers, daily-wage workers, women, and senior citizens",
      ],
      whatYoullNeed: [
        "A WhatsApp-enabled mobile phone",
        "Service-specific details (e.g., CAN number for certificates, consumer number for bill payments)",
      ],
      getStartedSteps: [
        { title: "Save the number", description: "Save 78452 52525 as a contact." },
        { title: 'Send "Hi"', description: "Start a chat on WhatsApp (or use the direct link to skip this step)." },
        { title: "Select your department", description: "Choose from the menu shown." },
        { title: "Complete your request", description: "Enter the required details and finish." },
      ],
      directLinkLabel: "Chat on WhatsApp",
      faqs: [
        {
          q: "What is Namma Arasu?",
          a: "Namma Arasu is the Government of Tamil Nadu's official WhatsApp-based governance platform, letting citizens access government services directly through a WhatsApp chat — no app, no portal login needed.",
        },
        {
          q: "How do I start using Namma Arasu?",
          a: 'Save 78452 52525 as a contact and send "Hi" on WhatsApp. You\'ll see a menu to select your department and service.',
        },
        {
          q: "Do I need to download a separate app?",
          a: "No. Namma Arasu works entirely inside WhatsApp, which is already installed on most phones.",
        },
        {
          q: "Can I pay my bills on Namma Arasu?",
          a: "Yes — electricity, water, and property tax bills can be paid directly inside the WhatsApp chat.",
        },
        {
          q: "Is Namma Arasu available in Tamil?",
          a: 'Yes, it is fully bilingual — reply "T" at any point to switch to Tamil.',
        },
        {
          q: "Who do I contact if I face a problem on Namma Arasu?",
          a: "You can reach TNeGA's support desk at tnesevaihelpdesk@tn.gov.in or the toll-free number 1800-425-6000.",
        },
      ],
      faqsMore: [
        {
          q: "What if the service I need isn't listed yet?",
          a: "New services are being added in phases, with a roadmap target of 275+ services across 9 rollout phases.",
        },
        {
          q: "Is my data safe on Namma Arasu?",
          a: "Yes — it runs on WhatsApp's verified business platform via Meta-certified partner Karix, and every chat leaves an accountable record for the citizen.",
        },
        {
          q: "What documents or details will I need?",
          a: "It depends on the service — for example, a CAN number for community certificates, or a consumer number for electricity bill payments.",
        },
        {
          q: "Can I check my application or service status on WhatsApp?",
          a: "Yes — status-check services (e.g., application status, grievance status) are available directly in the chat menu.",
        },
        {
          q: "What if I enter the wrong details by mistake?",
          a: 'You can type "M" at most stages to return to the Main Menu and restart the request.',
        },
        {
          q: "Is Namma Arasu available 24/7?",
          a: "Yes, the WhatsApp chat is available anytime; the platform is built to remain stable even during high-traffic events like exam-result days.",
        },
      ],
      contact: { email: "tnesevaihelpdesk@tn.gov.in", phone: "1800-425-6000" },
    },
  },
  {
    // Source of truth: TNeGA Content & Image Brief — Aadhaar as a Service
    // (submission doc, Jan 2026). accessPortalHref intentionally omitted:
    // this is a B2G onboarding service (departments apply to onboard as
    // Sub-AUA/Sub-KUA), not a citizen self-service portal — that flips
    // `type` to "service" everywhere (Avail Service CTA, no Access Portal
    // link), matching decision #2 in the brief.
    name: "Aadhaar Services",
    description:
      "TNeGA is the State Nodal Agency for Aadhaar-related services in Tamil Nadu and is officially designated by UIDAI as an Authentication User Agency (AUA) and KYC User Agency (KUA). In this role, TNeGA onboards Government departments as Sub-AUA/Sub-KUA entities, enabling them to use Aadhaar authentication and e-KYC in their own service delivery.",
    // 694/803 per decision #1 — the brief's more recently dated figure
    // (explicitly "as of January 2026" at both the Highlight Stats Line and
    // FAQ), superseding the undated 583 elsewhere in the same brief.
    stats: "694 PECs · 803 Service Counters · 47.95 Cr Transactions FY 2025–26",
    image: pexelsPhoto(STOCK.elderlyWomanPhone, 700, 500),
    knowMoreHref: "#",
    sections: ["citizen-services"],
    real: {
      tagline:
        "TNeGA is the State Nodal Agency for Aadhaar-related services in Tamil Nadu, officially designated by UIDAI as an Authentication User Agency (AUA) and KYC User Agency (KUA), onboarding Government departments and enabling Aadhaar enrolment through Permanent Enrolment Centres.",
      aboutSecondParagraph:
        "TNeGA also acts as the registrar for Aadhaar enrolment and mandatory biometric updates, working through two enrolment agencies — ELCOT and TACTV — across a statewide network of Permanent Enrolment Centres (PECs) and special camps. As of January 2026, 694 Permanent Enrolment Centres with 803 service counters are operational across the State, having processed 47.95 crore Aadhaar authentication and e-KYC transactions in FY 2025–26 alone.",
      statistics: [
        "694 Permanent Enrolment Centres",
        "803 Service Counters",
        "47.95 Cr Authentication Transactions (FY 2025–26)",
      ],
      // Key Features below already carries its own title+description per
      // tile (including the two headline stats as tiles 4 and 5) — no need
      // to also pad the grid with generic stat cards.
      hideStatFeatureCards: true,
      keyFeatures: [
        "Aadhaar enrolment & updates",
        "Departmental Sub-AUA/Sub-KUA onboarding",
        "TN Generic Face Authentication e-KYC App",
        "8 Departments onboarded",
        "47.95 crore transactions (FY 2025–26)",
        "2.53 crore beneficiaries verified",
      ],
      keyFeatureDescriptions: [
        "New Aadhaar enrolment and update services delivered through a statewide network of Permanent Enrolment Centres (PECs).",
        "Onboarding and support for Government departments as Sub-AUA and Sub-KUA entities under Section 7 and Section 4(4)(b)(ii) of the Aadhaar Act, 2016.",
        "A mobile application enabling secure face-authentication-based verification for citizen and student use cases.",
        "Government departments currently using TNeGA's Aadhaar authentication and e-KYC services.",
        "Aadhaar authentication and e-KYC transactions processed statewide in the last financial year.",
        "Aadhaar-based verification conducted during the Pongal Gift Hamper Distribution Program.",
      ],
      eligibility: [
        "You're a Government department seeking Aadhaar authentication or e-KYC services, and want to onboard as a Sub-AUA or Sub-KUA entity under UIDAI guidelines",
        "You're a citizen requiring Aadhaar enrolment, mandatory biometric updates, or demographic updates through a PEC",
      ],
      whatYoullNeed: ["Department approval and use-case details, for departments onboarding under the Aadhaar Act, 2016"],
      getStartedSteps: [
        {
          title: "For citizens — visit a PEC",
          description:
            "Visit your nearest Permanent Enrolment Centre (PEC) with the required documents to complete enrolment or update your biometric/demographic details.",
        },
        {
          title: "For Government departments — onboard as Sub-AUA/Sub-KUA",
          description:
            "Contact TNeGA with your department's approval and use-case details to begin onboarding as a Sub-AUA or Sub-KUA entity under the Aadhaar Act, 2016.",
        },
      ],
      faqs: [
        {
          q: "What is TNeGA's role in Aadhaar services?",
          a: "TNeGA functions as the State Nodal Agency for Aadhaar services in Tamil Nadu and is authorized by UIDAI as AUA and KUA for Aadhaar authentication and e-KYC services.",
        },
        {
          q: "Who can use TNeGA's Aadhaar authentication services?",
          a: "Government Departments can avail Aadhaar authentication and e-KYC services by onboarding as Sub-AUA/KUA entities through TNeGA.",
        },
        {
          q: "How can citizens enrol for Aadhaar or update their Aadhaar details?",
          a: "Citizens can visit the nearest Permanent Enrolment Centre (PEC) for Aadhaar enrolment, mandatory biometric updates, and demographic updates.",
        },
        {
          q: "How many Aadhaar service centres are functioning in Tamil Nadu?",
          a: "As of January 2026, 694 Permanent Enrolment Centres with 803 service counters are operational across the State.",
        },
        {
          q: "What is the scale of Aadhaar transactions handled through TNeGA?",
          a: "During FY 2025-26, TNeGA processed approximately 47.95 crore Aadhaar authentication and e-KYC transactions.",
        },
        {
          q: "What is the TN Generic Face Authentication e-KYC Mobile Application?",
          a: "It is a mobile-based Aadhaar e-KYC solution developed by TNeGA to facilitate secure face-authentication-based verification for Government programmes and citizen services.",
        },
      ],
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
    // Source of truth: e-Gazette Portal Final Page Content Spec. Pre-launch
    // — portal link isn't real yet ("To be announced upon launch"), so
    // `comingSoon` swaps every CTA that would otherwise point at
    // accessPortalHref for a "Coming Soon" / "Contact TNeGA" one instead,
    // both here and on this item's card everywhere else on the site.
    name: "e-Gazette Portal",
    description:
      "The e-Gazette Web Portal is an integrated online service platform being implemented by TNeGA for the Department of Stationery and Printing, to digitize and streamline Gazette publication services in Tamil Nadu.",
    // "Aadhaar+eSign" (not "Aadhaar & eSign") so the Hero's stat-tile
    // split (first word = value, rest = label) lands on "Aadhaar+eSign" /
    // "Integrated" instead of splitting mid-phrase after "Aadhaar".
    stats: "8 Service Types · Aadhaar+eSign Integrated · Bilingual Support (Tamil & English)",
    image: pexelsPhoto(STOCK.officeBuilding, 700, 500),
    accessPortalHref: "#",
    knowMoreHref: "#",
    sections: ["citizen-services"],
    real: {
      tagline:
        "An integrated online platform for Gazette publication services in Tamil Nadu — apply, track, pay, and access published notifications digitally. Launching soon.",
      aboutSecondParagraph:
        "Once launched, the portal will let individuals, companies, and partnership firms submit Gazette notification applications online, upload supporting documents, track application status, make payments, and access published Gazette notifications — all through a secure, bilingual digital platform.",
      calloutText:
        "Digitizing Gazette publication services with an end-to-end online application and publication process, built to be secure, transparent, and citizen-centric.",
      comingSoon: true,
      relatedCardStats: "8 Service Types · Aadhaar & eSign Integrated · Coming Soon",
      statistics: [],
      hideStatFeatureCards: true,
      keyFeatures: [
        "Online application submission",
        "Aadhaar-based authentication",
        "Document upload, tracking & payment",
        "Automated verification & approval workflow",
        "Public Gazette search & archive",
        "Bilingual, role-based interface",
      ],
      keyFeatureDescriptions: [
        "Submit Gazette notification applications entirely online.",
        "Secure citizen login and identity verification via Aadhaar.",
        "Upload supporting documents, track your application status, and pay online.",
        "Applications move through a digital verification, approval, and publication pipeline.",
        "Search published Gazette notifications and download them as PDFs.",
        "Tamil and English support, with role-based access for applicants and department staff.",
      ],
      eligibility: [
        "You're a citizen applying for a Gazette notification service (e.g., name change)",
        "You represent a company or firm publishing a statutory Gazette notification",
      ],
      whatYoullNeed: [
        "Aadhaar number for authentication",
        "Supporting documents relevant to the selected Gazette service",
        "Internet access for online application submission and payment",
      ],
      getStartedIntro: "The e-Gazette Portal is launching soon. Once live, applying will involve:",
      getStartedSteps: [
        { title: "Sign in", description: "Sign in with Aadhaar-based authentication." },
        { title: "Submit your application", description: "Submit your Gazette notification application and upload supporting documents." },
        { title: "Track & pay", description: "Track your application and pay online." },
        { title: "Download your Gazette", description: "Download your published Gazette notification once approved." },
      ],
      getStartedOutro: "Check back here or contact TNeGA for launch updates.",
      faqs: [
        {
          q: "What services are available through the e-Gazette Web Portal?",
          a: "The portal enables eligible applicants to apply online for supported Gazette notification services and access published Gazette notifications.",
        },
        {
          q: "How can I track my application?",
          a: "Applicants can log in to the portal and monitor the status of their applications throughout the processing lifecycle.",
        },
        {
          q: "Can I download my published Gazette notification?",
          a: "Yes. Applicants can access and download their published Gazette notifications from the portal after publication.",
        },
        {
          q: "Is Aadhaar authentication required?",
          a: "Yes. The portal supports Aadhaar-based authentication for citizen login and application access.",
        },
        {
          q: "Can I search previously published Gazettes?",
          a: "Yes. The portal provides a public search and archive facility for published Gazette notifications.",
        },
      ],
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
    // Source of truth: DBT Page Migration prompt — replaces the old
    // department-facing "DBT" service entry entirely (name, type, and
    // content). Now a citizen-facing Project (has its own public portal,
    // https://dbt.tn.gov.in/), still under the Services tab per the brief.
    name: "DBT — Direct Benefit Transfer Portal",
    description:
      "Tamil Nadu's citizen-facing platform to track, monitor, and receive social welfare benefits directly into your bank account.",
    stats: "54+ Schemes Covered",
    image: pexelsPhoto(STOCK.womanPhone, 700, 500),
    accessPortalHref: "https://dbt.tn.gov.in/",
    knowMoreHref: "#",
    sections: ["services"],
    real: {
      tagline:
        "Tamil Nadu's primary citizen-facing platform to track, monitor, and receive social welfare benefits directly into your bank account — transparently, with no intermediaries.",
      // The brief's "About the Project" paragraph 1 restates the card
      // summary above almost verbatim (item.description already covers
      // that slot) — folded in here with the actual paragraph 2 so both
      // pieces of the brief's copy still appear on the page.
      aboutSecondParagraph:
        "The Tamil Nadu Direct Benefit Transfer (DBT) Portal is the state's primary citizen-facing platform for tracking, monitoring, and receiving social welfare benefits directly into your bank account. It ensures transparency and eliminates intermediaries, giving citizens real-time visibility into their benefit status across a wide range of state welfare schemes — from education scholarships and old-age pensions to maternity and marriage assistance — all linked securely through Aadhaar.",
      aboutLinkModal: {
        label: "50+ schemes covered",
        title: "Schemes covered under DBT",
        items: DBT_SCHEMES,
      },
      calloutText:
        "100% Direct-to-Bank Subsidy Delivery · Zero Intermediaries, Maximum Transparency · Unified Tracking Across All State Welfare Schemes",
      statistics: ["54+ Schemes Covered"],
      hideStatFeatureCards: true,
      keyFeatures: [
        "Direct Benefit Disbursal",
        "Public Transparency Dashboard",
        "Aadhaar Payment Bridge (APB) Linkage",
        "Application Status Lookup",
      ],
      keyFeatureDescriptions: [
        "Automated credit of scholarships, pensions, and financial aid directly to beneficiary bank accounts.",
        "Explore ongoing schemes, eligibility criteria, and disbursement metrics.",
        "Secure, verified transactions linked directly to citizen UIDAI profiles.",
        "Instant digital tracking for beneficiaries waiting on welfare fund credits.",
      ],
      eligibility: [
        "You're a Tamil Nadu resident applying for or tracking state welfare subsidies, pensions, educational stipends, or assistance schemes",
      ],
      whatYoullNeed: [
        "Aadhaar Card linked with an active bank account",
        "Beneficiary Registration ID / Application Number for the target scheme",
      ],
      getStartedSteps: [
        {
          title: "Contact TNeGA",
          description: "Reach out by clicking Reach Us in the top nav and raise a ticket with your query.",
        },
        {
          title: "Share your details",
          description: "Provide your scheme name and application/Aadhaar details if you need help tracking a payment.",
        },
        {
          title: "Get assisted",
          description: "Our team will guide you to the right resource or resolve your issue.",
        },
      ],
      directLinkLabel: "Open Portal",
      faqs: [
        {
          q: "How can I track my DBT payment status?",
          a: "Enter your application reference ID or registered Aadhaar details in the tracking section on the public portal.",
        },
        {
          q: "What should I do if my subsidy payment fails?",
          a: "Verify with your bank branch that your bank account is active and seeded with your Aadhaar number.",
        },
        {
          q: "Are central and state government schemes covered here?",
          a: "Yes, the portal provides coverage and tracking for state welfare schemes and state-administered components.",
        },
      ],
    },
  },
  {
    // Source of truth: "TN DBT Portal for PFMS" submission — net-new page,
    // distinct from "DBT — Direct Benefit Transfer Portal" above (that one
    // is citizen-facing; this one is the institutional PFMS integration
    // layer for departmental nodal officers). `gatedAccess` because the
    // real portal (tndbt.tn.gov.in) is a credential-gated admin login, not
    // public self-service — Hero/card CTA routes to Avail Service/Reach Us
    // instead, with the real URL surfaced only in the Direct link panel.
    name: "TN DBT Portal for PFMS",
    description:
      "The TN DBT Portal for PFMS is TNeGA's institutional platform connecting Tamil Nadu departmental scheme workflows with the central Public Financial Management System (PFMS). It facilitates administrative validation, electronic payment generation through the EAT module, and real-time reconciliation for both State and Centrally Sponsored Schemes (CSS) — covering FY 2024–25 through FY 2026–27.",
    stats: "PFMS Integrated · SNA Compliant · Real-time Fund Reconciliation",
    image: pexelsPhoto(STOCK.programmer, 700, 500),
    accessPortalHref: "https://tndbt.tn.gov.in/",
    knowMoreHref: "#",
    sections: ["services"],
    real: {
      tagline:
        "The state's institutional platform connecting Tamil Nadu departmental scheme workflows with the Public Financial Management System (PFMS) — enabling administrative validation, electronic payment generation, and real-time fund reconciliation.",
      calloutText:
        "Seamless state-to-central financial management system integration, with automated PFMS beneficiary verification and fund routing.",
      hideAboutSecondParagraph: true,
      gatedAccess: true,
      statistics: [],
      hideStatFeatureCards: true,
      keyFeatures: [
        "PFMS System Integration",
        "Institutional Batch Processing",
        "Single Nodal Account (SNA) Workflow",
        "Account Validation Engine",
      ],
      keyFeatureDescriptions: [
        "Directly interfaces with the Central Public Financial Management System for secure payment processing and fund flow tracking.",
        "Lets departmental nodal officers upload, validate, and digitally sign bulk beneficiary payment lists.",
        "Aligned with central/state SNA disbursement guidelines and zero-balance account monitoring.",
        "Automatically validates bank account details and Aadhaar seeding status before submission to PFMS/NPCI.",
      ],
      eligibility: [
        "Your department or agency processes Direct Benefit Transfer payments under Centrally Sponsored Schemes (CSS) or State Schemes integrated with PFMS",
        "You're an authorized State Nodal Officer, Treasury Official, or Institutional Approver managing welfare fund disbursements",
      ],
      whatYoullNeed: [
        "Authorized departmental / PFMS nodal login credentials",
        "Class-2 or Class-3 Digital Signature Certificate (DSC) for batch approval",
      ],
      getStartedSteps: [
        { title: "Reach out to TNeGA", description: "Your department contacts TNeGA to request PFMS onboarding." },
        { title: "Complete onboarding", description: "Set up nodal credentials and DSC registration." },
        { title: "Get connected", description: "Begin batch processing through the TN DBT PFMS portal." },
      ],
      faqs: [
        {
          q: "What is the role of the TN DBT PFMS portal?",
          a: "It serves as the gateway bridge between Tamil Nadu departmental databases and the national PFMS framework for processing direct benefit payments.",
        },
        {
          q: "Can the general public log into this portal?",
          a: "No, this is an administrative portal for departmental nodal officers, scheme managers, and finance administrators.",
        },
        {
          q: "How are rejected PFMS transactions resolved on this portal?",
          a: "Nodal officers can view invalid account responses generated by PFMS/NPCI, update beneficiary records, and re-push the corrected batch.",
        },
      ],
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
