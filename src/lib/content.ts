// Centralized homepage copy, pulled verbatim from the locked build spec.
// Content still pending final approval uses real, content-appropriate
// curated stock photography (see lib/stock-photos.ts) or is omitted
// outright — never a visible "pending" label — per the asset policy in
// the build spec. See inline notes below.

import { pexelsPhoto, STOCK } from "./stock-photos";

export const nav = {
  accessibility: {
    govLabel: "தமிழ்நாடு அரசு | Government of Tamil Nadu",
  },
  about: [
    { label: "Overview", href: "/about" },
    { label: "Leadership", href: "/about#leadership" },
    { label: "Organisation structure", href: "/about#organisation-structure" },
    { label: "Careers", href: "/about/careers" },
  ],
  // Mirrors the 3-section model on /services: just the 3 sections
  // themselves as direct links, not a sub-menu of individual services.
  services: [
    { label: "Citizen Services", href: "/services#citizen-services" },
    { label: "Interdepartmental Projects", href: "/services#interdepartmental-projects" },
    { label: "Services", href: "/services#services" },
  ],
  notifications: {
    updates: [
      { label: "Announcements", href: "/notifications/announcements" },
      { label: "Media & Press", href: "/notifications/media-press" },
    ],
    documents: [
      { label: "RTI", href: "/notifications/rti" },
      { label: "Tenders", href: "/notifications/tenders" },
      { label: "Publications", href: "/notifications/publications" },
      { label: "Government Orders", href: "/notifications/government-orders" },
      { label: "Policies & Guidelines", href: "/notifications/policies-guidelines" },
    ],
  },
};

export const hero = {
  headline: "Powering Digital Governance in Tamil Nadu",
  description:
    "Tamil Nadu e-Governance Agency (TNeGA) is the Government of Tamil Nadu's nodal agency for digital governance, driving the State's vision of technology-enabled, citizen-centric public service delivery. TNeGA designs, develops, and implements Digital Public Infrastructure (DPI) that empowers Government departments to deliver services that are seamless, secure, transparent, and accessible.",
  leaders: [
    {
      name: "Thiru C. Joseph Vijay",
      title: "Hon'ble Chief Minister of Tamil Nadu",
      photo: "/images/leaders/cm-photo.jpg",
      quote: null as string | null,
    },
    {
      name: "Dr. R. Kumar",
      title: "Hon'ble Minister of IT&DS",
      photo: "/images/leaders/it-minister-photo.jpg",
      quote: null as string | null,
    },
  ],
};

export const ticker = [
  { type: "link", text: "SimpleGov launched by Hon'ble CM on 29 May 2025 — 10 services live", href: "/notifications/announcements/simplegov-launch" },
  { type: "cta", text: "Namma Arasu WhatsApp governance — 51 services on 7845252525", ctaLabel: "Message Now", href: "/services/citizen/namma-arasu" },
  { type: "link", text: "CM Award for e-Governance Students — Applications open", href: "/notifications/announcements/cm-award" },
  { type: "cta", text: "e-Sevai Helpline: 1800-42-56000", ctaLabel: "Call now", href: "tel:1800-42-56000" },
] as const;

/**
 * The three "Enabling Digital Governance" bands on Home. Each pairs a
 * standing description with a carousel of projects.
 *
 * `itemNames` reference entries in services-content.ts by name rather than
 * duplicating their copy — every card here is the same card shown on
 * /services, so stats and descriptions can never drift between the two
 * pages. Names are resolved at render (see getServiceItemsByNames), which
 * throws on a typo instead of silently dropping a card. UMIS appears under
 * both Citizen Services and Interdepartmental Projects by design — it is
 * genuinely both.
 */
export const pillars = [
  {
    title: "Citizen Services",
    description:
      "TNeGA delivers citizen-centric digital services through secure and accessible platforms, making Government services faster, simpler, and more convenient.",
    href: "/services#citizen-services",
    linkLabel: "View all Citizen Services",
    itemNames: ["e-Sevai Portal", "Namma Arasu", "TNSSP", "e-Gazette Portal", "UMIS"],
  },
  {
    title: "Interdepartmental Projects",
    description:
      "TNeGA collaborates with Government departments to design, develop, and implement digital solutions that improve governance and service delivery.",
    href: "/services#interdepartmental-projects",
    linkLabel: "View all Interdepartmental Projects",
    itemNames: [
      "TNGIS Tamil Nilam",
      "UMIS",
      "GRAINS",
      "e-Office",
      "Interdepartmental Technical Consulting",
    ],
  },
  {
    title: "Services",
    description:
      "TNeGA provides shared digital services including digital identity, DBT, e-Sign, cybersecurity, and technology consulting to support e-Governance across Tamil Nadu.",
    href: "/services#services",
    linkLabel: "View all Services",
    itemNames: [
      "Nambikkai Inaiyam",
      "DBT",
      "TNSSO",
      "e-Sign",
      "SMS & WhatsApp Gateway",
      "IT Security Audit Framework",
    ],
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
      "Get government services directly on WhatsApp. Message 7845252525 to access 51 services across 16 departments — in Tamil or English, anytime, anywhere.",
    stats: [
      { value: 51, suffix: "", label: "Services" },
      { value: 16, suffix: "", label: "Departments" },
    ],
    ctas: [
      { label: "Message Now", href: "https://wa.me/917845252525" },
      { label: "Know more", href: "/projects/namma-arasu" },
    ],
    image: "/images/projects/namma-arasu.png",
  },
  {
    slug: "tn-gis",
    name: "TN GIS",
    description:
      "Click anywhere on the map to get land parcel details, ownership records, guideline values, nearest hospitals, schools and ration shops — all in one place.",
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
      "A single platform for all higher education institutions in Tamil Nadu — maintaining student information, courses and university data integrated with scholarship portals.",
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

export const announcements = [
  {
    timestamp: "29 May 2025",
    heading: "SimpleGov launched by Hon'ble Chief Minister",
    description:
      "10 government services made paperless, online and instant under the new SimpleGov initiative.",
    href: "/notifications/announcements/simplegov-launch",
  },
  {
    timestamp: "08 Jan 2026",
    heading: "Namma Arasu WhatsApp governance goes live",
    description:
      "51 government services now accessible on WhatsApp at 7845252525 across 16 departments.",
    href: "/notifications/announcements/namma-arasu-live",
  },
  {
    timestamp: "12 Jun 2025",
    heading: "CM Award for e-Governance Students",
    description: "Applications now open for the annual CM Award recognising student innovation in e-governance.",
    href: "/notifications/announcements/cm-award",
  },
  {
    timestamp: "02 Feb 2026",
    heading: "e-Sevai helpline expands support hours",
    description: "1800-42-56000 now available with extended hours to assist citizens across the state.",
    href: "/notifications/announcements/e-sevai-helpline",
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

export const footer = {
  description: "Powering Digital Governance in Tamil Nadu",
  address:
    "2nd & 7th Floor, PT Lee Chengalvarayan Naicker Building, 807, Anna Salai, Chennai — 600 002",
  // Same address as above, used to build a Google Maps "View Directions" link.
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "PT Lee Chengalvarayan Naicker Building, 807, Anna Salai, Chennai 600002"
    ),
  phone: "044-4016 4900",
  email: "tnega@tn.gov.in",
  // Same platforms as socialMedia below — kept as a separate list since the
  // footer only needs name + href, not the full apiPath/followLabel shape
  // the homepage social cards use.
  socialLinks: [
    { label: "Facebook", href: "https://www.facebook.com/tnegaofficial" },
    { label: "X", href: "https://twitter.com/TNeGA_Official" },
    { label: "Instagram", href: "https://instagram.com/tnegaofficial" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/tnega/" },
    { label: "YouTube", href: "https://www.youtube.com/@tnega" },
  ],
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Notifications", href: "/notifications" },
    { label: "Careers", href: "/about/careers" },
    { label: "RTI", href: "/notifications/rti" },
  ],
  citizenServices: [
    { label: "e-Sevai", href: "/services/citizen/e-sevai" },
    { label: "Namma Arasu", href: "/services/citizen/namma-arasu" },
    { label: "TN GIS", href: "/projects/tn-gis" },
    { label: "UMIS", href: "/projects/umis" },
  ],
  // Replaces the footer's old "Ecosystem" logo grid column.
  helpSupport: [
    { label: "Help", href: "/help" },
    { label: "Feedback", href: "/feedback" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "Contact Us", href: "/reach-us" },
    { label: "Site Map", href: "/sitemap" },
  ],
};
