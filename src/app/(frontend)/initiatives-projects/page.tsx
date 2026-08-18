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

export const metadata: Metadata = {
  title: "Initiatives & Projects | TNeGA",
  description: "The full catalogue of TNeGA's flagship platforms, shared department services, and digital governance projects across Tamil Nadu.",
};

export const revalidate = 60;

const heroOrbs = [
  { color: "lavender", className: "-left-32 -top-20 h-[420px] w-[420px]" },
  { color: "sky", className: "-right-24 bottom-0 h-[360px] w-[360px]" },
] as const;

export default async function InitiativesProjects() {
  const allItems = await getAllServiceItems();

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Initiatives & Projects" }]} />
        <PageHero
          eyebrow="Explore"
          heading="Initiatives & Projects"
          body="TNeGA's full portfolio of flagship platforms and digital governance projects, from statewide GIS and social security to shared infrastructure used across Government Departments."
          cta={{ label: "View All", href: "#initiatives-projects-cards" }}
          orbs={heroOrbs}
          graphic={<InitiativesProjectsGraphic />}
        />
        <section id="initiatives-projects-cards" className="scroll-mt-24 bg-canvas">
          <Container className="py-xxl md:py-section">
            <InitiativesProjectsGrid items={allItems} />
          </Container>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
