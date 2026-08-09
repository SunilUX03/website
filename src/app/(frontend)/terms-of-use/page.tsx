import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { getLegalPage } from "@/lib/cms/legal-pages";

export const metadata: Metadata = {
  title: "Terms of Use | TNeGA",
  description: "Acceptable use, intellectual property and linking policy for the Tamil Nadu e-Governance Agency website.",
};

export const revalidate = 60;

export default async function TermsOfUse() {
  const page = await getLegalPage("terms-of-use");
  if (!page) notFound();
  return <LegalPageContent page={page} breadcrumbLabel="Terms of Use" />;
}
