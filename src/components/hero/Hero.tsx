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

      {/* Ambient node-graph background, restored per feedback — spans the
          whole hero, behind everything else (including the district map,
          which is unchanged and layered on top of this). */}
      <div className="absolute inset-0" aria-hidden>
        <NodeGraphCanvas className="h-full w-full" />
      </div>

      {/* Mobile: map sits behind the text column at reduced opacity */}
      <div className="absolute inset-0 opacity-[0.32] lg:hidden" aria-hidden>
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
              <a href="/services" className="type-button btn-outline">
                View services
              </a>
            </div>
          </div>

          {/* Right column — desktop-only interactive district map */}
          <div className="relative hidden h-[560px] lg:block">
            <HeroDistrictMap className="relative h-full w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
