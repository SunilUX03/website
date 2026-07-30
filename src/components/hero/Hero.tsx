import { hero } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { LeadershipCard } from "./LeadershipCard";
import { NodeGraphCanvas } from "./NodeGraphCanvas";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas" id="main-content">
      {/* Mobile: canvas sits behind the text column at reduced opacity */}
      <div className="absolute inset-0 opacity-[0.32] lg:hidden" aria-hidden>
        <NodeGraphCanvas className="h-full w-full" />
      </div>

      <Container className="relative py-xxl md:py-section">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[46%_54%] lg:gap-8">
          {/* Left column — text */}
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              {hero.leaders.map((leader) => (
                <LeadershipCard key={leader.name} {...leader} />
              ))}
            </div>

            <p className="type-caption-uppercase text-[var(--color-muted)]">
              {hero.eyebrow}
            </p>

            <h1 className="type-display-mega text-ink">{hero.headline}</h1>

            <p className="type-body-md max-w-[52ch] text-[var(--color-body)]">
              {hero.description}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a href="/about" className="type-button btn-primary">
                About us
              </a>
              <a href="/services" className="type-button btn-outline">
                View services
              </a>
            </div>
          </div>

          {/* Right column — desktop-only interactive canvas panel */}
          <div className="relative hidden h-[520px] lg:block">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-[420px] w-[420px] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)",
                opacity: 0.55,
                animation: "hero-orb-drift 22s ease-in-out infinite",
              }}
            />
            <NodeGraphCanvas className="relative h-full w-full" />
          </div>
        </div>
      </Container>

      <style>{`
        @keyframes hero-orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-24px, 20px) scale(1.08); }
        }
      `}</style>
    </section>
  );
}
