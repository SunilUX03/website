import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { PoliciesGraphic } from "@/components/heroes/PoliciesGraphic";
import {
  hero,
  tableHeaders,
  buildFacets,
  searchPlaceholder,
  noResultsText,
} from "@/lib/policies-guidelines-content";
import { getPolicyRows } from "@/lib/cms/policies";

export const metadata: Metadata = {
  title: "Policies & Guidelines | TNeGA",
  description:
    "Cybersecurity, data and e-Governance standards and guidelines issued by Tamil Nadu e-Governance Agency.",
};

export const revalidate = 60;

export default async function PoliciesGuidelines() {
  const rows = await getPolicyRows();

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "Policies & Guidelines" }]} />
        <PageHero {...hero} graphic={<PoliciesGraphic />} />
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
