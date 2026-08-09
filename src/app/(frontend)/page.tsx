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

export default function Home() {
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
        <CommunityFeed />
        <ReachUs />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
