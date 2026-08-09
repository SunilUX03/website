import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { TendersGraphic } from "@/components/heroes/TendersGraphic";
import { hero, tenderPortal } from "@/lib/tenders-content";

export const metadata: Metadata = {
  title: "Tenders & Procurement | TNeGA",
  description:
    "Active and upcoming tenders from Tamil Nadu e-Governance Agency, published on the Tamil Nadu Government e-Tendering portal.",
};

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default function Tenders() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Notifications" }, { label: "Tenders" }]} />
        <PageHero {...hero} graphic={<TendersGraphic />} />

        <section className="bg-canvas-soft py-xxl md:py-section">
          <Container>
            <SectionHead heading={tenderPortal.heading} sub={tenderPortal.sub} align="center" />

            <div className="mx-auto w-full max-w-[640px]">
              <div className="flex flex-col items-center gap-base rounded-xl border border-hairline bg-surface-card p-lg text-center md:p-xl">
                <p className="type-body-md text-[var(--color-body)]">{tenderPortal.body}</p>

                <a
                  href={tenderPortal.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-button btn-primary"
                  aria-label={`${tenderPortal.ctaLabel} at tntenders.gov.in (opens in new tab)`}
                >
                  {tenderPortal.ctaLabel}
                  <ExternalIcon />
                </a>

                <p className="type-caption text-[var(--color-muted)]">{tenderPortal.redirectNote}</p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
