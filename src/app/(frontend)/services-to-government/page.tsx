import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ServicesToGovernmentContent } from "@/components/services/ServicesToGovernmentContent";

export const metadata: Metadata = {
  title: "Services to Government | TNeGA",
  description:
    "TNeGA's shared services for Government Departments: software development and procurement, IT security audits, SMS/WhatsApp gateway, and Aadhaar-based authentication.",
};

export default function ServicesToGovernment() {
  return (
    <>
      <TopNav />
      <main className="flex-1" id="main-content">
        <Breadcrumb items={[{ label: "Services to Government" }]} />
        <ServicesToGovernmentContent heroId="main-content" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
