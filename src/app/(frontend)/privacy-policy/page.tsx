import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { getLegalPage } from "@/lib/cms/legal-pages";

export const metadata: Metadata = {
  title: "Privacy Policy | TNeGA",
  description: "How the Tamil Nadu e-Governance Agency collects, uses and protects information on this website.",
};

export const revalidate = 60;

export default async function PrivacyPolicy() {
  const page = await getLegalPage("privacy-policy");
  if (!page) notFound();
  return <LegalPageContent page={page} breadcrumbLabel="Privacy Policy" />;
}
