import { FooterClient } from "./FooterClient";
import { getFooterContent } from "@/lib/cms/footer";
import { getLocale } from "@/lib/locale";

// Rendered directly by every page, same as TopNav — fetching here rather
// than requiring each page to fetch and pass it down keeps the CMS
// migration to two files instead of every page in the app.
export async function Footer() {
  const locale = await getLocale();
  const footer = await getFooterContent(locale);
  return <FooterClient footer={footer} />;
}
