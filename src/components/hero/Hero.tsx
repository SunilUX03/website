"use client";

import { useRef } from "react";
import { hero } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { LeadershipCard } from "./LeadershipCard";
import { HeroDistrictMap } from "./HeroDistrictMap";
import { HeroDotCursor } from "./HeroDotCursor";
import { NodeGraphCanvas } from "./NodeGraphCanvas";

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={heroRef as React.RefObject<HTMLElement>}
      className="relative overflow-hidden bg-canvas"
      id="main-content"
    >
      <HeroDotCursor targetRef={heroRef} />

      {/* Cinematic depth backdrop — a soft cool "spotlight" glow pooled
          behind where the district map sits (drawing the eye there and
          giving the blue districts/nodes more pop against the canvas),
          plus a very light vignette at the outer edges for framing. Pure
          CSS, sits behind the node-graph and the map — neither of those
          is touched. */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 900px 720px at 72% 46%, rgba(29,63,143,0.09) 0%, rgba(168,200,232,0.06) 42%, transparent 72%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 58%, rgba(12,10,9,0.05) 100%)",
        }}
      />

      {/* Ambient node-graph background — spans the whole hero, explicitly
          the lowest layer (z-0) so its dots/lines never paint over the
          district map, which sits above it. */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <NodeGraphCanvas className="h-full w-full" />
      </div>

      {/* Mobile: map sits behind the text column at reduced opacity */}
      <div className="absolute inset-0 z-0 opacity-[0.32] lg:hidden" aria-hidden>
        <HeroDistrictMap className="relative h-full w-full" />
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

            <h1 className="type-display-mega text-ink">{hero.headline}</h1>

            <p className="type-body-md max-w-[52ch] text-[var(--color-body)]">
              {hero.description}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a href="/about" className="type-button btn-primary">
                About us
              </a>
              <a
                href="/services"
                className="type-button btn-outline bg-surface-card shadow-[0_1px_3px_rgba(12,10,9,0.06)] hover:bg-canvas-soft"
              >
                View services
              </a>
            </div>
          </div>

          {/* Right column — desktop-only interactive district map, lifted
              above the node-graph layer so the map (and its hover targets)
              sit on top of the ambient interactions rather than under. */}
          <div className="relative z-10 hidden h-[560px] lg:block">
            <HeroDistrictMap className="relative h-full w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
