import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { getLegalPage } from "@/lib/cms/legal-pages";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Cookie Policy | TNeGA",
  description: "What cookies this website uses, why, and how to change your preferences.",
};

export const revalidate = 60;

export default async function CookiePolicy() {
  const locale = await getLocale();
  const page = await getLegalPage("cookie-policy", locale);
  if (!page) notFound();
  return (
    <LegalPageContent
      page={page}
      breadcrumbLabel={locale === "ta" ? "குக்கீக் கொள்கை" : "Cookie Policy"}
      locale={locale}
    />
  );
}
