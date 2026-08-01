import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { PublicationsGraphic } from "@/components/heroes/PublicationsGraphic";
import {
  hero,
  tableHeaders,
  facets,
  rows,
  searchPlaceholder,
  noResultsText,
} from "@/lib/publications-content";

export const metadata: Metadata = {
  title: "Publications — TNeGA",
  description:
    "Annual reports, policy frameworks and research publications from Tamil Nadu e-Governance Agency.",
};

export default function Publications() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <PageHero {...hero} graphic={<PublicationsGraphic />} />
        <DocumentTable
          rows={rows}
          headers={tableHeaders}
          facets={facets}
          searchPlaceholder={searchPlaceholder}
          searchAriaLabel="Search publications"
          filterBarLabel="Filter publications"
          tableLabel="Publications list"
          noResultsText={noResultsText}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
