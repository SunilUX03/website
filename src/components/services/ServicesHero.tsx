import { servicesHero } from "@/lib/services-content";
import { Container } from "@/components/ui/Container";

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-canvas" id="main-content">
      <div
        aria-hidden
        className="orb-drift-a pointer-events-none absolute -left-32 -top-20 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)",
          opacity: 0.5,
        }}
      />
      <div
        aria-hidden
        className="orb-drift-b pointer-events-none absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-mint) 0%, transparent 70%)",
          opacity: 0.4,
        }}
      />

      <Container className="relative py-xxl md:py-section">
        <p className="type-caption-uppercase mb-4 text-[var(--color-muted)]">{servicesHero.eyebrow}</p>
        <h1 className="type-display-mega max-w-3xl text-ink">{servicesHero.headline}</h1>
        <p className="type-body-md mt-6 max-w-[60ch] text-[var(--color-body)]">
          {servicesHero.description}
        </p>
      </Container>
    </section>
  );
}
