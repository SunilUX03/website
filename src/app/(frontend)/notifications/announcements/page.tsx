import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AnnouncementsGraphic } from "@/components/heroes/AnnouncementsGraphic";
import { AnnouncementList } from "@/components/announcements/AnnouncementList";
import { buildFacets, hero } from "@/lib/announcements-content";
import { getAnnouncements } from "@/lib/cms/announcements";

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
  const announcements = await getAnnouncements();

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "Announcements" }]} />
        <PageHero {...hero} graphic={<AnnouncementsGraphic />} />
        <AnnouncementList announcements={announcements} facets={buildFacets(announcements)} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
