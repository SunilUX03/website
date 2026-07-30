import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { AboutHero } from "@/components/about/AboutHero";
import { WhoWeAreHierarchy } from "@/components/about/WhoWeAreHierarchy";
import { VisionMission } from "@/components/about/VisionMission";
import { WhatWeDo } from "@/components/about/WhatWeDo";
import { EcosystemGrowthRings } from "@/components/about/EcosystemGrowthRings";
import { OrgChart } from "@/components/about/OrgChart";
import { LeadershipTeam } from "@/components/about/LeadershipTeam";
import { BoardOfDirectors } from "@/components/about/BoardOfDirectors";
import { Metrics } from "@/components/sections/Metrics";
import { Awards } from "@/components/about/Awards";
import { RollOfHonour } from "@/components/about/RollOfHonour";
import { ConnectWithUs } from "@/components/about/ConnectWithUs";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export const metadata: Metadata = {
  title: "About TNeGA — Tamil Nadu e-Governance Agency",
  description:
    "Tamil Nadu e-Governance Agency is the State Nodal Agency for all e-Governance initiatives of the Government of Tamil Nadu — driving digital transformation that makes public services transparent, efficient and accessible to every citizen.",
};

export default function About() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <AboutHero />
        <WhoWeAreHierarchy />
        <VisionMission />
        <WhatWeDo />
        <EcosystemGrowthRings />
        <OrgChart />
        <LeadershipTeam />
        <BoardOfDirectors />
        <Metrics />
        <Awards />
        <RollOfHonour />
        <ConnectWithUs />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
