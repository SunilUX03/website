import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { MediaGraphic } from "@/components/heroes/MediaGraphic";
import { MediaTabs } from "@/components/media/MediaTabs";
import { buildFacets, hero } from "@/lib/media-content";
import { getMediaItems } from "@/lib/cms/media-items";

export const metadata: Metadata = {
  title: "Media & Press | TNeGA",
  description:
    "News, events, photographs and videos from Tamil Nadu e-Governance Agency.",
};

// See the matching note on the Announcements pages — CMS-backed data
// needs explicit revalidation since Next can't see through a database
// query the way it can a static import.
export const revalidate = 60;

export default async function MediaPress() {
  const items = await getMediaItems();
  const photos = items.filter((item) => item.type === "photo");
  const videos = items.filter((item) => item.type === "video");

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "Media & Press" }]} />
        <PageHero {...hero} graphic={<MediaGraphic />} />
        <MediaTabs photos={photos} videos={videos} facets={buildFacets(items)} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
