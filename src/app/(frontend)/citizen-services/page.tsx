import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { CitizenServicesGraphic } from "@/components/heroes/CitizenServicesGraphic";
import { CitizenServiceCard, type CitizenServiceItem } from "@/components/services/CitizenServiceCard";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getAllServiceItems } from "@/lib/cms/services";
import { pillars } from "@/lib/content";

export const metadata: Metadata = {
  title: "Citizen Services | TNeGA",
  description: "Access citizen-facing Government services online through e-Sevai and track student welfare and academic records through UMIS.",
};

export const revalidate = 60;

const heroOrbs = [
  { color: "mint", className: "-left-24 -top-20 h-[420px] w-[420px]" },
  { color: "sky", className: "-bottom-16 right-[40px] h-[360px] w-[360px]" },
] as const;

// Reuses Home's exact curated e-Sevai/UMIS entries (pillars[0]) for
// name/description/external href — the one thing it adds is each
// service's real card image, looked up from the Services collection by
// its full CMS name (the curated entry uses the short "e-Sevai" display
// name, not "e-Sevai Portal").
const CITIZEN_SERVICE_CMS_NAME: Record<string, string> = {
  "e-Sevai": "e-Sevai Portal",
  UMIS: "UMIS",
};

export default async function CitizenServices() {
  const allItems = await getAllServiceItems();

  const citizenPillar = pillars[0];
  const citizenServices: CitizenServiceItem[] =
    "items" in citizenPillar
      ? citizenPillar.items.map((item) => {
          const cmsItem = allItems.find((s) => s.name === (CITIZEN_SERVICE_CMS_NAME[item.name] ?? item.name));
          return { ...item, description: cmsItem?.description ?? item.description, image: cmsItem?.image ?? "" };
        })
      : [];

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Citizen Services" }]} />
        <PageHero
          eyebrow="For Citizens"
          heading="Citizen Services"
          body="Digital access to the Government services citizens use most, delivered through two statewide platforms: e-Sevai for everyday citizen services, and UMIS for student welfare and academic records."
          cta={{ label: "View All", href: "#citizen-services-cards" }}
          orbs={heroOrbs}
          graphic={<CitizenServicesGraphic />}
        />
        <section id="citizen-services-cards" className="scroll-mt-24 bg-canvas-soft">
          <Container className="py-xxl md:py-section">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {citizenServices.map((item) => (
                <CitizenServiceCard key={item.name} item={item} />
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
