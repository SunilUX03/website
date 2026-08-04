import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesTabs } from "@/components/services/ServicesTabs";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export const metadata: Metadata = {
  title: "Citizen Services, Interdepartmental Projects & Services — TNeGA",
  description:
    "From citizen-facing portals to department platforms and emerging technology — TNeGA builds, operates and scales digital governance across Tamil Nadu.",
};

export default function Services() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Services" }]} />
        <ServicesHero />
        <ServicesTabs />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
