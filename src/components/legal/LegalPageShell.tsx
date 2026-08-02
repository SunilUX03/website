import { ReactNode } from "react";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";

/** Shared shell for the Help & Support pages (Help, Feedback, Terms &
 * Conditions, Site Map, Privacy Policy, Disclaimer, Terms of Use) — a
 * plain header over a single prose column, matching this site's existing
 * hero + section rhythm rather than introducing a new layout pattern. */
export function LegalPageShell({
  breadcrumbLabel,
  eyebrow,
  heading,
  intro,
  children,
}: {
  breadcrumbLabel: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      <TopNav />
      <main className="flex-1" id="main-content">
        <Breadcrumb items={[{ label: breadcrumbLabel }]} />
        <section className="bg-canvas">
          <Container className="py-xl md:py-xxl">
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">{eyebrow}</p>
            <h1 className="type-display-lg mb-4 text-ink">{heading}</h1>
            {intro && <p className="type-body-md max-w-[70ch] text-[var(--color-body)]">{intro}</p>}
          </Container>
        </section>
        <section className="bg-canvas-soft">
          <Container className="py-xxl md:py-section">
            <div className="mx-auto flex max-w-[820px] flex-col gap-10">{children}</div>
          </Container>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="type-title-md mb-3 text-ink">{heading}</h2>
      <div className="type-body-md flex flex-col gap-3 text-[var(--color-body)]">{children}</div>
    </div>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="type-body-md flex flex-col gap-2 pl-5 text-[var(--color-body)]" style={{ listStyleType: "disc" }}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
