import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { PoliciesGraphic } from "@/components/heroes/PoliciesGraphic";
import {
  heroOrbs,
  tableHeaders,
  buildFacets,
  searchPlaceholder,
  noResultsText,
} from "@/lib/policies-guidelines-content";
import { getPolicyRows } from "@/lib/cms/policies";
import { getSiteCopy } from "@/lib/cms/site-copy";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Policies & Guidelines | TNeGA",
  description:
    "Cybersecurity, data and e-Governance standards and guidelines issued by Tamil Nadu e-Governance Agency.",
};

export const revalidate = 60;

export default async function PoliciesGuidelines() {
  const locale = await getLocale();
  const [rows, siteCopy] = await Promise.all([getPolicyRows(), getSiteCopy(locale)]);
  const hero = siteCopy.policiesHero;

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "Policies & Guidelines" }]} />
        <PageHero
          eyebrow={hero.eyebrow}
          heading={hero.heading}
          body={hero.body}
          cta={{ label: "View All", href: "#document-table" }}
          orbs={heroOrbs}
          graphic={<PoliciesGraphic />}
        />
        <DocumentTable
          rows={rows}
          headers={tableHeaders}
          facets={buildFacets(rows)}
          searchPlaceholder={searchPlaceholder}
          searchAriaLabel="Search policies and guidelines"
          filterBarLabel="Filter policies and guidelines"
          tableLabel="Policies and guidelines list"
          noResultsText={noResultsText}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
