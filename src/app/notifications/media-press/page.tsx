import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { MediaGraphic } from "@/components/heroes/MediaGraphic";
import { MediaTabs } from "@/components/media/MediaTabs";
import { hero } from "@/lib/media-content";

export const metadata: Metadata = {
  title: "Media & Press — TNeGA",
  description:
    "News, events, photographs and videos from Tamil Nadu e-Governance Agency.",
};

export default function MediaPress() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <PageHero {...hero} graphic={<MediaGraphic />} />
        <MediaTabs />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
