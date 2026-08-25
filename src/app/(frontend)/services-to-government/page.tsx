import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ServicesToGovernmentContent } from "@/components/services/ServicesToGovernmentContent";
import { getServicesToGovernmentContent } from "@/lib/cms/services-to-government";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Services to Government | TNeGA",
  description:
    "TNeGA's shared services for Government Departments: software development and procurement, IT security audits, SMS/WhatsApp gateway, and Aadhaar-based authentication.",
};

export const revalidate = 60;

export default async function ServicesToGovernment() {
  const locale = await getLocale();
  const content = await getServicesToGovernmentContent(locale);
  const isTa = locale === "ta";

  return (
    <>
      <TopNav />
      <main className="flex-1" id="main-content">
        <Breadcrumb locale={locale} items={[{ label: isTa ? "அரசுக்கான சேவைகள்" : "Services to Government" }]} />
        <ServicesToGovernmentContent
          heroId="main-content"
          content={content}
          locale={locale}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
