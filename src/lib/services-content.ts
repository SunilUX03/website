// Centralized copy for the /services page (Citizen Services + Govt Digital
// Services), replicated from the prototype at
// tnega-website-v2.vercel.app/initiatives.html per the build spec, with two
// changes: the prototype's 3 tabs (For Citizens / For Departments /
// Innovation & Infrastructure) are consolidated into 2 sections here
// (Citizen Services, and Govt Digital Services = Departments + Innovation &
// Infrastructure merged, FRAS de-duplicated to a single card).
//
// Images: the 6 projects already photographed for Home's Projects Spotlight
// (e-Sevai, Namma Arasu, TN GIS, UMIS, TNSSO, e-Office) reuse those exact
// files wherever they appear here, including across both sections. Every
// other item uses a curated, on-theme stock photo from the shared STOCK
// pool (see lib/stock-photos.ts) — following the same reuse-across-sections
// precedent already set by content.ts/about-content.ts — never an icon,
// never a visible "pending" label.
//
// CTA hrefs are `#` placeholders throughout: real Access Portal URLs are not
// yet supplied (see build spec's pending-content note), and none of the
// individual service detail pages this Know More would deep-link to exist
// yet either — so both stay honest placeholders rather than fabricated
// routes.

import { pexelsPhoto, STOCK } from "./stock-photos";

export const servicesHero = {
  eyebrow: "What We Build",
  headline: "Initiatives Powering Tamil Nadu's Digital Future",
  description:
    "From citizen-facing portals to department platforms and emerging technology — TNeGA builds, operates and scales digital governance across Tamil Nadu.",
};

export type ServiceItem = {
  name: string;
  description: string;
  stats: string;
  image: string;
  accessPortalHref?: string;
  knowMoreHref: string;
};

const PROJECT_IMG = {
  eSevai: "/images/projects/e-sevai.png",
  nammaArasu: "/images/projects/namma-arasu.png",
  tnGis: "/images/projects/tn-gis.png",
  umis: "/images/projects/umis.png",
  tnsso: "/images/projects/tnsso.png",
  eOffice: "/images/projects/e-office.png",
} as const;

export const citizenServices: ServiceItem[] = [
  {
    name: "e-Sevai",
    description:
      "A unified digital service delivery platform enabling citizens to access essential Tamil Nadu Government services online and through 34,843 assisted centres across the state.",
    stats: "410 Services · 34,843 Centres · 4 Crore+ Transactions",
    image: PROJECT_IMG.eSevai,
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "Namma Arasu",
    description:
      "Get government services directly on WhatsApp. Message 7845252525 to access 51 services across 16 departments — in Tamil or English, anytime, anywhere.",
    stats: "51 Services · 16 Departments · Launched Jan 2026",
    image: PROJECT_IMG.nammaArasu,
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "UMIS",
    description:
      "A single platform for all higher education institutions in Tamil Nadu — maintaining student information, courses and university data integrated with scholarship portals.",
    stats: "29 Lakh Students · 81 Universities · 5,490 Institutions",
    image: PROJECT_IMG.umis,
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "TNSSO",
    description:
      "Log in once to access all Tamil Nadu government services. A single verified credential gives citizens secure access to multiple G2C applications.",
    stats: "9 Applications Integrated · MeitY Approved · Launching Soon",
    image: PROJECT_IMG.tnsso,
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "TNSSP",
    description:
      "One portal for all scholarship schemes in Tamil Nadu. Apply once and get matched to eligible schemes — automated, transparent and direct to your bank account.",
    stats: "30 Schemes · 29 Lakh Beneficiaries · ₹1,001 Cr Disbursed",
    image: pexelsPhoto(STOCK.studentLaptop, 700, 500),
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "TNGIS Tamil Nilam",
    description:
      "Click anywhere on the map to get land parcel details, ownership records, guideline values, nearest hospitals, schools and ration shops — all in one place.",
    stats: "400+ Spatial Layers · Public Access via tngis.tn.gov.in",
    image: PROJECT_IMG.tnGis,
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "GRAINS",
    description:
      "A unified database of farmers, land and crop details across Tamil Nadu — ensuring the right agricultural benefits reach the right farmers accurately.",
    stats: "Farmer · Land · Crop Database",
    image: pexelsPhoto(STOCK.serverRoom, 700, 500),
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "Nambikkai Inaiyam",
    description:
      "Verify your government-issued certificates instantly using blockchain. Tamper-proof, Aadhaar-linked and accessible via the e-Pettagam app.",
    stats: "Blockchain-secured · Zero Downtime · Certificate Verification",
    image: pexelsPhoto(STOCK.networkRack, 700, 500),
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "SimpleGov",
    description:
      "Government services made simpler. Licenses, certificates and NOCs are now paperless, self-certified and available online — no physical visits required.",
    stats: "8 Departments · 10 Services Live · 150+ Coming Soon",
    image: pexelsPhoto(STOCK.officeBuilding, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "DBT",
    description:
      "Welfare scheme benefits delivered directly to your bank account. No middlemen, no delays — Aadhaar-linked transfers that reach you instantly.",
    stats: "₹26,250 Cr Transferred · 27 Schemes Onboarded",
    image: pexelsPhoto(STOCK.womanPhone, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "KMUT",
    description:
      "Kalaignar Magalir Urimai Thittam provides ₹1,000 every month directly to eligible women — identified through 28+ datasets with no documents required.",
    stats: "1.14 Crore Beneficiaries · 99.13% Successful Transfers",
    image: pexelsPhoto(STOCK.ruralWomanPhone, 700, 500),
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "Pudhumai Penn",
    description:
      "Girl students from government schools receive ₹1,000 per month to pursue higher education. Benefits reach directly to bank accounts via Aadhaar-based DBT.",
    stats: "Aadhaar e-KYC · Auto-approval · Direct Bank Transfer",
    image: pexelsPhoto(STOCK.attentiveGroup, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "Tamil Pudhalvan",
    description:
      "Boy students from government schools receive ₹1,000 per month to continue their education. 4 lakh beneficiaries identified using EMIS, UMIS and DGE data.",
    stats: "4 Lakh Beneficiaries · Aadhaar-linked DBT",
    image: pexelsPhoto(STOCK.workshopGroup, 700, 500),
    knowMoreHref: "#",
  },
];

export const govtDigitalServices: ServiceItem[] = [
  {
    name: "e-Office",
    description:
      "Go fully paperless with Tamil Nadu's office digitization platform. Create, track and process files digitally — from the Secretariat to district offices.",
    stats: "1,28,243 Users · 80% State Penetration · 100% in Secretariat",
    image: PROJECT_IMG.eOffice,
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "TNGIS",
    description:
      "A unified geospatial platform with 400+ layers for asset geotagging, crop surveys, natural resource mapping and inter-departmental data sharing.",
    stats: "400+ Layers · 200+ Shared Inter-departmentally · 500+ Officials Trained",
    image: PROJECT_IMG.tnGis,
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "GRAINS",
    description:
      "Access verified farmer, land and crop data for planning and implementing agricultural schemes. Integrated with DBT for direct benefit delivery.",
    stats: "Farmer · Land · Crop Database · DBT Integrated",
    image: pexelsPhoto(STOCK.serverRoom, 700, 500),
    accessPortalHref: "#",
    knowMoreHref: "#",
  },
  {
    name: "TNSSO",
    description:
      "One login for all government applications. Reduce IT overhead and give your department's users secure, unified access through a single verified credential.",
    stats: "9 Applications Integrated · MeitY Aadhaar Approval Received · Mandating in Progress",
    image: PROJECT_IMG.tnsso,
    knowMoreHref: "#",
  },
  {
    name: "CM Dashboard",
    description:
      "Real-time governance monitoring for departments. Track KPIs, iconic projects and scheme progress through 350+ live dashboards — all in one view.",
    stats: "350+ Dashboards · 35+ Departments · 280 Iconic Projects",
    image: pexelsPhoto(STOCK.presentation, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "SFDB",
    description:
      "State Family Database brings all department data together to identify the right beneficiaries for welfare schemes — ensuring correct benefits to correct persons.",
    stats: "20+ Datasets Integrated · 30+ Datasets in Pipeline",
    image: pexelsPhoto(STOCK.dataCenter, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "Data Purity",
    description:
      "Cross-departmental data analysis that removes ghost beneficiaries and saves public money. Accuracy, integrity and reliability across all welfare schemes.",
    stats: "₹1,350+ Cr Recurring Savings · ₹1,000+ Cr One-time Savings",
    image: pexelsPhoto(STOCK.serverRacks, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "SMS Gateway",
    description:
      "Send bulk SMS notifications to citizens on behalf of your department. TRAI-compliant, cost-effective and trusted by 86 departments statewide.",
    stats: "252.57 Cr Messages · 86 Departments · 2.3 Paise Per Message",
    image: pexelsPhoto(STOCK.elderlyManPhone, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "WhatsApp Gateway",
    description:
      "Reach citizens directly on WhatsApp for scheme updates, alerts and service notifications. 27 departments already onboarded.",
    stats: "13.5 Cr Messages Delivered · 27 Departments · 36 Paise Per Message",
    image: pexelsPhoto(STOCK.elderlyWomanPhone, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "Email Gateway",
    description:
      "Secure government email for all officials. Integrated with e-Office for seamless internal communication across departments and districts.",
    stats: "2,07,250 Users Onboarded",
    image: pexelsPhoto(STOCK.developer, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "e-Sign",
    description:
      "Enable citizens and officials to sign documents digitally — legally valid, Aadhaar-linked and integrated into government workflows.",
    stats: "2,73,07,136 Signatures Issued",
    image: pexelsPhoto(STOCK.itTechnician, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "FRAS",
    description:
      "Facial Recognition Attendance System for government employees — works offline, geo-fenced and deployed across 10 departments.",
    stats: "1,00,000+ Users · 10 Departments · Offline Capable",
    image: pexelsPhoto(STOCK.engineerAudit, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "EaaS",
    description:
      "Conduct secure, scalable online examinations for government recruitment. Covers pre-exam, exam and post-exam activities end to end.",
    stats: "29 Exams Conducted · 6 Departments · 27 Lakh Appeared",
    image: pexelsPhoto(STOCK.studentLaptop, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "Aadhaar Authentication",
    description:
      "Integrate Aadhaar-based identity verification into your department's applications. Approved authentication agency with 44 departments onboarded.",
    stats: "44 Departments Onboarded · MeitY Approved",
    image: pexelsPhoto(STOCK.handshakeFormal, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "API Gateway",
    description:
      "Connect your department's systems with TNeGA platforms through a secure, standardized API layer. 51 APIs developed and live.",
    stats: "51 APIs Developed · Secure · Standardized",
    image: pexelsPhoto(STOCK.programmer, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "Software Security Audit",
    description:
      "Get your department's applications audited by CERT-In empanelled agencies. Protecting Tamil Nadu's digital infrastructure from cyber threats.",
    stats: "600+ Applications Audited · 17 Empanelled Agencies",
    image: pexelsPhoto(STOCK.itTechnician, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "IT Consultancy & Project Management",
    description:
      "End-to-end technology consulting for government departments — from scoping and tendering to development, UAT and go-live.",
    stats: "160+ Software Projects · 40 Departments · 168 Total Projects",
    image: pexelsPhoto(STOCK.handshakeBusiness, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "AI Centre of Excellence",
    description:
      "Tamil Nadu's state-wide AI initiative — identifying priority use cases across healthcare, agriculture, education and governance, matched with Tamil Nadu's AI/ML startup ecosystem.",
    stats: "33 AI/ML Startups Engaged · 5 Sectors · Aligned with IndiaAI Mission",
    image: pexelsPhoto(STOCK.developer, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "Nambikkai Inaiyam",
    description:
      "Tamil Nadu's blockchain backbone — a state-wide infrastructure securing government certificates, land records and welfare data with tamper-proof immutable ledgers as Blockchain as a Service.",
    stats: "Hybrid Infrastructure · Zero Downtime · G2G & G2C Ready",
    image: pexelsPhoto(STOCK.dataCenter, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "Tamil Open Data Platform",
    description:
      "A statewide open data infrastructure under development — enabling AI research, policy planning and governance transformation through anonymized standardized departmental datasets.",
    stats: "Under Development · Ethical Data Protocols Established",
    image: pexelsPhoto(STOCK.serverRoom, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "e-Parvai",
    description:
      "An AI-powered cataract detection app that screens citizens for eye conditions using images — bringing early diagnosis to remote areas without specialist visits.",
    stats: "20,000+ Patients Identified · AI-powered Screening",
    image: pexelsPhoto(STOCK.workshopGroup, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "COHA",
    description:
      "Comprehensive Oral Health App detects early signs of oral cancer from images using AI — enabling frontline health workers to screen citizens quickly and accurately.",
    stats: "Early Cancer Detection · Image-based AI Diagnosis",
    image: pexelsPhoto(STOCK.attentiveGroup, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "Name Matching Tool",
    description:
      "An AI-based Tamil and English transliteration tool that matches names across databases with reliability scoring — solving one of the biggest data quality challenges in government.",
    stats: "Tamil & English · Reliability Scoring · Cross-database Matching",
    image: pexelsPhoto(STOCK.programmer, 700, 500),
    knowMoreHref: "#",
  },
  {
    name: "TN AI CoE Startup Ecosystem",
    description:
      "TNeGA is mapping and engaging Tamil Nadu's AI/ML startup ecosystem to prototype solutions for governance challenges — with PoC engagements, hackathons and statewide innovation programs.",
    stats: "317 Startups Listed · 90 Active · 33 Focused on AI/ML",
    image: pexelsPhoto(STOCK.presentation, 700, 500),
    knowMoreHref: "#",
  },
];
