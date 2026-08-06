"use client";

import { useRef } from "react";
import { hero } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroDotCursor } from "./HeroDotCursor";

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const headlineWords = hero.headline.split(" ");

  return (
    <section
      ref={heroRef as React.RefObject<HTMLElement>}
      className="relative flex min-h-[560px] items-center overflow-hidden bg-canvas md:min-h-[680px]"
      id="main-content"
    >
      <HeroDotCursor targetRef={heroRef} />
      <HeroBackdrop />

      <Container className="relative py-xxl md:py-section">
        <div className="mx-auto flex max-w-[820px] flex-col items-center gap-6 text-center">
          <div className="badge-pill gap-2 text-[var(--color-body)]">
            <span
              aria-hidden
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-blue)]"
            />
            <span className="type-caption font-medium">
              Government of Tamil Nadu · Digital Governance
            </span>
          </div>

          {/* Each word is its own inline hover target — the micro
              interaction the redesign asked for on the headline itself,
              rather than a cursor gimmick layered over it. */}
          <h1 className="type-display-mega font-bold text-ink">
            {headlineWords.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="inline-block transition-all duration-300 ease-out hover:-translate-y-1.5 hover:text-[var(--color-primary-blue)]"
              >
                {word}
                {i < headlineWords.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          <p className="type-body-md max-w-[46ch] text-[var(--color-body)]">{hero.tagline}</p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
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
      </Container>
    </section>
  );
}
