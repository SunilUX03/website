import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { FeedbackForm } from "@/components/legal/FeedbackForm";
import { getLegalPage } from "@/lib/cms/legal-pages";

export const metadata: Metadata = {
  title: "Feedback | TNeGA",
  description: "Share your feedback, questions or comments with the Tamil Nadu e-Governance Agency.",
};

export const revalidate = 60;

export default async function Feedback() {
  const page = await getLegalPage("feedback");
  if (!page) notFound();

  return (
    <>
      <TopNav />
      <main className="flex-1" id="main-content">
        <Breadcrumb items={[{ label: "Feedback" }]} />
        <section className="bg-canvas">
          <Container className="py-xl md:py-xxl">
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">{page.eyebrow}</p>
            <h1 className="type-display-lg mb-4 text-ink">{page.title}</h1>
            <p className="type-body-md max-w-[70ch] text-[var(--color-body)]">{page.intro}</p>
          </Container>
        </section>
        <section className="bg-canvas-soft">
          <Container className="py-xxl md:py-section">
            <div className="mx-auto max-w-[560px]">
              <FeedbackForm />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
