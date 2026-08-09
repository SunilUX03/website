// Content for the Careers page, ported from the standalone HTML
// prototype (src_careers.html).
//
// The openings themselves now live in the CMS (see
// lib/cms/job-openings.ts), not here — this file only keeps the static
// hero copy, the note under the listing, the application steps and the
// role dropdown for the application form. That form posts to the
// existing Prisma-backed Careers system (/admin/careers), a separate,
// already-working pipeline this CMS work deliberately leaves alone —
// so roleOptions stays a hand-kept list rather than being derived from
// the CMS openings, to avoid coupling the two systems.
//
// jdHref on a CMS opening points at /public/documents/careers/<slug>.pdf
// — Next.js serves anything under /public as a static file at that same
// path, so dropping a real JD PDF at that exact filename is the only
// step needed to make an opening's "Download JD" link work; no code
// change required. Leave it blank on an opening to hide the button.

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
