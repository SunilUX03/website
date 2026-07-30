// Centralized homepage copy, pulled verbatim from the locked build spec.
// Items explicitly marked PENDING in the spec use placeholder copy tagged
// clearly below — do not treat those as final.

export const nav = {
  accessibility: {
    govLabel: "தமிழ்நாடு அரசு | Government of Tamil Nadu",
  },
  about: [
    { label: "Overview", href: "/about" },
    { label: "Leadership", href: "/about/leadership" },
    { label: "Organisation structure", href: "/about/organisation-structure" },
    { label: "Ecosystem", href: "/about/ecosystem" },
    { label: "Careers", href: "/about/careers" },
  ],
  services: [
    {
      category: "Citizen Services",
      items: [
        { label: "e-Sevai", href: "/services/citizen/e-sevai" },
        { label: "Namma Arasu", href: "/services/citizen/namma-arasu" },
        { label: "KMUT", href: "/services/citizen/kmut" },
      ],
    },
    {
      category: "Digital Services",
      items: [
        { label: "DEP / e-Gov / G2G (incl. login)", href: "/services/digital/g2g" },
        { label: "SMS", href: "/services/digital/sms" },
        { label: "e-Office", href: "/services/digital/e-office" },
        { label: "SFDB", href: "/services/digital/sfdb" },
        { label: "Software Security Audit", href: "/services/digital/security-audit" },
      ],
    },
    {
      category: "Projects",
      items: [
        { label: "UMIS", href: "/projects/umis" },
        { label: "TNSSP", href: "/projects/tnssp" },
        { label: "TNSSO", href: "/projects/tnsso" },
        { label: "TN GIS", href: "/projects/tn-gis" },
        { label: "TN Grains", href: "/projects/tn-grains" },
      ],
    },
    {
      category: "Technologies",
      items: [
        { label: "Geospatial", href: "/technologies/geospatial" },
        { label: "Blockchain", href: "/technologies/blockchain" },
        { label: "AI/ML", href: "/technologies/ai-ml" },
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
  eyebrow:
    "Directorate of e-Governance / Tamil Nadu e-Governance Agency — Information Technology and Digital Services Department, Government of Tamil Nadu",
  headline: "Powering Digital Governance in Tamil Nadu",
  description:
    "Tamil Nadu e-Governance Agency designs, builds and manages large-scale digital platforms that deliver essential government services to citizens and departments — transparently, efficiently and at scale.",
  leaders: [
    {
      name: "Thiru C. Joseph Vijay",
      title: "Hon'ble Chief Minister of Tamil Nadu",
      quote: null as string | null,
    },
    {
      name: "Dr. R. Kumar",
      title: "Hon'ble Minister of Information Technology and Digital Services",
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

export const pillars = [
  {
    title: "Citizen Access",
    description:
      "TNeGA builds digital platforms that enable citizens to access government services easily, securely and from anywhere across Tamil Nadu.",
    imageLabel: "Citizen using a digital service kiosk",
    gradient: "sky" as const,
  },
  {
    title: "Partnering with Government",
    description:
      "We partner with government departments to deliver end-to-end digital services, technology platforms and data-driven governance solutions.",
    imageLabel: "Government officials in a planning session",
    gradient: "mint" as const,
  },
  {
    title: "Innovation & Infrastructure",
    description:
      "As Tamil Nadu's digital governance agency, TNeGA leads AI, blockchain and geospatial innovation — building the infrastructure for tomorrow's governance.",
    imageLabel: "Data center / infrastructure imagery",
    gradient: "lavender" as const,
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
  },
  {
    title: "Security Audit",
    description:
      "Assess government applications for security risks and regulatory compliance through CERT-In empanelled agencies.",
  },
  {
    title: "IT Procurement",
    description:
      "End-to-end technology procurement support for government departments — transparent, standards-compliant and efficient.",
  },
  {
    title: "UX Audit",
    description:
      "Improve the usability and accessibility of government applications to ensure citizens and officers can use them with ease.",
  },
  {
    title: "Capacity Building",
    description:
      "Enable departments through ICT training, workshops, seminars and digital skill development programs statewide.",
  },
  {
    title: "AI & Emerging Tech",
    description:
      "Lead Tamil Nadu's adoption of AI, blockchain, GIS and IoT for next-generation governance solutions.",
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
    imageLabel: "e-Sevai centre / citizen service photo",
    gradient: "sky" as const,
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
    imageLabel: "Namma Arasu WhatsApp governance photo",
    gradient: "mint" as const,
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
    imageLabel: "TN GIS map interface photo",
    gradient: "lavender" as const,
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
    imageLabel: "Higher education / campus photo",
    gradient: "peach" as const,
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
    imageLabel: "Single sign-on portal photo",
    gradient: "rose" as const,
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
    imageLabel: "e-Office digital workflow photo",
    gradient: "sky" as const,
  },
];

// PENDING: only Additional Chief Secretary + CEO are confirmed; remaining
// board members' names/designations/photos are not yet available.
export const leadership = [
  {
    name: "Thiru Pradeep Yadav, IAS",
    title: "Additional Chief Secretary, IT & Digital Services Department, GoTN",
  },
  {
    name: "Dr. Alby John Varghese, IAS",
    title: "CEO, TNeGA",
  },
  {
    name: "PENDING — Board Member 1",
    title: "Designation to be confirmed",
    pending: true,
  },
  {
    name: "PENDING — Board Member 2",
    title: "Designation to be confirmed",
    pending: true,
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

// PENDING: gallery photo assets not yet available — placeholders below.
export const gallery = [
  { caption: "e-Sevai centre serving citizens in Chennai", gradient: "sky" as const },
  { caption: "Namma Arasu WhatsApp governance launch", gradient: "mint" as const },
  { caption: "TNeGA leadership at the SimpleGov launch event", gradient: "peach" as const },
  { caption: "Students accessing UMIS at a state university", gradient: "lavender" as const },
  { caption: "TN GIS field survey and mapping", gradient: "rose" as const },
  { caption: "e-Office rollout training session", gradient: "sky" as const },
];

export const socialMedia = [
  {
    platform: "Facebook",
    text: "TNeGA's SimpleGov initiative simplifies 10 government services — paperless, online and instant. A new era of governance begins.",
    date: "29 May 2025",
    href: "https://www.facebook.com/TNeGovernance",
    followLabel: "Follow on Facebook",
    gradient: "sky" as const,
  },
  {
    platform: "X",
    text: "Namma Arasu is live! Access 51 government services on WhatsApp at 7845252525. Governance at your fingertips.",
    date: "08 Jan 2026",
    href: "https://x.com/tnega",
    followLabel: "Follow on X",
    gradient: "mint" as const,
  },
  {
    platform: "YouTube",
    text: "Watch: Chief Minister launches SimpleGov — Tamil Nadu's landmark digital governance reform initiative.",
    date: "29 May 2025",
    href: "https://www.youtube.com/@tnega",
    followLabel: "Subscribe on YouTube",
    gradient: "lavender" as const,
  },
];

export const ecosystem = [
  { name: "TNeGA", href: "https://www.tnega.tn.gov.in" },
  { name: "ELCOT", href: "https://www.elcot.in" },
  { name: "Tamil Virtual Academy", href: "https://www.tamilvu.org" },
  { name: "ICT Academy", href: "https://www.ictacademy.in" },
  { name: "TACTV", href: "https://www.tactv.in" },
  { name: "TANFINET", href: "https://www.tanfinet.tn.gov.in" },
  { name: "iTNT Hub", href: "https://www.itnthub.in" },
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
