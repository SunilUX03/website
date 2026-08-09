import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { getLegalPage } from "@/lib/cms/legal-pages";

export const metadata: Metadata = {
  title: "Help | TNeGA",
  description: "Help with accessing and navigating the TNeGA website: file formats, accessibility options and where to get further support.",
};

export const revalidate = 60;

export default async function Help() {
  const page = await getLegalPage("help");
  if (!page) notFound();
  return <LegalPageContent page={page} breadcrumbLabel="Help" />;
}
