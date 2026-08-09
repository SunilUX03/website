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
import { getAnnouncements } from "@/lib/cms/announcements";

// Announcements now come from the CMS (a live DB query, not a static
// import Next can see through), so this page would otherwise be
// prerendered once at build and never reflect a newly published
// announcement. Revalidating every 60s is simple, predictable ISR —
// good enough for content that doesn't need to appear instantly:
// revisit with on-publish revalidation (a Payload afterChange hook
// calling revalidatePath) if that ever becomes necessary.
export const revalidate = 60;

export default async function Home() {
  const announcements = await getAnnouncements();

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Hero />
        <Scroller />
        <AboutLeadership />
        <Metrics />
        <PillarCards />
        <ProjectsSpotlight />
        <CommunityFeed announcements={announcements} />
        <ReachUs />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
