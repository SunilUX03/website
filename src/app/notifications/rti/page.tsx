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
import { hero } from "@/lib/rti-content";

export const metadata: Metadata = {
  title: "Right to Information (RTI) — TNeGA",
  description:
    "RTI Act 2005 disclosures under Section 4(1)(b), Public Information Officer and Appellate Authority contacts, and how to file an RTI request with TNeGA.",
};

export default function Rti() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "RTI" }]} />
        <PageHero {...hero} graphic={<RtiGraphic />} />
        <KeyContacts />
        <DisclosureTable />
        <HowToFileRti />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
