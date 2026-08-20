import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ServicesToGovernmentContent } from "@/components/services/ServicesToGovernmentContent";
import { getServicesToGovernmentContent } from "@/lib/cms/services-to-government";
import { getDepartmentContacts } from "@/lib/cms/department-contacts";

export const metadata: Metadata = {
  title: "Services to Government | TNeGA",
  description:
    "TNeGA's shared services for Government Departments: software development and procurement, IT security audits, SMS/WhatsApp gateway, and Aadhaar-based authentication.",
};

export const revalidate = 60;

export default async function ServicesToGovernment() {
  const [content, departmentContacts] = await Promise.all([
    getServicesToGovernmentContent(),
    getDepartmentContacts(),
  ]);

  return (
    <>
      <TopNav />
      <main className="flex-1" id="main-content">
        <Breadcrumb items={[{ label: "Services to Government" }]} />
        <ServicesToGovernmentContent heroId="main-content" content={content} departmentContacts={departmentContacts} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
