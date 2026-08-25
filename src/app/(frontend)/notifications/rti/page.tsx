import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { RtiGraphic } from "@/components/heroes/RtiGraphic";
import {
  KeyContacts,
  DisclosureTable,
  HowToFileRti,
} from "@/components/rti/RtiSections";
import { heroOrbs } from "@/lib/rti-content";
import { getRtiContent } from "@/lib/cms/rti-content";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Right to Information (RTI) | TNeGA",
  description:
    "RTI Act 2005 disclosures under Section 4(1)(b), Public Information Officer and Appellate Authority contacts, and how to file an RTI request with TNeGA.",
};

export const revalidate = 60;

export default async function Rti() {
  const locale = await getLocale();
  const rti = await getRtiContent(locale);
  const isTa = locale === "ta";

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb
          locale={locale}
          items={[
            { label: isTa ? "அறிவிக்கைகள்" : "Notifications" },
            { label: isTa ? "தகவல் அறியும் உரிமை" : "RTI" },
          ]}
        />
        <PageHero
          eyebrow={rti.hero.eyebrow}
          heading={rti.hero.heading}
          body={rti.hero.body}
          orbs={heroOrbs}
          graphic={<RtiGraphic />}
        />
        <KeyContacts contacts={rti.contacts} locale={locale} />
        <DisclosureTable disclosures={rti.disclosures} locale={locale} />
        <HowToFileRti howToFile={rti.howToFile} locale={locale} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
