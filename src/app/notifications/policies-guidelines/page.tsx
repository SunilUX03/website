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
  facets,
  rows,
  searchPlaceholder,
  noResultsText,
} from "@/lib/policies-guidelines-content";

export const metadata: Metadata = {
  title: "Policies & Guidelines — TNeGA",
  description:
    "Cybersecurity, data and e-Governance standards and guidelines issued by Tamil Nadu e-Governance Agency.",
};

export default function PoliciesGuidelines() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "Policies & Guidelines" }]} />
        <PageHero {...hero} graphic={<PoliciesGraphic />} />
        <DocumentTable
          rows={rows}
          headers={tableHeaders}
          facets={facets}
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
