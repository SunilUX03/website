import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { GovernmentOrdersGraphic } from "@/components/heroes/GovernmentOrdersGraphic";
import {
  hero,
  tableHeaders,
  facets,
  rows,
  searchPlaceholder,
  noResultsText,
} from "@/lib/government-orders-content";

export const metadata: Metadata = {
  title: "Government Orders — TNeGA",
  description:
    "Official Government Orders issued by the IT & Digital Services Department and Tamil Nadu e-Governance Agency.",
};

export default function GovernmentOrders() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <PageHero {...hero} graphic={<GovernmentOrdersGraphic />} />
        <DocumentTable
          rows={rows}
          headers={tableHeaders}
          facets={facets}
          searchPlaceholder={searchPlaceholder}
          searchAriaLabel="Search government orders"
          filterBarLabel="Filter government orders"
          tableLabel="Government orders list"
          noResultsText={noResultsText}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
