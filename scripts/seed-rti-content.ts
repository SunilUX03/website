// One-off script: seeds the "rti-content" Payload global with the values
// that used to be `hero`/`contacts`/`disclosures`/`howToFile` in
// lib/rti-content.ts. Contact detail lines and disclosure sub-rows are
// flattened into the line-delimited text convention documented in
// src/globals/RtiContent.ts ("text :: href" / "detail :: info"). Always
// an update (globals always exist), safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-rti-content.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "rti-content",
    data: {
      hero: {
        eyebrow: "Transparency",
        heading: "Right to Information Act, 2005",
        body: "Tamil Nadu e-Governance Agency is committed to transparency and accountability. Access official disclosures, contact our Public Information Officer and file RTI requests through this page.",
      },
      contacts: [
        {
          badge: "Appellate Authority",
          tone: "light",
          name: "Tmt. K. Priya",
          designation: "Joint Director (Tech)",
          detailsText: [
            "Tamil Nadu e-Governance Agency",
            "807, 2nd Floor, PT Lee Chengalvarayan Naicker Building, Anna Salai, Chennai, 600 002",
            "044 4016 4900 :: tel:04440164900",
            "tnega@tn.gov.in :: mailto:tnega@tn.gov.in",
          ].join("\n"),
        },
        {
          badge: "Public Information Officer (PIO)",
          tone: "dark",
          name: "Thiru. S. Prabaharan",
          designation: "Deputy Collector / System Analyst / DD (Admin) i/c",
          detailsText: [
            "Tamil Nadu e-Governance Agency",
            "807, 2nd Floor, PT Lee Chengalvarayan Naicker Building, Anna Salai, Chennai, 600 002",
            "044 4016 4900 :: tel:04440164900",
            "tnega@tn.gov.in :: mailto:tnega@tn.gov.in",
          ].join("\n"),
        },
      ],
      disclosures: [
        {
          sno: "1",
          item: "Particulars of its organisation, functions and duties",
          rowsText: [
            "(i) Name and address of the Organization :: Ministry of Department of IT and Digital Services Department Tamil Nadu e-Governance Agency, No. 807, 2nd & 7th Floor, P.T Lee Chengalvaraya Naicker Trust Building, Anna Salai, Chennai-02",
            "(ii) Head of the Organisation :: Additional Chief Secretary to Government",
            "(iii) Functions and duties :: Tamil Nadu e-Governance Agency (TNeGA) was created during the year 2007 as a Society registered under the Tamil Nadu Societies Registration Act, 1975. TNeGA enhances the quality of life of Citizens by working with various Departments to efficiently deliver Government Services through ICT tools and create cost effective, scalable solutions for Governance by making full use of Emerging Technologies.",
          ].join("\n"),
        },
        {
          sno: "2",
          item: "The powers and duties of its officers and employees",
          rowsText: [
            "Chief Executive Officer & Joint Chief Executive Officer :: Over all in charge of Tamil Nadu e-Governance Agency",
            "Joint Director-05 :: All matters related to Projects",
            "Financial Advisor & Chief Accounts Officer :: All matters related to Finance and Accounts",
            "System Engineer - 7 :: All matters related to Projects",
            "Deputy Director Admin (i/c) :: All matters related to Establishment",
            "Program Director TN (GIS) :: All matters related to Projects",
            "Head AI ML :: Not Applicable",
          ].join("\n"),
        },
        {
          sno: "3",
          item: "Procedure followed in decision making process, including channels of supervision and accountability",
          rowsText: "Process of decision making: identify key decision making points :: All decisions are taken as per approved by Competent Authority / Chairman / Secretary / Board / Government",
        },
        {
          sno: "4",
          item: "The norms set by it for the discharge of its functions",
          rowsText: "Not Applicable :: Not Applicable",
        },
        {
          sno: "5",
          item: "The rules, regulations, instructions manual and records for discharging its functions",
          rowsText: "Not Applicable :: Registered under societies Act.",
        },
        {
          sno: "6",
          item: "A statement of the categories of documents that are held by it or under its control",
          rowsText: "Categories of documents :: IT & DS Department policies note",
        },
        {
          sno: "7",
          item: "Particulars for any arrangement for consultation with or representation by the members of the public in relation to the formulation of policy or implementation there of",
          rowsText: "Not Applicable :: Not Applicable",
        },
        {
          sno: "8",
          item: "A statement of the boards, councils, committees and other bodies consisting of two or more persons constituted as its part or for the purpose of its advise, and as to whether meetings of those boards, councils, committees and other bodies",
          rowsText: "Not Applicable :: The Chairman / Secretary convene(s) the Board Meeting from time to time, where the Chief Executive Officer, Tamil Nadu e-Governance Agency Other member of the Board of Directors shall be present.",
        },
        {
          sno: "9",
          item: "A directory of its officers and employees",
          rowsText: "1. Chief Executive Officer & Joint Chief Executive Officer 2. Joint Director-04 3. Joint Registrar / Joint Director 4. Financial Advisor & Chief Accounts Officer 5. System Engineer - 5 6. Assistant Director/System Engineer -02 7. Deputy Director Admin (i/c) 8. Program Director TN (GIS) 9. Head AI ML :: Tamil Nadu e-Governance Agency, Chengalvaraya, Naicker Building, PT Lee, 807, 2nd & 7th floor, Anna Salai, Chennai, Tamil Nadu 600002. Contact No: 044 4016 4900. Email: mngr.tnega@tn.gov.in",
        },
        {
          sno: "10",
          item: "The monthly remuneration received by each of the commission officers and employees, including the system of compensation as provided in its regulations",
          rowsText: "Not Applicable :: As per Government norms.",
        },
        {
          sno: "11",
          item: "The budget allocated to each of its agency, indicating the particulars of all plans, proposed expenditures and reports on disbursements made",
          rowsText: "Not Applicable :: Not Applicable",
        },
        {
          sno: "12",
          item: "The manner of execution of subsidy programmes, including the amounts allocated and the details of beneficiaries of such programmes",
          rowsText: "Not Applicable :: Not Applicable",
        },
        {
          sno: "13",
          item: "The manner of execution of subsidy programmes, including the amounts allocated and the details of beneficiaries of such programmes",
          rowsText: "Not Applicable :: Not Applicable",
        },
        {
          sno: "14",
          item: "Details in respect of the information, available to or held by it, reduced in an electronic form",
          rowsText: "Not Applicable :: Not Applicable",
        },
        {
          sno: "15",
          item: "The particulars of facilities available to citizens for obtaining information, including the working hours of a library or reading room, if maintained for public use",
          rowsText: "Not Applicable :: Not Applicable",
        },
        {
          sno: "16",
          item: "The names, designations and other particulars of the public information officers",
          rowsText: "Public Information officer, Tamil Nadu e-Governance Agency. :: Public Information officer, Tamil Nadu e-Governance Agency.",
        },
        {
          sno: "17",
          item: "Such other information as may be prescribed, and thereafter update these publications every year",
          rowsText: "Not Applicable :: Not Applicable",
        },
      ],
      howToFile: {
        heading: "How to File an RTI",
        sub: "Citizens can file RTI requests online through the Tamil Nadu RTI portal.",
        body: "To file an RTI request with Tamil Nadu e-Governance Agency, visit the official RTI Online Portal of the Government of Tamil Nadu.",
        ctaLabel: "File RTI Online",
        ctaHref: "https://rtionline.tn.gov.in/",
        redirectNote: "You will be redirected to the Tamil Nadu RTI portal at rtionline.tn.gov.in",
        email: "tnega@tn.gov.in",
        phone: "044 4016 4900",
        phoneHref: "tel:04440164900",
      },
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("rti-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
