import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { FeedbackForm } from "@/components/legal/FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback | TNeGA",
  description: "Share your feedback, questions or comments with the Tamil Nadu e-Governance Agency.",
};

export default function Feedback() {
  return (
    <>
      <TopNav />
      <main className="flex-1" id="main-content">
        <Breadcrumb items={[{ label: "Feedback" }]} />
        <section className="bg-canvas">
          <Container className="py-xl md:py-xxl">
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Support</p>
            <h1 className="type-display-lg mb-4 text-ink">We&apos;d like to hear from you</h1>
            <p className="type-body-md max-w-[70ch] text-[var(--color-body)]">
              Have a question, suggestion or issue with this website? Share it below.
            </p>
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
