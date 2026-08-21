import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { MediaGraphic } from "@/components/heroes/MediaGraphic";
import { MediaTabs } from "@/components/media/MediaTabs";
import { buildFacets, heroOrbs } from "@/lib/media-content";
import { getMediaItems } from "@/lib/cms/media-items";
import { getSiteCopy } from "@/lib/cms/site-copy";
import { getLocale } from "@/lib/locale";

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
  const locale = await getLocale();
  const [items, siteCopy] = await Promise.all([getMediaItems(), getSiteCopy(locale)]);
  const photos = items.filter((item) => item.type === "photo");
  const videos = items.filter((item) => item.type === "video");
  const hero = siteCopy.mediaHero;

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "Media & Press" }]} />
        <PageHero
          eyebrow={hero.eyebrow}
          heading={hero.heading}
          body={hero.body}
          cta={{ label: "View All Media", href: "#photos-videos" }}
          orbs={heroOrbs}
          graphic={<MediaGraphic />}
        />
        <MediaTabs photos={photos} videos={videos} facets={buildFacets(items)} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
