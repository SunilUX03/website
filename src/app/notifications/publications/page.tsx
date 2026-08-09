import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
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

// Page is fully built and left in place — just switched off site-wide
// (unlinked from nav/sitemap below, and this route itself 404s) until
// there's real publication content to show. Flip this back to `true`
// to bring it back with no other changes needed.
const PUBLICATIONS_ENABLED = false;

export default function Publications() {
  if (!PUBLICATIONS_ENABLED) notFound();

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "Publications" }]} />
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
