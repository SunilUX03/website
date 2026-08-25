import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { getLegalPage } from "@/lib/cms/legal-pages";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Terms of Use | TNeGA",
  description: "Acceptable use, intellectual property and linking policy for the Tamil Nadu e-Governance Agency website.",
};

export const revalidate = 60;

export default async function TermsOfUse() {
  const locale = await getLocale();
  const page = await getLegalPage("terms-of-use", locale);
  if (!page) notFound();
  return (
    <LegalPageContent
      page={page}
      breadcrumbLabel={locale === "ta" ? "பயன்பாட்டு விதிமுறைகள்" : "Terms of Use"}
      locale={locale}
    />
  );
}
