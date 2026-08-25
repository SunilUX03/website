import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { getAllServiceItems, getServiceItemBySlug } from "@/lib/cms/services";
import { getLocale } from "@/lib/locale";

export const revalidate = 60;

export async function generateStaticParams() {
  const allItems = await getAllServiceItems();
  return allItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getServiceItemBySlug(slug);
  if (!item) return {};
  return {
    title: `${item.name} | TNeGA`,
    description: item.description,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const item = await getServiceItemBySlug(slug, locale);
  if (!item) notFound();

  const allItems = await getAllServiceItems(locale);
  // Every item in the `services` collection is itself an initiative or
  // project now — Citizen Services split into its own collection and
  // Services to Government into its own global some time ago, so the
  // `sections` field's old citizen-services/services tags this used to
  // filter by are vestigial (nothing else reads them; the /initiatives-
  // projects listing itself now uses a curated slug list, not
  // `sections`). Filtering by a stale tag left most detail pages with
  // just 1-2 related cards despite every other item genuinely
  // qualifying — so "related" is simply every other published item.
  const related = allItems.filter((sibling) => sibling.slug !== item.slug).slice(0, 8);

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <ServiceDetailContent item={item} related={related} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
