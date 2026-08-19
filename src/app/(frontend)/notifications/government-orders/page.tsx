import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { GovernmentOrdersGraphic } from "@/components/heroes/GovernmentOrdersGraphic";
import {
  heroOrbs,
  tableHeaders,
  buildFacets,
  searchPlaceholder,
  noResultsText,
} from "@/lib/government-orders-content";
import { getGovernmentOrderRows } from "@/lib/cms/government-orders";
import { getSiteCopy } from "@/lib/cms/site-copy";

export const metadata: Metadata = {
  title: "Government Orders | TNeGA",
  description:
    "Official Government Orders issued by the IT & Digital Services Department and Tamil Nadu e-Governance Agency.",
};

export const revalidate = 60;

export default async function GovernmentOrders() {
  const [rows, siteCopy] = await Promise.all([getGovernmentOrderRows(), getSiteCopy()]);
  const hero = siteCopy.governmentOrdersHero;

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "Government Orders" }]} />
        <PageHero
          eyebrow={hero.eyebrow}
          heading={hero.heading}
          body={hero.body}
          cta={{ label: "View All", href: "#document-table" }}
          orbs={heroOrbs}
          graphic={<GovernmentOrdersGraphic />}
        />
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
