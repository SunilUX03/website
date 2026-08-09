import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesTabs } from "@/components/services/ServicesTabs";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getAllServiceItems, getServiceItemsBySection } from "@/lib/cms/services";

export const metadata: Metadata = {
  title: "Citizen Services, e-Governance Projects & Services | TNeGA",
  description:
    "From citizen-facing portals to department platforms and emerging technology, TNeGA builds, operates and scales digital governance across Tamil Nadu.",
};

export const revalidate = 60;

export default async function Services() {
  const allItems = await getAllServiceItems();

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Services" }]} />
        <ServicesHero />
        <ServicesTabs
          citizenServices={getServiceItemsBySection(allItems, "citizen-services")}
          eGovernanceProjects={getServiceItemsBySection(allItems, "e-governance-projects")}
          sharedServices={getServiceItemsBySection(allItems, "services")}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
