// Centralized copy for the /about page. Where the build spec explicitly
// flags content as not-yet-supplied (Board of Directors, most Leadership &
// Team names, Roll of Honour names before the current CEO), this file uses
// honest role/designation-only placeholders or curated stock photography —
// never a visible "Pending" label — matching the policy already applied to
// content.ts on the Home page.

import { pexelsPhoto, STOCK } from "./stock-photos";

export const aboutHero = {
  eyebrow: "Who We Are",
  headline: "Tamil Nadu's Chief Technology & Innovation Organisation",
  description:
    "Tamil Nadu e-Governance Agency is the State Nodal Agency for all e-Governance initiatives of the Government of Tamil Nadu — driving digital transformation that makes public services transparent, efficient and accessible to every citizen.",
};

export const whoWeAre = {
  heading: "Who We Are",
  paragraph:
    "Tamil Nadu e-Governance Agency (TNeGA) is the State Nodal Agency for all e-Governance initiatives of the Government of Tamil Nadu. Established under the Information Technology & Digital Services Department, TNeGA drives the digital transformation of governance — making public services transparent, efficient and accessible to every citizen across the state.",
};

export const hierarchy = [
  { label: "IT & Digital Services Department", emphasized: false },
  { label: "Directorate of e-Governance", emphasized: false },
  { label: "Tamil Nadu e-Governance Agency", emphasized: true },
];

export const visionMission = [
  {
    label: "Vision",
    title: "Good Governance Through Technology.",
    description:
      "To fulfill the vision of Good Governance using information technology — making work within Government transparent and efficient, with concomitant transparency and efficiency in delivery of services to citizens.",
  },
  {
    label: "Mission",
    title: "Improving Quality of Life.",
    description:
      "To improve the quality of life of citizens through efficient delivery of Government services using information technology, and to create cost-effective, scalable solutions for governance — making full use of Blockchain, AI/ML, IoT, Drones, Data Analytics, and AR/VR.",
  },
];

export const whatWeDo = [
  {
    title: "Technology Backbone",
    description:
      "Lead technology planning, implementation and innovation for every Government institution in Tamil Nadu.",
    image: pexelsPhoto(STOCK.serverRacks, 300, 300),
  },
  {
    title: "Paperless Governance",
    description:
      "Transform every government institution to be hassle-free, transparent and free of physical touchpoints — from the Secretariat to the last mile.",
    image: pexelsPhoto(STOCK.officeBuilding, 300, 300),
  },
  {
    title: "Force Multiplier",
    description:
      "Build shared digital infrastructure that departments can plug into — reducing cost, time and duplication across government.",
    image: pexelsPhoto(STOCK.networkRack, 300, 300),
  },
  {
    title: "Innovation Ecosystem",
    description:
      "Engage academic institutions, startups, NGOs and international organisations to co-create solutions for real governance challenges.",
    image: pexelsPhoto(STOCK.workshopGroup, 300, 300),
  },
  {
    title: "Capacity Building",
    description:
      "Train government employees in ICT, conduct workshops and seminars, and publish research at national and international forums.",
    image: pexelsPhoto(STOCK.presentation, 300, 300),
  },
  {
    title: "Data-Driven Governance",
    description:
      "Build systems that ensure correct benefits reach the correct person — through clean, integrated and secure data across departments.",
    image: pexelsPhoto(STOCK.itTechnician, 300, 300),
  },
];

// Positioned on concentric rings by founding year — earliest (innermost)
// to most recent (outermost) — around the parent department at the center.
export const ecosystemRings = [
  {
    name: "ELCOT",
    year: 1977,
    description:
      "Electronics Corporation of Tamil Nadu — the state's pioneering IT infrastructure and hardware/software procurement agency.",
  },
  {
    name: "Tamil Virtual Academy",
    year: 2001,
    description:
      "Delivers Tamil language and culture education online to the global Tamil diaspora.",
  },
  {
    name: "TNeGA",
    year: 2007,
    description:
      "The State Nodal Agency for e-Governance, coordinating digital transformation across every department.",
  },
  {
    name: "ICT Academy",
    year: 2009,
    description:
      "A not-for-profit skilling initiative building industry-ready ICT talent across Tamil Nadu's colleges.",
  },
  {
    name: "TACTV",
    year: 2011,
    description:
      "Tamil Nadu Arasu Cable TV Corporation — delivering digital cable television access statewide.",
  },
  {
    name: "TANFINET",
    year: 2018,
    description:
      "Tamil Nadu Fibernet Corporation — the state's optical fibre backbone connecting every village.",
  },
  {
    name: "iTNT Hub",
    year: 2023,
    description:
      "Tamil Nadu's innovation and startup hub, incubating deep-tech and emerging-technology ventures.",
  },
];

export const ecosystemCenter = "IT & Digital Services Department";

export const orgChart = {
  level1: "Chief Executive Officer",
  level2: [
    {
      label: "Head SeMT",
      children: [{ label: "Centre of Excellence", tags: ["Blockchain", "AI", "IoT", "Drones", "VR/AR"] }],
    },
    { label: "Joint CEO", children: [] as { label: string; tags?: string[] }[] },
    { label: "Sr. Consultants / Consultants", children: [] as { label: string; tags?: string[] }[] },
    {
      label: "Financial Advisor / Chief Accounts Officer",
      children: [{ label: "Accounts" }, { label: "Administration" }],
    },
  ],
};

// Real, confirmed CEO — reused from the Home page's leadership data.
export const teamCeo = {
  name: "Dr. Alby John Varghese, IAS",
  designation: "Director / CEO",
  photo: "/images/leaders/alby-john-varghese.png",
};

// Roles are real/structural; individual names are not yet confirmed, so
// only the designation is shown — never a fabricated name, never a
// visible "Pending" label. See the design-review question resolved for
// Roll of Honour below for the same principle applied to historical data.
export const team = [
  { designation: "Joint CEO", photo: pexelsPhoto(STOCK.developer, 320, 320) },
  { designation: "Joint Director — Projects", photo: pexelsPhoto(STOCK.programmer, 320, 320) },
  { designation: "Joint Director — Operations", photo: pexelsPhoto(STOCK.itTechnician, 320, 320) },
  { designation: "Joint Director — Finance", photo: pexelsPhoto(STOCK.engineerAudit, 320, 320) },
  { designation: "Joint Director — Administration", photo: pexelsPhoto(STOCK.womanPhone, 320, 320) },
  { designation: "Deputy Collector — Administration", photo: pexelsPhoto(STOCK.ruralWomanPhone, 320, 320) },
  { designation: "System Engineer — AI & ML", photo: pexelsPhoto(STOCK.studentLaptop, 320, 320) },
  { designation: "System Engineer — GIS", photo: pexelsPhoto(STOCK.elderlyManPhone, 320, 320) },
  { designation: "System Engineer — Infrastructure", photo: pexelsPhoto(STOCK.elderlyWomanPhone, 320, 320) },
];

// Board composition (names, designations, photos, bios) has not been
// supplied yet. Per explicit feedback, this no longer invents personal-
// sounding bio text for these anonymous placeholder cards — the flip
// side just says plainly that the profile is pending, rather than
// presenting made-up biographical claims as if they were real.
export const boardOfDirectors = [
  pexelsPhoto(STOCK.handshakeFormal, 320, 320),
  pexelsPhoto(STOCK.developer, 320, 320),
  pexelsPhoto(STOCK.itTechnician, 320, 320),
  pexelsPhoto(STOCK.womanPhone, 320, 320),
  pexelsPhoto(STOCK.ruralWomanPhone, 320, 320),
  pexelsPhoto(STOCK.programmer, 320, 320),
].map((photo, i) => ({
  photo,
  role: "Board Member",
  department: "Governing Board, TNeGA",
  bio: "Full profile to be published once confirmed.",
  key: `board-${i}`,
}));

export const achievements = {
  // Direct reuse of Home's <Metrics /> component and its existing 6 stats
  // — see src/components/sections/Metrics.tsx and src/lib/content.ts.
};

export const awards = [
  {
    title: "National e-Governance Award",
    year: "2024",
    description:
      "Recognised for excellence in citizen service delivery through the e-Sevai platform across Tamil Nadu.",
    image: pexelsPhoto(STOCK.presentation, 700, 500),
  },
  {
    title: "SKOCH Digital Governance Award",
    year: "2023",
    description:
      "Awarded for the successful implementation of the Nambikkai Inaiyam blockchain platform for tamper-proof certificate verification.",
    image: pexelsPhoto(STOCK.handshakeBusiness, 700, 500),
  },
  {
    title: "CSI Nihilent e-Governance Award",
    year: "2023",
    description:
      "Recognised for the KMUT data-driven beneficiary identification — first of its kind in India.",
    image: pexelsPhoto(STOCK.attentiveGroup, 700, 500),
  },
];

// The build spec asks for 19 historical Director/CEO entries "from the
// existing About page content" — no such source exists anywhere in this
// project, and no specific tenure years for them do either. Per explicit
// feedback, this timeline shows designation only for the 18 unconfirmed
// historical entries — no fabricated personal name AND no fabricated
// date range — and reuses the one name and tenure we do have confirmed
// — the current CEO, already named in `teamCeo` above — for the present
// entry. Ordered most-recent-first (index 0 = present).
export const rollOfHonour = [
  { designation: "Director / CEO", name: teamCeo.name, range: "2023 – Present" },
  { designation: "Chief Executive Officer" },
  { designation: "Chief Executive Officer" },
  { designation: "Chief Executive Officer" },
  { designation: "Chief Executive Officer" },
  { designation: "Chief Executive Officer" },
  { designation: "Director" },
  { designation: "Director" },
  { designation: "Director" },
  { designation: "Director" },
  { designation: "Director" },
  { designation: "Director" },
  { designation: "Director" },
  { designation: "Director" },
  { designation: "Director" },
  { designation: "Director" },
  { designation: "Director" },
  { designation: "Director" },
  { designation: "Director" },
] as { designation: string; name?: string; range?: string }[];

export const connectWithUs = {
  email: "tnega@tn.gov.in",
  social: [
    { label: "Facebook", href: "https://www.facebook.com/TNeGovernance" },
    { label: "X", href: "https://x.com/tnega" },
    { label: "YouTube", href: "https://www.youtube.com/@tnega" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/tnega" },
    { label: "Instagram", href: "https://www.instagram.com/tnega" },
  ],
};
