import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { allServiceItems, getServiceItemBySlug } from "@/lib/services-content";

export function generateStaticParams() {
  return allServiceItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getServiceItemBySlug(slug);
  if (!item) return {};
  return {
    title: `${item.name} — TNeGA`,
    description: item.description,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getServiceItemBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <ServiceDetailContent item={item} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
