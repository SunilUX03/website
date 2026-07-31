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
    { label: "Ecosystem", href: "/about#ecosystem" },
    { label: "Careers", href: "/about/careers" },
  ],
  // Mirrors the 2-section model on /services (Citizen Services, and Govt
  // Digital Services = the old Digital Services + Projects + Technologies
  // categories, merged). Individual item labels link to their section on
  // that page rather than fabricated per-service routes that don't exist.
  services: [
    {
      category: "Citizen Services",
      items: [
        { label: "e-Sevai", href: "/services#citizen-services" },
        { label: "Namma Arasu", href: "/services#citizen-services" },
        { label: "UMIS", href: "/services#citizen-services" },
        { label: "TNSSO", href: "/services#citizen-services" },
        { label: "View all Citizen Services", href: "/services#citizen-services" },
      ],
    },
    {
      category: "Govt Digital Services",
      items: [
        { label: "e-Office", href: "/services#govt-digital-services" },
        { label: "TNGIS", href: "/services#govt-digital-services" },
        { label: "SFDB", href: "/services#govt-digital-services" },
        { label: "Software Security Audit", href: "/services#govt-digital-services" },
        { label: "View all Govt Digital Services", href: "/services#govt-digital-services" },
      ],
    },
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
    "Tamil Nadu e-Governance Agency designs, builds and manages large-scale digital platforms that deliver essential government services to citizens and departments — transparently, efficiently and at scale.",
  leaders: [
    {
      name: "Thiru C. Joseph Vijay",
      title: "Hon'ble Chief Minister of Tamil Nadu",
      photo: "/images/leaders/cm-photo.jpg",
      quote: null as string | null,
      role: "primary" as const,
    },
    {
      name: "Dr. R. Kumar",
      title: "Hon'ble Minister of Information Technology and Digital Services",
      photo: "/images/leaders/it-minister-photo.jpg",
      quote: null as string | null,
      role: "secondary" as const,
    },
  ],
};

export const ticker = [
  { type: "link", text: "SimpleGov launched by Hon'ble CM on 29 May 2025 — 10 services live", href: "/notifications/announcements/simplegov-launch" },
  { type: "cta", text: "Namma Arasu WhatsApp governance — 51 services on 7845252525", ctaLabel: "Message Now", href: "/services/citizen/namma-arasu" },
  { type: "link", text: "CM Award for e-Governance Students — Applications open", href: "/notifications/announcements/cm-award" },
  { type: "cta", text: "e-Sevai Helpline: 1800-42-56000", ctaLabel: "Call now", href: "tel:1800-42-56000" },
] as const;

export const pillars = [
  {
    title: "Citizen Access",
    description:
      "TNeGA builds digital platforms that enable citizens to access government services easily, securely and from anywhere across Tamil Nadu.",
    image: pexelsPhoto(STOCK.womanPhone, 800, 600),
  },
  {
    title: "Partnering with Government",
    description:
      "We partner with government departments to deliver end-to-end digital services, technology platforms and data-driven governance solutions.",
    image: pexelsPhoto(STOCK.handshakeLeaders, 800, 600),
  },
  {
    title: "Innovation & Infrastructure",
    description:
      "As Tamil Nadu's digital governance agency, TNeGA leads AI, blockchain and geospatial innovation — building the infrastructure for tomorrow's governance.",
    image: pexelsPhoto(STOCK.dataCenter, 800, 600),
  },
];

export const metrics = [
  { value: 410, prefix: "", suffix: "+", label: "E-Services available online" },
  { value: 34843, prefix: "", suffix: "", label: "e-Sevai centres statewide" },
  { value: 26250, prefix: "₹", suffix: " Cr", label: "Transferred via DBT since 2023" },
  { value: 114, prefix: "", suffix: " Lakh", label: "KMUT women beneficiaries" },
  { value: 128243, prefix: "", suffix: "", label: "Daily e-Office users" },
  { value: 29, prefix: "", suffix: " Lakh", label: "Students on UMIS" },
];

export const categories = [
  {
    title: "Software Development",
    description:
      "Design and build secure, scalable digital systems for government services and departmental platforms.",
    image: pexelsPhoto(STOCK.developer, 700, 500),
  },
  {
    title: "Security Audit",
    description:
      "Assess government applications for security risks and regulatory compliance through CERT-In empanelled agencies.",
    image: pexelsPhoto(STOCK.itTechnician, 700, 500),
  },
  {
    title: "IT Procurement",
    description:
      "End-to-end technology procurement support for government departments — transparent, standards-compliant and efficient.",
    image: pexelsPhoto(STOCK.handshakeCloseup, 700, 500),
  },
  {
    title: "UX Audit",
    description:
      "Improve the usability and accessibility of government applications to ensure citizens and officers can use them with ease.",
    image: pexelsPhoto(STOCK.attentiveGroup, 700, 500),
  },
  {
    title: "Capacity Building",
    description:
      "Enable departments through ICT training, workshops, seminars and digital skill development programs statewide.",
    image: pexelsPhoto(STOCK.workshopGroup, 700, 500),
  },
  {
    title: "AI & Emerging Tech",
    description:
      "Lead Tamil Nadu's adoption of AI, blockchain, GIS and IoT for next-generation governance solutions.",
    image: pexelsPhoto(STOCK.programmer, 700, 500),
  },
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
    name: "Dr. Alby John Varghese, IAS",
    designation: "Chief Executive Officer",
    department: "Tamil Nadu e-Governance Agency (TNeGA)",
    photo: "/images/leaders/alby-john-varghese.png",
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
    href: "https://www.facebook.com/TNeGovernance",
    followLabel: "Follow on Facebook",
  },
  {
    platform: "X",
    apiPath: "/api/social/x",
    href: "https://x.com/tnega",
    followLabel: "Follow on X",
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
  phone: "044-4016 4900",
  email: "tnega@tn.gov.in",
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
};
