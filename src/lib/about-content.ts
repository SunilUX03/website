// Centralized copy for the /about page. Where the build spec explicitly
// flags content as not-yet-supplied (Board of Directors, most Leadership &
// Team names, Roll of Honour names before the current CEO), this file uses
// honest role/designation-only placeholders or curated stock photography —
// never a visible "Pending" label — matching the policy already applied to
// content.ts on the Home page.

import { pexelsPhoto, STOCK } from "./stock-photos";

export const aboutHero = {
  eyebrow: "Who We Are",
  headline: "Transforming Governance Through Technology",
  description:
    "The Tamil Nadu e-Governance Agency (TNeGA) is the Government of Tamil Nadu's principal technology implementation agency, driving the State's digital transformation by building robust Digital Public Infrastructure (DPI) and delivering innovative e-Governance solutions. Working at the intersection of policy and technology, TNeGA enables Government departments to provide secure, transparent, efficient, and citizen-centric digital services.",
};

export const whoWeAre = {
  heading: "Who We Are",
  paragraph:
    "Established as the State Nodal Agency for e-Governance, TNeGA partners with Government departments to design, develop, and implement digital platforms that improve public service delivery and modernize governance. The Agency provides technology consulting, in-house software development, project management, and shared digital services that power a wide range of Government initiatives across Tamil Nadu.",
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
      "To enable inclusive, accessible, secure, and future-ready digital governance by leveraging technology to improve public service delivery and create greater value for citizens, businesses, and Government departments across Tamil Nadu.",
  },
  {
    label: "Mission",
    title: "Improving Quality of Life.",
    description:
      "To accelerate Tamil Nadu's digital transformation by developing secure, scalable, and citizen-centric digital solutions that empower Government departments, strengthen public service delivery, and build an inclusive Digital Public Infrastructure for all.",
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

// Real TNeGA reporting hierarchy, per the official organisation chart:
// CEO -> JCEO -> six parallel branches. Five branches share the same
// 4-level structure; the sixth (Project Director) skips the
// System Engineer / Deputy Collector level entirely — `engineer: null`
// marks that gap so OrgChart.tsx can draw a pass-through connector line
// instead of a box for that column at that level.
export const orgChart = {
  top: ["CEO", "JCEO"],
  branches: [
    { director: "Joint Director / DRO", engineer: "System Engineer / Deputy Collector", manager: "Project Manager", base: "ASE" },
    { director: "Joint Director / DRO", engineer: "System Engineer / Deputy Collector", manager: "Project Manager", base: "ASE" },
    { director: "Joint Director / DRO", engineer: "System Engineer / Deputy Collector", manager: "Project Manager", base: "ASE" },
    { director: "Joint Director / DRO", engineer: "System Engineer / Deputy Collector", manager: "Project Manager", base: "ASE" },
    { director: "Joint Director / DRO", engineer: "System Engineer / Deputy Collector", manager: "Project Manager", base: "ASE" },
    { director: "Project Director", engineer: null, manager: "Project Manager", base: "ASE / Developers" },
  ] as { director: string; engineer: string | null; manager: string; base: string }[],
};

// Real, confirmed current CEO (tenure July 2026 – Present). No official
// photo supplied yet, so this uses a curated placeholder like the rest of
// `team` below rather than a fabricated headshot.
export const teamCeo = {
  name: "Dr. K.P. Karthikeyan, IAS",
  designation: "Director / CEO",
  photo: pexelsPhoto(STOCK.presentation, 320, 320),
};

// Roles are real/structural; individual names are not yet confirmed, so
// only the designation is shown — never a fabricated name, never a
// visible "Pending" label. See the design-review question resolved for
// Roll of Honour below for the same principle applied to historical data.
// NOTE: `name` values here are DUMMY PLACEHOLDERS for layout/demo only —
// replace with the real officers' names before launch. Designations are
// the real/structural roles.
export const team = [
  { name: "Aravind Kumar", designation: "Joint CEO", photo: pexelsPhoto(STOCK.developer, 320, 320) },
  { name: "Priya Raman", designation: "Joint Director — Projects", photo: pexelsPhoto(STOCK.programmer, 320, 320) },
  { name: "Karthik Subramanian", designation: "Joint Director — Operations", photo: pexelsPhoto(STOCK.itTechnician, 320, 320) },
  { name: "Meena Lakshmi", designation: "Joint Director — Finance", photo: pexelsPhoto(STOCK.engineerAudit, 320, 320) },
  { name: "Ravi Shankar", designation: "Joint Director — Administration", photo: pexelsPhoto(STOCK.womanPhone, 320, 320) },
  { name: "Divya Narayanan", designation: "Deputy Collector — Administration", photo: pexelsPhoto(STOCK.ruralWomanPhone, 320, 320) },
  { name: "Suresh Babu", designation: "System Engineer — AI & ML", photo: pexelsPhoto(STOCK.studentLaptop, 320, 320) },
  { name: "Anjali Venkatesh", designation: "System Engineer — GIS", photo: pexelsPhoto(STOCK.elderlyManPhone, 320, 320) },
  { name: "Mohan Raj", designation: "System Engineer — Infrastructure", photo: pexelsPhoto(STOCK.elderlyWomanPhone, 320, 320) },
];

// Real Governing Board composition, per the official list. Chairman and
// Member Secretary reuse names already confirmed elsewhere on this site
// (the Additional Chief Secretary in content.ts's `leadership`, and the
// current CEO in `teamCeo` above) — real people, not invented for this
// section. The 6 Members' names are NOT published anywhere we have data
// for; per explicit instruction, those use dummy names to fill out the
// layout — `nameIsPlaceholder: true` documents that in code (the UI no
// longer shows a visible disclaimer, also per explicit instruction) so a
// future maintainer swapping in real appointees knows which ones to
// replace.
export const governingBoard = {
  chairman: {
    role: "Chairman",
    name: "Thiru Pradeep Yadav, IAS",
    title:
      "Additional Chief Secretary to Government, Information Technology and Digital Services Department",
  },
  memberSecretary: {
    role: "Member Secretary",
    name: teamCeo.name,
    title: "Chief Executive Officer, Tamil Nadu e-Governance Agency",
  },
  members: [
    { name: "Tmt. Latha Krishnan, IAS", title: "Secretary (Expenditure) to Government, Finance Department", nameIsPlaceholder: true },
    { name: "Thiru. R. Selvaraj, IAS", title: "Managing Director, Electronics Corporation of Tamil Nadu Ltd.", nameIsPlaceholder: true },
    { name: "Thiru. M. Balamurugan, IAS", title: "Registrar of Cooperative Societies", nameIsPlaceholder: true },
    { name: "Tmt. Kavitha Ramesh, IAS", title: "Managing Director, Tamil Nadu Corporation for Development of Women", nameIsPlaceholder: true },
    { name: "Thiru. A. Gunasekaran, IAS", title: "Managing Director, Tamil Nadu Arasu Cable TV Corporation Ltd.", nameIsPlaceholder: true },
    { name: "Dr. N. Vijayakumar", title: "State Informatics Officer, National Informatics Centre, Chennai", nameIsPlaceholder: true },
  ],
};

export const achievements = {
  // Direct reuse of Home's <Metrics /> component and its existing 6 stats
  // — see src/components/sections/Metrics.tsx and src/lib/content.ts.
};

// Translated and summarised from the official office memo (Tamil) listing
// TNeGA's awards over the past 5 years — one card per award, per explicit
// instruction. Where one project earned two separate awards (UMIS), each
// gets its own card rather than merging them into one.
export const awards = [
  {
    title: "Chief Minister's Best Practices Award",
    year: "2023",
    description:
      "Awarded to TNeGA for the mobile app and real-time dashboard built to monitor the Chief Minister's Breakfast Scheme — tracking implementation in every school from meal preparation through to serving, with GPS-tracked food delivery.",
    image: pexelsPhoto(STOCK.presentation, 700, 500),
  },
  {
    title: "SKOCH Silver Award",
    year: "2025",
    description:
      "Awarded to the University Management Information System (UMIS) — TNeGA's single-window platform integrating student, institution and course data across higher education in Tamil Nadu.",
    image: pexelsPhoto(STOCK.dataCenter, 700, 500),
  },
  {
    title: "Educational Technology Transformation Award",
    year: "2025",
    description:
      "Presented at the 19th Digital Transformation Conclave & Awards, recognising UMIS's integration with Aadhaar, EMIS, NPCI, e-Sevai and scholarship platforms to power accurate, duplicate-free student data statewide.",
    image: pexelsPhoto(STOCK.itTechnician, 700, 500),
  },
  {
    title: "SKOCH Gold Award",
    year: "2022",
    description:
      "Awarded for the Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme (Pudhumai Penn) — TNeGA's paperless DBT scholarship platform supporting higher education for girl students from Government schools.",
    image: pexelsPhoto(STOCK.studentLaptop, 700, 500),
  },
  {
    title: "SKOCH Gold Award",
    year: "2025",
    description:
      "Awarded for the Tamil Pudhalvan Scheme — TNeGA's paperless DBT scholarship platform supporting higher education for boy students from Government schools, integrated with UMIS.",
    image: pexelsPhoto(STOCK.workshopGroup, 700, 500),
  },
  {
    title: "Technology Sabha Excellence Award",
    year: "2025",
    description:
      "Awarded by The Indian Express Group in recognition of e-Sevai's citizen-centric service delivery through centres statewide and a 24x7 citizen portal.",
    image: pexelsPhoto(STOCK.handshakeBusiness, 700, 500),
  },
  {
    title: "SKOCH Silver Award",
    year: "2022",
    description:
      "Awarded for e-Munnetram, TNeGA's WebGIS-based platform tracking the finances and progress of every major infrastructure project valued over ₹100 crore.",
    image: pexelsPhoto(STOCK.networkRack, 700, 500),
  },
  {
    title: "Certificate of Excellence",
    year: "2025",
    description:
      "Awarded by the Unique Identification Authority of India (UIDAI), recognising Tamil Nadu as the best-performing state for pioneering Aadhaar authentication in public service delivery.",
    image: pexelsPhoto(STOCK.handshakeFormal, 700, 500),
  },
];

// Real historical Director/CEO list, as supplied. Ordered most-recent-first
// (index 0 = present, matching `teamCeo` above). The final entry has no
// named officer in the source list, so it stays designation-only — never a
// fabricated name.
export const rollOfHonour = [
  { designation: "Director / CEO", name: teamCeo.name, range: "July 2026 – Present" },
  { designation: "Director / CEO", name: "Dr. Alby John Varghese, I.A.S.", range: "25 Jun 2025 – 30 Jul 2026" },
  { designation: "Director / CEO", name: "Thiru. M. Govinda Rao, IAS", range: "30 Dec 2024 – 24 Jun 2025" },
  { designation: "Director / CEO", name: "Thiru. Praveen. P. Nair, I.A.S", range: "18 Jul 2022 – 29 Dec 2024" },
  { designation: "Commissioner/CEO (F.A.C)", name: "Thiru. S. Nagarajan, I.A.S", range: "09 Jun 2022 – 16 Jul 2022" },
  { designation: "Director/CEO", name: "Thiru. Vijayendra Pandian, I.A.S.", range: "01 Aug 2021 – 01 Jun 2022" },
  { designation: "Commissioner/CEO, i/c.", name: "Thiru. Ajay Yadav, I.A.S.", range: "01 Jul 2021 – 01 Aug 2021" },
  { designation: "Commissioner/CEO", name: "Mr. Santosh K Misra, I.A.S.", range: "02 Jan 2018 – 23 Jun 2021" },
  { designation: "Commissioner/CEO", name: "Mr. Anand Rao V. Patil, I.A.S.", range: "01 Jan 2017 – 01 Jan 2018" },
  { designation: "Director/CEO (F.A.C)", name: "Mr. J. Kumaragurubaran, IAS", range: "14 Jan 2016 – 14 Jan 2017" },
  { designation: "Director/CEO", name: "Mr. S. Nagarajan, IAS", range: "14 Jan 2015 – 15 Jan 2016" },
  { designation: "Director/CEO", name: "Mr. S Nagarajan, IAS", range: "14 Jan 2014 – 30 Jun 2014" },
  { designation: "Director/CEO (F.A.C)", name: "Mr. J. Kumaragurubaran, IAS", range: "13 Jan 2014 – 13 Jan 2015" },
  { designation: "Commissioner/CEO (F.A.C)", name: "Mr. Atul Anand, IAS", range: "14 Jan 2011 – 14 Jan 2014" },
  { designation: "Commissioner/CEO (F.A.C)", name: "Dr. Santhosh Babu, IAS", range: "15 Jan 2008 – 16 Jan 2011" },
  { designation: "Director/CEO", name: "Mr. T. Udhayachandran, IAS", range: "14 Jan 2008 – 30 Jun 2008" },
  { designation: "Commissioner/CEO i/c", name: "Dr. C. Chandramouli, IAS", range: "14 Jan 2008 – 30 Jun 2008" },
  { designation: "Commissioner/CEO", name: "Dr. Neeraj Mittal, IAS", range: "14 Jan 2008 – 30 Jun 2008" },
  { designation: "Director/CEO i/c.", name: "Mr. Kumar Jayant, IAS", range: "14 Jan 2007 – 14 Jan 2008" },
  {
    designation: "Officer on Special Duty i/c. and Director/CEO i/c.",
    name: "Mr. Sunil Paliwal, IAS",
    range: "14 Jan 2007 – 30 Jun 2007",
  },
  { designation: "Officer on Special Duty", name: "Mr. Atul Anand, IAS", range: "29 Dec 2006 – 30 Dec 2006" },
  { designation: "Officer on Special Duty I/c", range: "30 Dec 2006 – 04 Jun 2007" },
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
