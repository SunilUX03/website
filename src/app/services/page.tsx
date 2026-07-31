import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesTabs } from "@/components/services/ServicesTabs";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export const metadata: Metadata = {
  title: "Citizen Services & Govt Digital Services — TNeGA",
  description:
    "From citizen-facing portals to department platforms and emerging technology — TNeGA builds, operates and scales digital governance across Tamil Nadu.",
};

export default function Services() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <ServicesHero />
        <ServicesTabs />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
