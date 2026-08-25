import { FooterClient } from "./FooterClient";
import { getFooterContent } from "@/lib/cms/footer";
import { getSiteIdentity } from "@/lib/cms/site-identity";
import { getLifetimePageviewCount } from "@/lib/analytics-query";
import { getLocale } from "@/lib/locale";

// Rendered directly by every page, same as TopNav — fetching here rather
// than requiring each page to fetch and pass it down keeps the CMS
// migration to two files instead of every page in the app.
export async function Footer() {
  const locale = await getLocale();
  const [footer, identity, visitorCount] = await Promise.all([
    getFooterContent(locale),
    getSiteIdentity(),
    getLifetimePageviewCount(),
  ]);
  return <FooterClient footer={footer} locale={locale} identity={identity} visitorCount={visitorCount} />;
}
