import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AnnouncementsGraphic } from "@/components/heroes/AnnouncementsGraphic";
import { AnnouncementList } from "@/components/announcements/AnnouncementList";
import { buildFacets, heroOrbs } from "@/lib/announcements-content";
import { getAnnouncements } from "@/lib/cms/announcements";
import { getSiteCopy } from "@/lib/cms/site-copy";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Announcements | TNeGA",
  description:
    "Launches, milestones and service updates from Tamil Nadu e-Governance Agency.",
};

// See the matching note on the homepage — CMS-backed data needs explicit
// revalidation since Next can't see through a database query the way it
// can a static import.
export const revalidate = 60;

export default async function Announcements() {
  const locale = await getLocale();
  const [announcements, siteCopy] = await Promise.all([getAnnouncements(locale), getSiteCopy(locale)]);
  const hero = siteCopy.announcementsHero;
  const isTa = locale === "ta";

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb
          locale={locale}
          items={[
            { label: isTa ? "அறிவிக்கைகள்" : "Notifications" },
            { label: isTa ? "அறிவிப்புகள்" : "Announcements" },
          ]}
        />
        <PageHero
          eyebrow={hero.eyebrow}
          heading={hero.heading}
          body={hero.body}
          cta={{ label: isTa ? "அனைத்து அறிவிப்புகளையும் காண்க" : "View All Announcements", href: "#all-announcements" }}
          orbs={heroOrbs}
          graphic={<AnnouncementsGraphic />}
        />
        <AnnouncementList announcements={announcements} facets={buildFacets(announcements, locale)} locale={locale} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
