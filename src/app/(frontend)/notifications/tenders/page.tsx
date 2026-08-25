import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TendersGraphic } from "@/components/heroes/TendersGraphic";
import { heroOrbs } from "@/lib/tenders-content";
import { getTendersContent } from "@/lib/cms/tenders-content";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Tenders & Procurement | TNeGA",
  description:
    "Active and upcoming tenders from Tamil Nadu e-Governance Agency, published on the Tamil Nadu Government e-Tendering portal.",
};

export const revalidate = 60;

export default async function Tenders() {
  const locale = await getLocale();
  const { hero, tenderPortal } = await getTendersContent(locale);
  const isTa = locale === "ta";

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb
          locale={locale}
          items={[
            { label: isTa ? "அறிவிக்கைகள்" : "Notifications" },
            { label: isTa ? "டெண்டர்கள்" : "Tenders" },
          ]}
        />
        <PageHero
          eyebrow={hero.eyebrow}
          heading={hero.heading}
          body={tenderPortal.body}
          cta={{ label: tenderPortal.ctaLabel, href: tenderPortal.ctaHref, external: true, analyticsLabel: "tenders_portal_redirect" }}
          orbs={heroOrbs}
          graphic={<TendersGraphic />}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
