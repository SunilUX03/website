import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { getLegalPage } from "@/lib/cms/legal-pages";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Terms & Conditions | TNeGA",
  description: "Terms and conditions governing the use of the Tamil Nadu e-Governance Agency website.",
};

export const revalidate = 60;

export default async function TermsConditions() {
  const locale = await getLocale();
  const page = await getLegalPage("terms-conditions", locale);
  if (!page) notFound();
  return (
    <LegalPageContent
      page={page}
      breadcrumbLabel={locale === "ta" ? "விதிமுறைகள் & நிபந்தனைகள்" : "Terms & Conditions"}
      locale={locale}
    />
  );
}
