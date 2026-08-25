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
  getTableHeaders,
  buildFacets,
  getSearchPlaceholder,
  getNoResultsText,
} from "@/lib/government-orders-content";
import { getGovernmentOrderRows } from "@/lib/cms/government-orders";
import { getSiteCopy } from "@/lib/cms/site-copy";
import { getLocale } from "@/lib/locale";
import { getUiStrings } from "@/lib/ui-strings";

export const metadata: Metadata = {
  title: "Government Orders | TNeGA",
  description:
    "Official Government Orders issued by the IT & Digital Services Department and Tamil Nadu e-Governance Agency.",
};

export const revalidate = 60;

export default async function GovernmentOrders() {
  const locale = await getLocale();
  const t = getUiStrings(locale);
  const [rows, siteCopy] = await Promise.all([getGovernmentOrderRows(locale), getSiteCopy(locale)]);
  const hero = siteCopy.governmentOrdersHero;
  const isTa = locale === "ta";

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb
          locale={locale}
          items={[
            { label: isTa ? "அறிவிக்கைகள்" : "Notifications" },
            { label: isTa ? "அரசு ஆணைகள்" : "Government Orders" },
          ]}
        />
        <PageHero
          eyebrow={hero.eyebrow}
          heading={hero.heading}
          body={hero.body}
          cta={{ label: t.viewAll, href: "#document-table" }}
          orbs={heroOrbs}
          graphic={<GovernmentOrdersGraphic />}
        />
        <DocumentTable
          rows={rows}
          headers={getTableHeaders(locale)}
          facets={buildFacets(rows, locale)}
          searchPlaceholder={getSearchPlaceholder(locale)}
          searchAriaLabel={isTa ? "அரசு ஆணைகளைத் தேடுங்கள்" : "Search government orders"}
          filterBarLabel={isTa ? "அரசு ஆணைகளை வடிகட்டு" : "Filter government orders"}
          tableLabel={isTa ? "அரசு ஆணைகள் பட்டியல்" : "Government orders list"}
          noResultsText={getNoResultsText(locale)}
          locale={locale}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
