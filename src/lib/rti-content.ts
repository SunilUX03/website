// Content for the RTI page, ported from the standalone HTML prototype
// (src_rti.html).
//
// The Section 4(1)(b) disclosure table in the prototype used rowspan to
// group sub-rows under a single S.No / Item. That structure is preserved
// here as nested data — DisclosureTable renders the rowSpan from
// group.rows.length, so adding or removing a sub-row stays correct
// without hand-editing span counts.
//
// "Not Applicable" in a detail/info cell means the prototype left that
// disclosure blank.

export const hero = {
  eyebrow: "Transparency",
  heading: "Right to Information Act, 2005",
  body: "Tamil Nadu e-Governance Agency is committed to transparency and accountability. Access official disclosures, contact our Public Information Officer and file RTI requests through this page.",
  orbs: [
    { color: "sky", className: "-left-20 -top-24 h-[420px] w-[420px]" },
    { color: "lavender", className: "-bottom-16 right-[60px] h-[360px] w-[360px]" },
  ] as const,
};

export type ContactDetail = { text: string; href: string | null };

export type RtiContact = {
  badge: string;
  tone: "light" | "dark";
  name: string;
  designation: string;
  details: ContactDetail[];
};

export const contacts: RtiContact[] = [
  {
    badge: "Appellate Authority",
    tone: "light",
    name: "Tmt. K. Priya",
    designation: "Joint Director (Tech)",
    details: [
      { text: "Tamil Nadu e-Governance Agency", href: null },
      { text: "807, 2nd Floor, PT Lee Chengalvarayan Naicker Building, Anna Salai, Chennai, 600 002", href: null },
      { text: "044 4016 4900", href: "tel:04440164900" },
      { text: "tnega@tn.gov.in", href: "mailto:tnega@tn.gov.in" },
    ],
  },
  {
    badge: "Public Information Officer (PIO)",
    tone: "dark",
    name: "Thiru. S. Prabaharan",
    designation: "Deputy Collector / System Analyst / DD (Admin) i/c",
    details: [
      { text: "Tamil Nadu e-Governance Agency", href: null },
      { text: "807, 2nd Floor, PT Lee Chengalvarayan Naicker Building, Anna Salai, Chennai, 600 002", href: null },
      { text: "044 4016 4900", href: "tel:04440164900" },
      { text: "tnega@tn.gov.in", href: "mailto:tnega@tn.gov.in" },
    ],
  },
];

export type DisclosureGroup = {
  sno: string;
  item: string;
  rows: { detail: string; info: string }[];
};

export const disclosures: DisclosureGroup[] = [
  {
    sno: "1",
    item: "Particulars of its organisation, functions and duties",
    rows: [
      { detail: "(i) Name and address of the Organization", info: "Ministry of Department of IT and Digital Services Department Tamil Nadu e-Governance Agency, No. 807, 2nd & 7th Floor, P.T Lee Chengalvaraya Naicker Trust Building, Anna Salai, Chennai-02" },
      { detail: "(ii) Head of the Organisation", info: "Additional Chief Secretary to Government" },
      { detail: "(iii) Functions and duties", info: "Tamil Nadu e-Governance Agency (TNeGA) was created during the year 2007 as a Society registered under the Tamil Nadu Societies Registration Act, 1975. TNeGA enhances the quality of life of Citizens by working with various Departments to efficiently deliver Government Services through ICT tools and create cost effective, scalable solutions for Governance by making full use of Emerging Technologies." },
    ],
  },
  {
    sno: "2",
    item: "The powers and duties of its officers and employees",
    rows: [
      { detail: "Chief Executive Officer & Joint Chief Executive Officer", info: "Over all in charge of Tamil Nadu e-Governance Agency" },
      { detail: "Joint Director-05", info: "All matters related to Projects" },
      { detail: "Financial Advisor & Chief Accounts Officer", info: "All matters related to Finance and Accounts" },
      { detail: "System Engineer - 7", info: "All matters related to Projects" },
      { detail: "Deputy Director Admin (i/c)", info: "All matters related to Establishment" },
      { detail: "Program Director TN (GIS)", info: "All matters related to Projects" },
      { detail: "Head AI ML", info: "Not Applicable" },
    ],
  },
  {
    sno: "3",
    item: "Procedure followed in decision making process, including channels of supervision and accountability",
    rows: [
      { detail: "Process of decision making: identify key decision making points", info: "All decisions are taken as per approved by Competent Authority / Chairman / Secretary / Board / Government" },
    ],
  },
  {
    sno: "4",
    item: "The norms set by it for the discharge of its functions",
    rows: [
      { detail: "Not Applicable", info: "Not Applicable" },
    ],
  },
  {
    sno: "5",
    item: "The rules, regulations, instructions manual and records for discharging its functions",
    rows: [
      { detail: "Not Applicable", info: "Registered under societies Act." },
    ],
  },
  {
    sno: "6",
    item: "A statement of the categories of documents that are held by it or under its control",
    rows: [
      { detail: "Categories of documents", info: "IT & DS Department policies note" },
    ],
  },
  {
    sno: "7",
    item: "Particulars for any arrangement for consultation with or representation by the members of the public in relation to the formulation of policy or implementation there of",
    rows: [
      { detail: "Not Applicable", info: "Not Applicable" },
    ],
  },
  {
    sno: "8",
    item: "A statement of the boards, councils, committees and other bodies consisting of two or more persons constituted as its part or for the purpose of its advise, and as to whether meetings of those boards, councils, committees and other bodies",
    rows: [
      { detail: "Not Applicable", info: "The Chairman / Secretary convene(s) the Board Meeting from time to time, where the Chief Executive Officer, Tamil Nadu e-Governance Agency Other member of the Board of Directors shall be present." },
    ],
  },
  {
    sno: "9",
    item: "A directory of its officers and employees",
    rows: [
      { detail: "1. Chief Executive Officer & Joint Chief Executive Officer 2. Joint Director-04 3. Joint Registrar / Joint Director 4. Financial Advisor & Chief Accounts Officer 5. System Engineer - 5 6. Assistant Director/System Engineer -02 7. Deputy Director Admin (i/c) 8. Program Director TN (GIS) 9. Head AI ML", info: "Tamil Nadu e-Governance Agency, Chengalvaraya, Naicker Building, PT Lee, 807, 2nd & 7th floor, Anna Salai, Chennai, Tamil Nadu 600002. Contact No: 044 4016 4900. Email: mngr.tnega@tn.gov.in" },
    ],
  },
  {
    sno: "10",
    item: "The monthly remuneration received by each of the commission officers and employees, including the system of compensation as provided in its regulations",
    rows: [
      { detail: "Not Applicable", info: "As per Government norms." },
    ],
  },
  {
    sno: "11",
    item: "The budget allocated to each of its agency, indicating the particulars of all plans, proposed expenditures and reports on disbursements made",
    rows: [
      { detail: "Not Applicable", info: "Not Applicable" },
    ],
  },
  {
    sno: "12",
    item: "The manner of execution of subsidy programmes, including the amounts allocated and the details of beneficiaries of such programmes",
    rows: [
      { detail: "Not Applicable", info: "Not Applicable" },
    ],
  },
  {
    sno: "13",
    item: "The manner of execution of subsidy programmes, including the amounts allocated and the details of beneficiaries of such programmes",
    rows: [
      { detail: "Not Applicable", info: "Not Applicable" },
    ],
  },
  {
    sno: "14",
    item: "Details in respect of the information, available to or held by it, reduced in an electronic form",
    rows: [
      { detail: "Not Applicable", info: "Not Applicable" },
    ],
  },
  {
    sno: "15",
    item: "The particulars of facilities available to citizens for obtaining information, including the working hours of a library or reading room, if maintained for public use",
    rows: [
      { detail: "Not Applicable", info: "Not Applicable" },
    ],
  },
  {
    sno: "16",
    item: "The names, designations and other particulars of the public information officers",
    rows: [
      { detail: "Public Information officer, Tamil Nadu e-Governance Agency.", info: "Public Information officer, Tamil Nadu e-Governance Agency." },
    ],
  },
  {
    sno: "17",
    item: "Such other information as may be prescribed, and thereafter update these publications every year",
    rows: [
      { detail: "Not Applicable", info: "Not Applicable" },
    ],
  },
];

export const howToFile = {
  heading: "How to File an RTI",
  sub: "Citizens can file RTI requests online through the Tamil Nadu RTI portal.",
  body: "To file an RTI request with Tamil Nadu e-Governance Agency, visit the official RTI Online Portal of the Government of Tamil Nadu.",
  ctaLabel: "File RTI Online",
  ctaHref: "https://rtionline.tn.gov.in/",
  redirectNote: "You will be redirected to the Tamil Nadu RTI portal at rtionline.tn.gov.in",
  email: "tnega@tn.gov.in",
  phone: "044 4016 4900",
  phoneHref: "tel:04440164900",
};
