import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AboutHero } from "@/components/about/AboutHero";
import { WhoWeAreHierarchy } from "@/components/about/WhoWeAreHierarchy";
import { VisionMission } from "@/components/about/VisionMission";
import { OrgChart } from "@/components/about/OrgChart";
import { LeadershipTeam } from "@/components/about/LeadershipTeam";
import { BoardOfDirectors } from "@/components/about/BoardOfDirectors";
import { Metrics } from "@/components/sections/Metrics";
import { Awards } from "@/components/about/Awards";
import { RollOfHonour } from "@/components/about/RollOfHonour";
import { JoinUs } from "@/components/about/JoinUs";
import { ConnectWithUs } from "@/components/about/ConnectWithUs";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getJobOpenings } from "@/lib/cms/job-openings";
import { getBoardContent } from "@/lib/cms/board-content";
import { getTeamMembers } from "@/lib/cms/team-members";
import { getAboutPageContent } from "@/lib/cms/about-page";
import { getOrgChart } from "@/lib/cms/org-chart";
import { getAwards } from "@/lib/cms/awards";
import { getRollOfHonour } from "@/lib/cms/roll-of-honour";
import { getMetrics } from "@/lib/cms/metrics";
import { getCareersContent } from "@/lib/cms/careers-content";

export const metadata: Metadata = {
  title: "About TNeGA | Tamil Nadu e-Governance Agency",
  description:
    "Tamil Nadu e-Governance Agency is the State Nodal Agency for all e-Governance initiatives of the Government of Tamil Nadu, driving digital transformation that makes public services transparent, efficient and accessible to every citizen.",
};

// See the matching note on the Announcements pages — CMS-backed data
// needs explicit revalidation since Next can't see through a database
// query the way it can a static import.
export const revalidate = 60;

export default async function About() {
  const [openings, board, members, aboutPage, orgChart, awards, rollOfHonour, metrics, careers] =
    await Promise.all([
      getJobOpenings(),
      getBoardContent(),
      getTeamMembers(),
      getAboutPageContent(),
      getOrgChart(),
      getAwards(),
      getRollOfHonour(),
      getMetrics(),
      getCareersContent(),
    ]);

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "About" }]} />
        <AboutHero aboutHero={aboutPage.hero} />
        <WhoWeAreHierarchy whoWeAre={aboutPage.whoWeAre} hierarchy={aboutPage.hierarchy} />
        <VisionMission visionMission={aboutPage.visionMission} />
        <Metrics metrics={metrics} />
        <OrgChart orgChart={orgChart} />
        <LeadershipTeam members={members} />
        <BoardOfDirectors board={board} />
        <Awards awards={awards} />
        <RollOfHonour entries={rollOfHonour} />
        <JoinUs hero={careers.hero} openings={openings} />
        <ConnectWithUs connectWithUs={aboutPage.connectWithUs} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
