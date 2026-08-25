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
  getTableHeaders,
  buildFacets,
  getSearchPlaceholder,
  getNoResultsText,
} from "@/lib/policies-guidelines-content";
import { getPolicyRows } from "@/lib/cms/policies";
import { getSiteCopy } from "@/lib/cms/site-copy";
import { getLocale } from "@/lib/locale";
import { getUiStrings } from "@/lib/ui-strings";

export const metadata: Metadata = {
  title: "Policies & Guidelines | TNeGA",
  description:
    "Cybersecurity, data and e-Governance standards and guidelines issued by Tamil Nadu e-Governance Agency.",
};

export const revalidate = 60;

export default async function PoliciesGuidelines() {
  const locale = await getLocale();
  const t = getUiStrings(locale);
  const [rows, siteCopy] = await Promise.all([getPolicyRows(locale), getSiteCopy(locale)]);
  const hero = siteCopy.policiesHero;
  const isTa = locale === "ta";

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb
          locale={locale}
          items={[
            { label: isTa ? "அறிவிக்கைகள்" : "Notifications" },
            { label: isTa ? "கொள்கைகள் & வழிகாட்டுதல்கள்" : "Policies & Guidelines" },
          ]}
        />
        <PageHero
          eyebrow={hero.eyebrow}
          heading={hero.heading}
          body={hero.body}
          cta={{ label: t.viewAll, href: "#document-table" }}
          orbs={heroOrbs}
          graphic={<PoliciesGraphic />}
        />
        <DocumentTable
          rows={rows}
          headers={getTableHeaders(locale)}
          facets={buildFacets(rows, locale)}
          searchPlaceholder={getSearchPlaceholder(locale)}
          searchAriaLabel={isTa ? "கொள்கைகள் & வழிகாட்டுதல்களைத் தேடுங்கள்" : "Search policies and guidelines"}
          filterBarLabel={isTa ? "கொள்கைகள் & வழிகாட்டுதல்களை வடிகட்டு" : "Filter policies and guidelines"}
          tableLabel={isTa ? "கொள்கைகள் & வழிகாட்டுதல்கள் பட்டியல்" : "Policies and guidelines list"}
          noResultsText={getNoResultsText(locale)}
          locale={locale}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
