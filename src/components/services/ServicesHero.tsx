import { PageHero } from "@/components/ui/PageHero";
import { ServicesGraphic } from "@/components/heroes/ServicesGraphic";
import { heroOrbs } from "@/lib/services-content";
import type { CmsPageHero } from "@/lib/cms/site-copy";

export function ServicesHero({ hero }: { hero: CmsPageHero }) {
  return <PageHero eyebrow={hero.eyebrow} heading={hero.heading} body={hero.body} orbs={heroOrbs} graphic={<ServicesGraphic />} />;
}
