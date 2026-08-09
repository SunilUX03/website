import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { getLegalPage } from "@/lib/cms/legal-pages";

export const metadata: Metadata = {
  title: "Terms & Conditions | TNeGA",
  description: "Terms and conditions governing the use of the Tamil Nadu e-Governance Agency website.",
};

export const revalidate = 60;

export default async function TermsConditions() {
  const page = await getLegalPage("terms-conditions");
  if (!page) notFound();
  return <LegalPageContent page={page} breadcrumbLabel="Terms & Conditions" />;
}
