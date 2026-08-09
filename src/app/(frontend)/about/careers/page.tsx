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
import { hero } from "@/lib/careers-content";
import { getJobOpenings } from "@/lib/cms/job-openings";

export const metadata: Metadata = {
  title: "Careers | TNeGA",
  description:
    "Join Tamil Nadu e-Governance Agency. Explore current openings across project management, data, GIS, AI/ML and security, and apply online.",
};

export const revalidate = 60;

export default async function Careers() {
  const openings = await getJobOpenings();

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "About", href: "/about" }, { label: "Careers" }]} />
        <PageHero {...hero} graphic={<CareersGraphic />} />
        <JobOpenings openings={openings} />
        <HowToApply />
        <ApplicationForm />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
