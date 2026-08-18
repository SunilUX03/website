import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CareersGraphic } from "@/components/heroes/CareersGraphic";
import { JobOpenings } from "@/components/careers/JobOpenings";
import { HowToApply } from "@/components/careers/HowToApply";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { heroOrbs } from "@/lib/careers-content";
import { getJobOpenings } from "@/lib/cms/job-openings";
import { getCareersContent } from "@/lib/cms/careers-content";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Careers | TNeGA",
  description:
    "Join Tamil Nadu e-Governance Agency. Explore current openings across project management, data, GIS, AI/ML and security, and apply online.",
};

export const revalidate = 60;

export default async function Careers() {
  const [openings, careers, roles] = await Promise.all([
    getJobOpenings(),
    getCareersContent(),
    db.jobRole.findMany({ orderBy: { order: "asc" }, select: { id: true, label: true } }),
  ]);

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "About", href: "/about" }, { label: "Careers" }]} />
        <PageHero
          eyebrow={careers.hero.eyebrow}
          heading={careers.hero.heading}
          body={careers.hero.body}
          cta={{ label: careers.hero.ctaLabel, href: "#openings" }}
          orbs={heroOrbs}
          graphic={<CareersGraphic />}
        />
        <JobOpenings openings={openings} openingsNote={careers.openingsNote} />
        <HowToApply applicationSteps={careers.applicationSteps} />
        <ApplicationForm roles={roles} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
