import { FooterClient } from "./FooterClient";
import { getFooterContent } from "@/lib/cms/footer";

// Rendered directly by every page, same as TopNav — fetching here rather
// than requiring each page to fetch and pass it down keeps the CMS
// migration to two files instead of every page in the app.
export async function Footer() {
  const footer = await getFooterContent();
  return <FooterClient footer={footer} />;
}
