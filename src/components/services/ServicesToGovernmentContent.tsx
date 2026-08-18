import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ServicesToGovernmentGraphic } from "@/components/heroes/ServicesToGovernmentGraphic";

const heroOrbs = [
  { color: "sky", className: "-left-20 -top-24 h-[420px] w-[420px]" },
  { color: "peach", className: "-bottom-16 right-[60px] h-[360px] w-[360px]" },
] as const;

type Service = {
  id: string;
  name: string;
  description: string;
};

const services: Service[] = [
  {
    id: "software-development-procurement",
    name: "Software Development / Procurement",
    description:
      "Software development and IT hardware/software procurement support for Government Departments.",
  },
  {
    id: "security-audit",
    name: "IT Security Audit",
    description:
      "Mandatory IT security audits for Government websites, apps, APIs and cloud applications through CERT-In empanelled agencies.",
  },
  {
    id: "sms-whatsapp-gateway",
    name: "SMS / WhatsApp Gateway",
    description:
      "Centralized SMS and WhatsApp Gateway services enabling Government Departments to communicate with citizens efficiently and at scale.",
  },
  {
    id: "aadhaar-services",
    name: "Aadhaar Services",
    description:
      "Aadhaar-based authentication and e-KYC services for Government Departments, delivered as the State's designated Authentication User Agency (AUA) and KYC User Agency (KUA).",
  },
];

// Department groupings and phone numbers sourced from ELCOT's own
// contact listing (elcotangadi.tn.gov.in/it-hardware-procurement.html),
// where each group is assigned a shared "Client Relationship Manager"
// (CRM I-VI) rather than an individually named contact per department.
// Per feedback, relabeled here as "Project Manager" (PM I-VI) with a
// tnega.in email per group instead of ELCOT's own domain. Sorted
// alphabetically by department.
type DepartmentContact = {
  department: string;
  contact: string;
  email: string;
  phone: string;
};

const departmentContacts: DepartmentContact[] = [
  { department: "Adi Dravidar and Tribal Welfare Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Agriculture & Farmers Welfare Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Animal Husbandry, Dairying, Fisheries and Fishermen Welfare Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "BC, MBC & Minorities Welfare Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Commercial Taxes and Registration Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Co-operation, Food and Consumer Protection Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Energy Department", contact: "PM I", email: "pm1@tnega.in", phone: "78248 59001" },
  { department: "Environment, Climate Change and Forests Department", contact: "PM II", email: "pm2@tnega.in", phone: "78248 59002" },
  { department: "Finance Department", contact: "PM II", email: "pm2@tnega.in", phone: "78248 59002" },
  { department: "Handlooms, Handicrafts, Textiles and Khadi Department", contact: "PM II", email: "pm2@tnega.in", phone: "78248 59002" },
  { department: "Health and Family Welfare Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Higher Education Department", contact: "PM II", email: "pm2@tnega.in", phone: "78248 59002" },
  { department: "Highways and Minor Ports Department", contact: "PM II", email: "pm2@tnega.in", phone: "78248 59002" },
  { department: "Home, Prohibition and Excise Department – High Court", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Home, Prohibition and Excise Department – Police", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Housing and Urban Development Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Human Resources Management Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Industries, Investment Promotion & Commerce Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Information Technology and Digital Services Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Labour Welfare and Skill Development Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Law Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Legislative Assembly Department", contact: "PM III", email: "pm3@tnega.in", phone: "78248 59003" },
  { department: "Micro, Small and Medium Enterprises Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Mudhalvarin Mugavari Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Municipal Administration and Water Supply Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Natural Resources Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Planning, Development and Special Initiatives Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Public Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Public (Elections) Department", contact: "PM IV", email: "pm4@tnega.in", phone: "73388 59004" },
  { department: "Public Works Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Revenue and Disaster Management Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Rural Development and Panchayat Raj Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "School Education Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Social Reforms Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Social Welfare and Women Empowerment Department", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Special Programme Implementation", contact: "PM V", email: "pm5@tnega.in", phone: "73387 34005" },
  { department: "Tamil Development and Information Department", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Tourism, Culture and Religious Endowments Department", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Transport Department", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Water Resources Department", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Welfare of Differently Abled Persons", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
  { department: "Youth Welfare and Sports Development Department", contact: "PM VI", email: "pm6@tnega.in", phone: "73388 59006" },
];

/** The full Services to Government page content (hero, 4 services,
 * department table) — shared between the standalone /services-to-government
 * page and the "Services to Government" tab on /services, so the two
 * never drift apart. `heroId` defaults to "services-to-government" (the
 * tab-embedded case); the standalone page overrides it to "main-content"
 * to keep the skip-to-content link's target on the page's own hero. */
export function ServicesToGovernmentContent({ heroId = "services-to-government" }: { heroId?: string }) {
  return (
    <>
      <PageHero
        id={heroId}
        eyebrow="For Government Departments"
        heading="Services to Government"
        body="TNeGA provides shared technology services for Government Departments: software development, security audits, citizen communication gateways, and Aadhaar-based authentication, each backed by a dedicated department contact."
        cta={{ label: "Raise a Ticket", href: "#" }}
        orbs={heroOrbs}
        graphic={<ServicesToGovernmentGraphic />}
      />

      {/* The 4 services */}
      <section className="bg-canvas-soft">
        <Container className="py-xxl md:py-section">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.id} id={service.id} className="card-feature scroll-mt-28">
                <p className="type-title-sm mb-2 text-ink">{service.name}</p>
                <p className="type-body-sm text-[var(--color-body)]">{service.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Department contacts */}
      <section className="bg-canvas">
        <Container className="py-xxl md:py-section">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Contact for departments</p>
              <h2 className="type-display-sm mb-2 text-ink">Whom to reach out</h2>
              <p className="type-body-sm max-w-[64ch] text-[var(--color-muted)]">
                Each Government Department is assigned a Project Manager (PM) at TNeGA. Contact them directly,
                or raise a ticket here.
              </p>
            </div>
            <a href="#" className="type-button btn-primary shrink-0">
              Raise a Ticket
            </a>
          </div>

          {/* Desktop/tablet: a real table. Mobile: a horizontally-
              scrolling 4-column table is awkward to use on a phone —
              below md, this becomes a stacked list of cards instead,
              one per department, so everything reads top-to-bottom
              with no sideways scrolling. */}
          <div className="hidden overflow-x-auto rounded-xl border border-hairline md:block">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline bg-canvas-soft">
                  <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">S.No</th>
                  <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">Department</th>
                  <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">Contact</th>
                  <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">Email</th>
                  <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">Phone</th>
                </tr>
              </thead>
              <tbody>
                {departmentContacts.map((row, i) => (
                  <tr key={row.department} className="border-b border-hairline last:border-0 hover:bg-canvas-soft">
                    <td className="type-body-sm px-5 py-3 text-[var(--color-muted)]">{i + 1}</td>
                    <td className="type-body-sm px-5 py-3 text-ink">{row.department}</td>
                    <td className="type-body-sm px-5 py-3 text-[var(--color-body)]">{row.contact}</td>
                    <td className="px-5 py-3">
                      <a href={`mailto:${row.email}`} className="type-body-sm text-[var(--color-primary-blue)] hover:underline">
                        {row.email}
                      </a>
                    </td>
                    <td className="px-5 py-3">
                      <a href={`tel:${row.phone.replace(/\s/g, "")}`} className="type-body-sm text-[var(--color-primary-blue)] hover:underline">
                        {row.phone}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {departmentContacts.map((row, i) => (
              <div key={row.department} className="rounded-xl border border-hairline p-4">
                <p className="type-body-strong mb-2 text-ink">{i + 1}. {row.department}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="type-caption text-[var(--color-muted)]">{row.contact}</span>
                  <a href={`mailto:${row.email}`} className="type-caption text-[var(--color-primary-blue)] hover:underline">
                    {row.email}
                  </a>
                  <a href={`tel:${row.phone.replace(/\s/g, "")}`} className="type-caption text-[var(--color-primary-blue)] hover:underline">
                    {row.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
