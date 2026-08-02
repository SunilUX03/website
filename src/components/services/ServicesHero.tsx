import { PageHero } from "@/components/ui/PageHero";
import { ServicesGraphic } from "@/components/heroes/ServicesGraphic";
import { hero } from "@/lib/services-content";

export function ServicesHero() {
  return <PageHero {...hero} graphic={<ServicesGraphic />} />;
}
