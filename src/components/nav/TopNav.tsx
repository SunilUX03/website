import { AccessibilityBar } from "./AccessibilityBar";
import { MainNav } from "./MainNav";
import { getNavContent } from "@/lib/cms/nav-content";
import { getSiteIdentity } from "@/lib/cms/site-identity";
import { getLocale } from "@/lib/locale";

// Rendered directly by every page (see the individual page.tsx files —
// there's no shared root layout for this), so fetching nav data here
// rather than requiring each page to fetch and pass it down keeps this
// migration to a couple of files instead of every page in the app.
export async function TopNav() {
  const locale = await getLocale();
  const [nav, identity] = await Promise.all([getNavContent(locale), getSiteIdentity()]);

  return (
    <header>
      <AccessibilityBar govLabel={nav.govLabel} locale={locale} />
      <MainNav nav={nav} locale={locale} identity={identity} />
    </header>
  );
}
