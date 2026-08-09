import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { GovernmentOrdersGraphic } from "@/components/heroes/GovernmentOrdersGraphic";
import {
  hero,
  tableHeaders,
  buildFacets,
  searchPlaceholder,
  noResultsText,
} from "@/lib/government-orders-content";
import { getGovernmentOrderRows } from "@/lib/cms/government-orders";

export const metadata: Metadata = {
  title: "Government Orders | TNeGA",
  description:
    "Official Government Orders issued by the IT & Digital Services Department and Tamil Nadu e-Governance Agency.",
};

export const revalidate = 60;

export default async function GovernmentOrders() {
  const rows = await getGovernmentOrderRows();

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "Government Orders" }]} />
        <PageHero {...hero} graphic={<GovernmentOrdersGraphic />} />
        <DocumentTable
          rows={rows}
          headers={tableHeaders}
          facets={buildFacets(rows)}
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
