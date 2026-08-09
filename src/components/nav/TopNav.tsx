import { AccessibilityBar } from "./AccessibilityBar";
import { MainNav } from "./MainNav";
import { getNavContent } from "@/lib/cms/nav-content";

// Rendered directly by every page (see the individual page.tsx files —
// there's no shared root layout for this), so fetching nav data here
// rather than requiring each page to fetch and pass it down keeps this
// migration to a couple of files instead of every page in the app.
export async function TopNav() {
  const nav = await getNavContent();

  return (
    <header>
      <AccessibilityBar govLabel={nav.govLabel} />
      <MainNav nav={nav} />
    </header>
  );
}
