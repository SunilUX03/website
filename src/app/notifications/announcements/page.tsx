import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { AnnouncementsGraphic } from "@/components/heroes/AnnouncementsGraphic";
import { AnnouncementList } from "@/components/announcements/AnnouncementList";
import { hero } from "@/lib/announcements-content";

export const metadata: Metadata = {
  title: "Announcements — TNeGA",
  description:
    "Launches, milestones and service updates from Tamil Nadu e-Governance Agency.",
};

export default function Announcements() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <PageHero {...hero} graphic={<AnnouncementsGraphic />} />
        <AnnouncementList />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
