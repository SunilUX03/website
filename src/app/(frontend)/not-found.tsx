import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { NotFoundContent } from "@/components/errors/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found | TNeGA",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
