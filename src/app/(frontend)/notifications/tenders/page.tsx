import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TendersGraphic } from "@/components/heroes/TendersGraphic";
import { heroOrbs } from "@/lib/tenders-content";
import { getTendersContent } from "@/lib/cms/tenders-content";

export const metadata: Metadata = {
  title: "Tenders & Procurement | TNeGA",
  description:
    "Active and upcoming tenders from Tamil Nadu e-Governance Agency, published on the Tamil Nadu Government e-Tendering portal.",
};

export const revalidate = 60;

export default async function Tenders() {
  const { hero, tenderPortal } = await getTendersContent();

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "Tenders" }]} />
        <PageHero
          eyebrow={hero.eyebrow}
          heading={hero.heading}
          body={tenderPortal.body}
          cta={{ label: "View Tenders", href: tenderPortal.ctaHref, external: true }}
          orbs={heroOrbs}
          graphic={<TendersGraphic />}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
