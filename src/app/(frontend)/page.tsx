import { TopNav } from "@/components/nav/TopNav";
import { Hero } from "@/components/hero/Hero";
import { Scroller } from "@/components/sections/Scroller";
import { AboutLeadership } from "@/components/sections/AboutLeadership";
import { Metrics } from "@/components/sections/Metrics";
import { PillarCards } from "@/components/sections/PillarCards";
import { ProjectsSpotlight } from "@/components/sections/ProjectsSpotlight";
import { CommunityFeed } from "@/components/sections/CommunityFeed";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getAnnouncements, getTickerAnnouncements } from "@/lib/cms/announcements";
import { getHeroContent } from "@/lib/cms/hero-content";
import { getLeadershipBand } from "@/lib/cms/leadership-band";
import { getAllServiceItems, getServiceItemsByNames } from "@/lib/cms/services";
import { getMetrics } from "@/lib/cms/metrics";
import { getPillarsContent } from "@/lib/cms/pillars-content";
import { getProjectsSpotlight } from "@/lib/cms/projects-spotlight";
import { pillars, type PillarLinkItem } from "@/lib/content";

// Announcements now come from the CMS (a live DB query, not a static
// import Next can see through), so this page would otherwise be
// prerendered once at build and never reflect a newly published
// announcement. Revalidating every 60s is simple, predictable ISR —
// good enough for content that doesn't need to appear instantly:
// revisit with on-publish revalidation (a Payload afterChange hook
// calling revalidatePath) if that ever becomes necessary.
export const revalidate = 60;

export default async function Home() {
  const [announcements, tickerAnnouncements, hero, leadershipBand, allServiceItems, metrics, pillarsChrome, projectsSpotlight] =
    await Promise.all([
      getAnnouncements(),
      getTickerAnnouncements(),
      getHeroContent(),
      getLeadershipBand(),
      getAllServiceItems(),
      getMetrics(),
      getPillarsContent(),
      getProjectsSpotlight(),
    ]);
  // Citizen Services and Services to Government carry a fixed, curated
  // `items` list already in the shape the cards need; the third pillar
  // (Initiatives & Projects) still resolves live from the Services
  // collection by name, so its items are mapped into the same shape here.
  const pillarItems: PillarLinkItem[][] = pillars.map((p) =>
    "items" in p
      ? p.items
      : getServiceItemsByNames(allServiceItems, p.itemNames).map((item) => ({
          name: item.name,
          description: item.description,
          href: item.knowMoreHref,
        }))
  );
  const mergedPillars = pillarsChrome.map((chrome, i) => ({
    ...chrome,
    href: pillars[i].href,
    seeAllLabel: "seeAllLabel" in pillars[i] ? pillars[i].seeAllLabel : undefined,
  }));

  return (
    <>
      <TopNav />
      <main className="flex-1">
        {/* Hero fills the rest of the first viewport (nav height
            subtracted via --header-height) and the ticker sits pinned
            at the very bottom of that block, flush against it — rather
            than the two just being stacked with whatever height each
            happens to want. */}
        <div className="flex flex-col" style={{ minHeight: "calc(100dvh - var(--header-height, 130px))" }}>
          <Hero hero={hero} />
          <Scroller items={tickerAnnouncements} />
        </div>
        <AboutLeadership band={leadershipBand} />
        <Metrics metrics={metrics} />
        <PillarCards pillars={mergedPillars} pillarItems={pillarItems} />
        <ProjectsSpotlight projects={projectsSpotlight} />
        <CommunityFeed announcements={announcements} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
