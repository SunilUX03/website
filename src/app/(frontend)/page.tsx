import { TopNav } from "@/components/nav/TopNav";
import { Hero } from "@/components/hero/Hero";
import { Scroller } from "@/components/sections/Scroller";
import { AboutLeadership } from "@/components/sections/AboutLeadership";
import { Metrics } from "@/components/sections/Metrics";
import { PillarCards } from "@/components/sections/PillarCards";
import { ProjectsSpotlight } from "@/components/sections/ProjectsSpotlight";
import { CommunityFeed } from "@/components/sections/CommunityFeed";
import { ReachUs } from "@/components/sections/ReachUs";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getAnnouncements, getTickerAnnouncements } from "@/lib/cms/announcements";
import { getHeroContent } from "@/lib/cms/hero-content";
import { getLeadershipBand } from "@/lib/cms/leadership-band";
import { getAllServiceItems, getServiceItemsByNames } from "@/lib/cms/services";
import { pillars } from "@/lib/content";

// Announcements now come from the CMS (a live DB query, not a static
// import Next can see through), so this page would otherwise be
// prerendered once at build and never reflect a newly published
// announcement. Revalidating every 60s is simple, predictable ISR —
// good enough for content that doesn't need to appear instantly:
// revisit with on-publish revalidation (a Payload afterChange hook
// calling revalidatePath) if that ever becomes necessary.
export const revalidate = 60;

export default async function Home() {
  const [announcements, tickerAnnouncements, hero, leadershipBand, allServiceItems] = await Promise.all([
    getAnnouncements(),
    getTickerAnnouncements(),
    getHeroContent(),
    getLeadershipBand(),
    getAllServiceItems(),
  ]);
  const pillarItems = pillars.map((p) => getServiceItemsByNames(allServiceItems, p.itemNames));

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Hero hero={hero} />
        <Scroller items={tickerAnnouncements} />
        <AboutLeadership band={leadershipBand} />
        <Metrics />
        <PillarCards pillarItems={pillarItems} />
        <ProjectsSpotlight />
        <CommunityFeed announcements={announcements} />
        <ReachUs />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
