import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { InitiativesProjectsGraphic } from "@/components/heroes/InitiativesProjectsGraphic";
import { InitiativesProjectsGrid } from "@/components/services/InitiativesProjectsGrid";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getAllServiceItems } from "@/lib/cms/services";
import { getSiteCopy } from "@/lib/cms/site-copy";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Initiatives & Projects | TNeGA",
  description: "The full catalogue of TNeGA's flagship platforms, shared department services, and digital governance projects across Tamil Nadu.",
};

export const revalidate = 60;

const heroOrbs = [
  { color: "lavender", className: "-left-32 -top-20 h-[420px] w-[420px]" },
  { color: "sky", className: "-right-24 bottom-0 h-[360px] w-[360px]" },
] as const;

// Curated subset (and exact display order) for this page — not the full
// Services collection. Slugs are stable identifiers, unlike `name` which
// changes per locale, so filtering/ordering by slug keeps this correct
// under both English and Tamil.
const CURATED_SLUGS = [
  "dbt-direct-benefit-transfer-portal",
  "grains",
  "nambikkai-inaiyam",
  "interdepartmental-technical-consulting",
  "sustainable-development-goals-sdg-monitoring",
  "tnssp",
  "e-gazette-portal",
  "dipr-2-0-web-portal",
  "e-sign",
  "namma-arasu",
  "aadhaar-services",
  "tngis-tamil-nilam",
  "e-office",
  "tn-dbt-portal-for-pfms",
  "sms-whatsapp-gateway",
  "it-security-audit-framework",
];

export default async function InitiativesProjects() {
  const locale = await getLocale();
  const [allItems, siteCopy] = await Promise.all([getAllServiceItems(locale), getSiteCopy(locale)]);
  const items = CURATED_SLUGS.map((slug) => allItems.find((item) => item.slug === slug)).filter(
    (item): item is (typeof allItems)[number] => Boolean(item)
  );
  const isTa = locale === "ta";

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb locale={locale} items={[{ label: isTa ? "முயற்சிகள் & திட்டங்கள்" : "Initiatives & Projects" }]} />
        <PageHero
          eyebrow={siteCopy.initiativesProjectsHero.eyebrow}
          heading={siteCopy.initiativesProjectsHero.heading}
          body={siteCopy.initiativesProjectsHero.body}
          cta={{ label: isTa ? "அனைத்தையும் காண்க" : "View All", href: "#initiatives-projects-cards" }}
          orbs={heroOrbs}
          graphic={<InitiativesProjectsGraphic />}
        />
        <section id="initiatives-projects-cards" className="scroll-mt-24 bg-canvas">
          <Container className="py-xxl md:py-section">
            <InitiativesProjectsGrid items={items} locale={locale} />
          </Container>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
