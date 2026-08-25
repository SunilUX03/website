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
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Careers | TNeGA",
  description:
    "Join Tamil Nadu e-Governance Agency. Explore current openings across project management, data, GIS, AI/ML and security, and apply online.",
};

export const revalidate = 60;

export default async function Careers() {
  const locale = await getLocale();
  const [openings, careers, roles] = await Promise.all([
    getJobOpenings(locale),
    getCareersContent(locale),
    db.jobRole.findMany({ orderBy: { order: "asc" }, select: { id: true, label: true } }),
  ]);
  const isTa = locale === "ta";

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb
          locale={locale}
          items={[
            { label: isTa ? "எங்களைப் பற்றி" : "About", href: "/about" },
            { label: isTa ? "வேலைவாய்ப்புகள்" : "Careers" },
          ]}
        />
        <PageHero
          eyebrow={careers.hero.eyebrow}
          heading={careers.hero.heading}
          body={careers.hero.body}
          cta={{ label: careers.hero.ctaLabel, href: "#openings" }}
          orbs={heroOrbs}
          graphic={<CareersGraphic />}
        />
        <JobOpenings openings={openings} openingsNote={careers.openingsNote} section={careers.openingsSection} locale={locale} />
        <HowToApply applicationSteps={careers.applicationSteps} section={careers.howToApplySection} locale={locale} />
        <ApplicationForm roles={roles} section={careers.applySection} locale={locale} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
