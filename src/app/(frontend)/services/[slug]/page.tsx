import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { getAllServiceItems, getServiceItemBySlug } from "@/lib/cms/services";

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
  const item = await getServiceItemBySlug(slug);
  if (!item) notFound();

  const allItems = await getAllServiceItems();
  const related = allItems
    .filter((sibling) => sibling.section === item.section && sibling.slug !== item.slug)
    .slice(0, 8);

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
