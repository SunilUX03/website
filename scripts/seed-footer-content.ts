// One-off script: seeds the "footer-content" global with the values that
// used to be `footer` in lib/content.ts. Always an update (globals
// always exist), safe to re-run.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-footer-content.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "footer-content",
    data: {
      description: "Powering Digital Governance in Tamil Nadu",
      address:
        "Tamil Nadu e-Governance Agency\n2nd & 7th Floor, P.T.LEE Chengalvaraya Naicker Building,\nAnna Salai, Chennai - 600 002. Opp. LIC Building",
      phone: "044-4016 4900",
      email: "tnega@tn.gov.in",
      socialLinks: [
        { label: "Facebook", href: "https://www.facebook.com/tnegaofficial" },
        { label: "X", href: "https://twitter.com/TNeGA_Official" },
        { label: "Instagram", href: "https://instagram.com/tnegaofficial" },
        { label: "LinkedIn", href: "https://www.linkedin.com/company/tnega/" },
        { label: "YouTube", href: "https://www.youtube.com/@tnega" },
      ],
      quickLinks: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Careers", href: "/about/careers" },
        { label: "RTI", href: "/notifications/rti" },
      ],
      citizenServices: [
        { label: "e-Sevai", href: "/services/citizen/e-sevai" },
        { label: "Namma Arasu", href: "/services/citizen/namma-arasu" },
        { label: "TN GIS", href: "/projects/tn-gis" },
        { label: "UMIS", href: "/projects/umis" },
      ],
      helpSupport: [
        { label: "Help", href: "/help" },
        { label: "Feedback", href: "/feedback" },
        { label: "Terms & Conditions", href: "/terms-conditions" },
        { label: "Contact Us", href: "/reach-us" },
        { label: "Site Map", href: "/sitemap" },
      ],
      _status: "published",
    },
    overrideAccess: true,
  });

  console.log("footer-content seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
