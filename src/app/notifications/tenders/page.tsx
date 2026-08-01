import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { TendersGraphic } from "@/components/heroes/TendersGraphic";
import {
  hero,
  tableHeaders,
  facets,
  rows,
  searchPlaceholder,
  noResultsText,
} from "@/lib/tenders-content";

export const metadata: Metadata = {
  title: "Tenders & Procurement — TNeGA",
  description:
    "Active and upcoming tenders from Tamil Nadu e-Governance Agency. Download documents and submit bids before closing dates.",
};

export default function Tenders() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <PageHero {...hero} graphic={<TendersGraphic />} />
        <DocumentTable
          rows={rows}
          headers={tableHeaders}
          facets={facets}
          searchPlaceholder={searchPlaceholder}
          searchAriaLabel="Search tenders"
          filterBarLabel="Filter tenders"
          tableLabel="Tenders list"
          noResultsText={noResultsText}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
