// Content for the Careers page, ported from the standalone HTML
// prototype (src_careers.html).
//
// jdHref points at /public/documents/careers/<slug>.pdf — Next.js serves
// anything under /public as a static file at that same path, so dropping
// a real JD PDF at that exact filename is the only step needed to make an
// opening's "Download JD" link work; no code change required. The
// openings themselves are still placeholder/demo entries pending real
// postings.
//
// The application form has no backend at all — see the note in
// components/careers/ApplicationForm.tsx. That's a separate, more urgent
// gap than these static JD files: submitting the form today doesn't send
// a candidate's details or resume anywhere, it only fakes a success
// message client-side.

export const hero = {
  eyebrow: "Join Us",
  heading: "Build Tamil Nadu's Digital Future",
  body: "At TNeGA, your work doesn't just run on servers, it runs on the lives of millions of Tamil Nadu citizens. Join a team that builds real technology for real governance challenges at a scale very few organisations in the country can match.",
  cta: { label: "View Openings", href: "#openings" },
  orbs: [
    { color: "mint", className: "-left-20 -top-32 h-[440px] w-[440px]" },
    { color: "peach", className: "-bottom-16 right-[80px] h-[360px] w-[360px]" },
  ] as const,
};

export type JobOpening = {
  role: string;
  type: string;
  department: string;
  deadline: string;
  jdHref: string;
};

export const openings: JobOpening[] = [
  {
    role: "Project Manager, e-Governance",
    type: "Contract",
    department: "IT Consultancy & Project Management",
    deadline: "31 July 2026",
    jdHref: "/documents/careers/project-manager-e-governance.pdf",
  },
  {
    role: "Data Analyst",
    type: "Contract",
    department: "State Family Database (SFDB)",
    deadline: "31 July 2026",
    jdHref: "/documents/careers/data-analyst.pdf",
  },
  {
    role: "GIS Specialist",
    type: "Contract",
    department: "TNGIS (Tamil Nadu GIS)",
    deadline: "15 August 2026",
    jdHref: "/documents/careers/gis-specialist.pdf",
  },
  {
    role: "AI / ML Engineer",
    type: "Contract",
    department: "AI Centre of Excellence",
    deadline: "15 August 2026",
    jdHref: "/documents/careers/ai-ml-engineer.pdf",
  },
  {
    role: "Software Security Analyst",
    type: "Contract",
    department: "IT Security Audit",
    deadline: "20 August 2026",
    jdHref: "/documents/careers/software-security-analyst.pdf",
  },
];

export const openingsNote = "All positions are contractual. TNeGA is an equal opportunity employer.";

export type ApplicationStep = {
  number: string;
  title: string;
  description: string;
};

export const applicationSteps: ApplicationStep[] = [
  {
    number: "01",
    title: "Fill the Application Form",
    description: "Complete the online application form below with your personal details, role preference and resume.",
  },
  {
    number: "02",
    title: "HR Screening",
    description: "Our HR team reviews your application and screens candidates based on the role requirements and qualifications.",
  },
  {
    number: "03",
    title: "Interview",
    description: "Shortlisted candidates will be contacted and their interview will be scheduled at a convenient time.",
  },
  {
    number: "04",
    title: "Offer Letter",
    description: "Finalised candidates receive their official offer letter completing the selection process.",
  },
];

/** Options for the "Role Applied For" select on the application form. */
export const roleOptions = [
  { value: "", label: "Select a role" },
  { value: "pm", label: "Project Manager, e-Governance" },
  { value: "da", label: "Data Analyst" },
  { value: "gis", label: "GIS Specialist" },
  { value: "aiml", label: "AI / ML Engineer" },
  { value: "ssa", label: "Software Security Analyst" },
];
