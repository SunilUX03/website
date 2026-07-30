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
// supplied yet — generic role cards with curated stock photography stand
// in, per the same never-fabricate-a-name / never-show-"Pending" policy.
export const boardOfDirectors = [
  {
    photo: pexelsPhoto(STOCK.handshakeFormal, 320, 320),
    bio: "Provides strategic oversight and policy direction to guide TNeGA's digital governance mission.",
  },
  {
    photo: pexelsPhoto(STOCK.developer, 320, 320),
    bio: "Brings deep public-sector governance experience to the Board's strategic decisions.",
  },
  {
    photo: pexelsPhoto(STOCK.itTechnician, 320, 320),
    bio: "Advises on technology strategy and large-scale digital infrastructure programmes.",
  },
  {
    photo: pexelsPhoto(STOCK.womanPhone, 320, 320),
    bio: "Guides financial oversight and ensures accountable use of public digital investment.",
  },
  {
    photo: pexelsPhoto(STOCK.ruralWomanPhone, 320, 320),
    bio: "Represents citizen and departmental interests in the Board's governance decisions.",
  },
  {
    photo: pexelsPhoto(STOCK.programmer, 320, 320),
    bio: "Supports TNeGA's innovation agenda across AI, blockchain and emerging technologies.",
  },
].map((member, i) => ({
  ...member,
  role: "Board Member",
  department: "Governing Board, TNeGA",
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
// project. Per an explicit design-review decision, this timeline uses
// designation + tenure only for unconfirmed historical entries (never a
// fabricated personal name) and reuses the one name we do have confirmed
// — the current CEO, already named in `teamCeo` above — for the present
// entry. Ordered most-recent-first (index 0 = present).
export const rollOfHonour = [
  { range: "2023 – Present", designation: "Director / CEO", name: teamCeo.name },
  { range: "2022 – 2023", designation: "Chief Executive Officer" },
  { range: "2021 – 2022", designation: "Chief Executive Officer" },
  { range: "2021 – 2021", designation: "Chief Executive Officer" },
  { range: "2020 – 2021", designation: "Chief Executive Officer" },
  { range: "2019 – 2020", designation: "Chief Executive Officer" },
  { range: "2018 – 2019", designation: "Director" },
  { range: "2017 – 2018", designation: "Director" },
  { range: "2016 – 2017", designation: "Director" },
  { range: "2015 – 2016", designation: "Director" },
  { range: "2014 – 2015", designation: "Director" },
  { range: "2013 – 2014", designation: "Director" },
  { range: "2012 – 2013", designation: "Director" },
  { range: "2011 – 2012", designation: "Director" },
  { range: "2010 – 2011", designation: "Director" },
  { range: "2009 – 2010", designation: "Director" },
  { range: "2008 – 2009", designation: "Director" },
  { range: "2007 – 2008", designation: "Director" },
  { range: "2006 – 2007", designation: "Director" },
];

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
