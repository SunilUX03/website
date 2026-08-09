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

export const metadata: Metadata = {
  title: "Right to Information (RTI) | TNeGA",
  description:
    "RTI Act 2005 disclosures under Section 4(1)(b), Public Information Officer and Appellate Authority contacts, and how to file an RTI request with TNeGA.",
};

export const revalidate = 60;

export default async function Rti() {
  const rti = await getRtiContent();

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "RTI" }]} />
        <PageHero
          eyebrow={rti.hero.eyebrow}
          heading={rti.hero.heading}
          body={rti.hero.body}
          orbs={heroOrbs}
          graphic={<RtiGraphic />}
        />
        <KeyContacts contacts={rti.contacts} />
        <DisclosureTable disclosures={rti.disclosures} />
        <HowToFileRti howToFile={rti.howToFile} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
