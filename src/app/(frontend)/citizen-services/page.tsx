import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { CitizenServicesGraphic } from "@/components/heroes/CitizenServicesGraphic";
import { CitizenServiceCard } from "@/components/services/CitizenServiceCard";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getCitizenServices } from "@/lib/cms/citizen-services";
import { getSiteCopy } from "@/lib/cms/site-copy";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Citizen Services | TNeGA",
  description: "Access citizen-facing Government services online through e-Sevai and track student welfare and academic records through UMIS.",
};

export const revalidate = 60;

const heroOrbs = [
  { color: "mint", className: "-left-24 -top-20 h-[420px] w-[420px]" },
  { color: "sky", className: "-bottom-16 right-[40px] h-[360px] w-[360px]" },
] as const;

export default async function CitizenServices() {
  const locale = await getLocale();
  const isTa = locale === "ta";
  const [citizenServices, siteCopy] = await Promise.all([getCitizenServices(locale), getSiteCopy(locale)]);

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb locale={locale} items={[{ label: isTa ? "குடிமக்கள் சேவைகள்" : "Citizen Services" }]} />
        <PageHero
          eyebrow={siteCopy.citizenServicesHero.eyebrow}
          heading={siteCopy.citizenServicesHero.heading}
          body={siteCopy.citizenServicesHero.body}
          cta={{ label: isTa ? "அனைத்தையும் காண்க" : "View All", href: "#citizen-services-cards" }}
          orbs={heroOrbs}
          graphic={<CitizenServicesGraphic />}
        />
        <section id="citizen-services-cards" className="scroll-mt-24 bg-canvas-soft">
          <Container className="py-xxl md:py-section">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {citizenServices.map((item) => (
                <CitizenServiceCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
