import { TopNav } from "@/components/nav/TopNav";
import { Hero } from "@/components/hero/Hero";
import { Scroller } from "@/components/sections/Scroller";
import { PillarCards } from "@/components/sections/PillarCards";
import { Metrics } from "@/components/sections/Metrics";
import { CategoryCards } from "@/components/sections/CategoryCards";
import { ProjectsSpotlight } from "@/components/sections/ProjectsSpotlight";
import { Leadership } from "@/components/sections/Leadership";
import { Announcements } from "@/components/sections/Announcements";
import { Gallery } from "@/components/sections/Gallery";
import { SocialMedia } from "@/components/sections/SocialMedia";
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
        <PillarCards />
        <CategoryCards />
        <Metrics />
        <ProjectsSpotlight />
        <Leadership />
        <Announcements />
        <Gallery />
        <SocialMedia />
        <ReachUs />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
