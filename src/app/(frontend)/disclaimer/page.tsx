import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { getLegalPage } from "@/lib/cms/legal-pages";

export const metadata: Metadata = {
  title: "Disclaimer | TNeGA",
  description: "Disclaimer regarding the content and use of the Tamil Nadu e-Governance Agency website.",
};

export const revalidate = 60;

export default async function Disclaimer() {
  const page = await getLegalPage("disclaimer");
  if (!page) notFound();
  return <LegalPageContent page={page} breadcrumbLabel="Disclaimer" />;
}
