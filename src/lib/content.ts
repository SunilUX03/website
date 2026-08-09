// Centralized homepage copy, pulled verbatim from the locked build spec.
// Content still pending final approval uses real, content-appropriate
// curated stock photography (see lib/stock-photos.ts) or is omitted
// outright — never a visible "pending" label — per the asset policy in
// the build spec. See inline notes below.

import { pexelsPhoto, STOCK } from "./stock-photos";

// nav used to live here — it's now the "nav-content" Payload global (see
// lib/cms/nav-content.ts), fetched by TopNav.tsx and passed down to
// AccessibilityBar/MainNav/MobileDrawer.

// hero used to live here — it's now split across two Payload globals:
// "hero-content" (agencyLabelCycle/headlineTemplate/headlineCycleWords/
// tagline, see lib/cms/hero-content.ts, used by Hero.tsx) and
// "leadership-band-content" (description/leaders, see
// lib/cms/leadership-band.ts, used by AboutLeadership.tsx) — two
// different homepage sections that happened to share one static object
// before this migration.

// ticker used to live here — it's now derived from Announcements flagged
// "Show in ticker" (see getTickerAnnouncements in lib/cms/announcements.ts),
// so it can never drift out of sync with an announcement's own content.

/**
 * The three "Enabling Digital Governance" bands on Home. Each pairs a
 * standing description with a carousel of projects.
 *
 * `itemNames` reference entries in services-content.ts by name rather than
 * duplicating their copy — every card here is the same card shown on
 * /services, so stats and descriptions can never drift between the two
 * pages. Names are resolved at render (see getServiceItemsByNames), which
 * throws on a typo instead of silently dropping a card. UMIS appears under
 * both Citizen Services and e-Governance Projects by design — it is
 * genuinely both.
 *
 * `bannerImage` is this card's own dedicated photo — deliberately separate
 * from any itemNames entry's `.image`, so swapping it never changes what's
 * shown on that service/project's own detail page.
 */
export const pillars = [
  {
    title: "Citizen Services",
    description:
      "TNeGA delivers citizen-centric digital services through secure and accessible platforms, making Government services faster, simpler, and more convenient.",
    href: "/services#citizen-services",
    linkLabel: "View all Citizen Services",
    itemNames: ["e-Sevai Portal", "Namma Arasu", "TNSSP", "e-Gazette Portal", "UMIS"],
    bannerImage: "/images/pillars/citizen-services.png",
  },
  {
    title: "e-Governance Projects",
    description:
      "TNeGA collaborates with Government departments to design, develop, and implement digital solutions that improve governance and service delivery.",
    href: "/services#e-governance-projects",
    linkLabel: "View all e-Governance Projects",
    itemNames: [
      "TNGIS Tamil Nilam",
      "UMIS",
      "GRAINS",
      "e-Office",
      "Interdepartmental Technical Consulting",
    ],
    bannerImage: "/images/pillars/e-governance-projects.png",
  },
  {
    title: "Services",
    description:
      "TNeGA provides shared digital services including digital identity, DBT, e-Sign, cybersecurity, and technology consulting to support e-Governance across Tamil Nadu.",
    href: "/services#services",
    linkLabel: "View all Services",
    itemNames: [
      "Nambikkai Inaiyam",
      "DBT (Direct Benefit Transfer Portal)",
      "TNSSO",
      "e-Sign",
      "SMS & WhatsApp Gateway",
      "IT Security Audit Framework",
    ],
    bannerImage: "/images/pillars/services.png",
  },
];

export const metrics = [
  { value: 273, prefix: "", suffix: "+", label: "e-Services Available Online" },
  { value: 25277, prefix: "", suffix: "", label: "e-Sevai Centres Statewide" },
  { value: 43318, prefix: "₹", suffix: " Cr", label: "Transferred via DBT Since 2023" },
  { value: 24.27, prefix: "", suffix: " Lakh", label: "Students on UMIS", decimals: 2 },
  { value: 48, prefix: "", suffix: " Crore", label: "Aadhaar Authentication Transactions" },
  { value: 2, prefix: "", suffix: "+ Crore", label: "Documents Secured on Blockchain" },
];

export const projects = [
  {
    slug: "e-sevai",
    name: "e-Sevai",
    description:
      "A unified digital service delivery platform enabling citizens to access essential Tamil Nadu Government services online and through 34,843 assisted centres across the state.",
    stats: [
      { value: 410, suffix: "", label: "Services" },
      { value: 34843, suffix: "", label: "CSCs" },
      { value: 4, suffix: " Crore+", label: "Transactions" },
    ],
    ctas: [
      { label: "Login to Portal", href: "https://tnesevai.tn.gov.in" },
      { label: "Know more", href: "/projects/e-sevai" },
    ],
    image: "/images/projects/e-sevai.png",
  },
  {
    slug: "namma-arasu",
    name: "Namma Arasu",
    description:
      "Get government services directly on WhatsApp. Message 7845252525 to access 51 services across 16 departments, in Tamil or English, anytime, anywhere.",
    stats: [
      { value: 51, suffix: "", label: "Services" },
      { value: 16, suffix: "", label: "Departments" },
    ],
    ctas: [
      { label: "Message Now", href: "https://wa.me/917845252525" },
      { label: "Know more", href: "/projects/namma-arasu" },
    ],
    image: "/images/projects/namma-arasu/hero.png",
  },
  {
    slug: "tn-gis",
    name: "TN GIS",
    description:
      "Click anywhere on the map to get land parcel details, ownership records, guideline values, nearest hospitals, schools and ration shops, all in one place.",
    stats: [{ value: 400, suffix: "+", label: "Spatial Layers" }],
    ctas: [
      { label: "Access Portal", href: "https://tngis.tn.gov.in" },
      { label: "Know more", href: "/projects/tn-gis" },
    ],
    image: "/images/projects/tn-gis.png",
  },
  {
    slug: "umis",
    name: "UMIS",
    description:
      "A single platform for all higher education institutions in Tamil Nadu, maintaining student information, courses and university data integrated with scholarship portals.",
    stats: [
      { value: 29, suffix: " Lakh", label: "Students" },
      { value: 81, suffix: "", label: "Universities" },
      { value: 5490, suffix: "", label: "Institutions" },
    ],
    ctas: [
      { label: "Login to Portal", href: "/projects/umis" },
      { label: "Know more", href: "/projects/umis" },
    ],
    image: "/images/projects/umis.png",
  },
  {
    slug: "tnsso",
    name: "TNSSO",
    description:
      "Log in once to access all Tamil Nadu government services. A single verified credential gives citizens secure access to multiple G2C applications.",
    stats: [
      { value: 9, suffix: "", label: "Applications Integrated" },
    ],
    ctas: [{ label: "Know more", href: "/projects/tnsso" }],
    image: "/images/projects/tnsso.png",
    badge: "MeitY Approved",
  },
  {
    slug: "e-office",
    name: "e-Office",
    description:
      "A digital workflow and file management platform enabling government departments to process files, approvals and communications electronically.",
    stats: [
      { value: 128243, suffix: "", label: "Daily Users" },
      { value: 80, suffix: "%", label: "State Penetration" },
    ],
    ctas: [
      { label: "Login to Portal", href: "/projects/e-office" },
      { label: "Know more", href: "/projects/e-office" },
    ],
    image: "/images/projects/e-office.png",
  },
];

// Only the Additional Chief Secretary + CEO are confirmed so far; remaining
// board members are omitted until their names/designations/photos are final
// (per policy: don't fabricate placeholder board members).
export const leadership = [
  {
    name: "Thiru Pradeep Yadav, IAS",
    designation: "Additional Chief Secretary",
    department: "IT & Digital Services Department, GoTN",
    photo: "/images/leaders/pradeep-yadav.png",
  },
  {
    name: "Dr. K.P. Karthikeyan, IAS",
    designation: "Chief Executive Officer",
    department: "Tamil Nadu e-Governance Agency (TNeGA)",
    photo: pexelsPhoto(STOCK.presentation, 320, 320),
  },
];

// `image` is deliberately optional — an announcement is often just a
// short text update (a helpline change, a policy note) with nothing to
// photograph, and forcing a stock photo onto those reads as filler. Cards
// that render this list handle both shapes: image + heading + description
// when present, heading + description alone when it isn't.
export type Announcement = {
  timestamp: string;
  heading: string;
  description: string;
  href: string;
  image?: string;
};

export const announcements: Announcement[] = [
  {
    timestamp: "29 May 2025",
    heading: "SimpleGov launched by Hon'ble Chief Minister",
    description:
      "10 government services made paperless, online and instant under the new SimpleGov initiative.",
    href: "/notifications/announcements/simplegov-launch",
    image: pexelsPhoto(STOCK.handshakeLeaders, 320, 320),
  },
  {
    timestamp: "08 Jan 2026",
    heading: "Namma Arasu WhatsApp governance goes live",
    description:
      "51 government services now accessible on WhatsApp at 7845252525 across 16 departments.",
    href: "/notifications/announcements/namma-arasu-live",
    image: pexelsPhoto(STOCK.womanPhone, 320, 320),
  },
  {
    timestamp: "12 Jun 2025",
    heading: "CM Award for e-Governance Students",
    description: "Applications now open for the annual CM Award recognising student innovation in e-governance.",
    href: "/notifications/announcements/cm-award",
    image: pexelsPhoto(STOCK.presentation, 320, 320),
  },
  {
    timestamp: "02 Feb 2026",
    heading: "e-Sevai helpline expands support hours",
    description: "1800-42-56000 now available with extended hours to assist citizens across the state.",
    href: "/notifications/announcements/e-sevai-helpline",
    // No image — a text-only helpline update, deliberately the
    // demonstration case for a card with no photo.
  },
];

// Real photography not yet supplied — real, content-appropriate curated
// stock photos stand in (see lib/stock-photos.ts), matching each caption's
// actual subject rather than a random image.
export const gallery = [
  { caption: "e-Sevai centre serving citizens in Chennai", image: pexelsPhoto(STOCK.ruralWomanPhone, 800, 450) },
  { caption: "Namma Arasu WhatsApp governance launch", image: pexelsPhoto(STOCK.womanPhone, 800, 450) },
  { caption: "TNeGA leadership at the SimpleGov launch event", image: pexelsPhoto(STOCK.handshakeLeaders, 800, 450) },
  { caption: "Students accessing UMIS at a state university", image: pexelsPhoto(STOCK.studentLaptop, 800, 450) },
  { caption: "TN GIS field survey and mapping", image: pexelsPhoto(STOCK.networkRack, 800, 450) },
  { caption: "e-Office rollout training session", image: pexelsPhoto(STOCK.workshopGroup, 800, 450) },
];

// Each platform card auto-rotates through posts fetched from
// /api/social/<platform> (server-side, currently seed data — see
// src/lib/social-seed-data.ts and the route handlers for the real-API
// swap-in point). Only platform metadata lives here.
export const socialMedia = [
  {
    platform: "Facebook",
    apiPath: "/api/social/facebook",
    href: "https://www.facebook.com/tnegaofficial",
    followLabel: "Follow on Facebook",
  },
  {
    platform: "X",
    apiPath: "/api/social/x",
    href: "https://twitter.com/TNeGA_Official",
    followLabel: "Follow on X",
  },
  {
    platform: "Instagram",
    apiPath: "/api/social/instagram",
    href: "https://instagram.com/tnegaofficial",
    followLabel: "Follow on Instagram",
  },
  {
    platform: "LinkedIn",
    apiPath: "/api/social/linkedin",
    href: "https://www.linkedin.com/company/tnega/",
    followLabel: "Follow on LinkedIn",
  },
  {
    platform: "YouTube",
    apiPath: "/api/social/youtube",
    href: "https://www.youtube.com/@tnega",
    followLabel: "Subscribe on YouTube",
  },
] as const;

export const ecosystem = [
  { name: "TNeGA", href: "https://www.tnega.tn.gov.in", logo: "/images/logos/tnega.png" },
  { name: "ELCOT", href: "https://www.elcot.in", logo: "/images/logos/elcot.png" },
  { name: "Tamil Virtual Academy", href: "https://www.tamilvu.org", logo: "/images/logos/tamil-virtual-academy.png" },
  { name: "ICT Academy", href: "https://www.ictacademy.in", logo: "/images/logos/ict-academy.png" },
  { name: "TACTV", href: "https://www.tactv.in", logo: "/images/logos/tactv.png" },
  { name: "TANFINET", href: "https://www.tanfinet.tn.gov.in", logo: "/images/logos/tanfinet.png" },
  { name: "iTNT Hub", href: "https://www.itnthub.in", logo: "/images/logos/itnt-hub.png" },
];

// footer used to live here — it's now the "footer-content" Payload
// global (see lib/cms/footer.ts), fetched by the Footer server wrapper
// component and passed down to FooterClient.tsx.

