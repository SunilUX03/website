"use client";

import { useRef } from "react";
import { leadership } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export function Leadership() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Leadership</p>
            <h2 className="type-display-lg text-ink">Guiding TNeGA&apos;s mission</h2>
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll leadership left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-strong text-ink hover:bg-surface-strong"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll leadership right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-strong text-ink hover:bg-surface-strong"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 pl-6 pr-0 [scrollbar-width:none] md:mx-0 md:pl-0 md:pr-6 [&::-webkit-scrollbar]:hidden"
        >
          {leadership.map((leader) => (
            <div
              key={leader.name}
              className="card-hover-lift flex w-[220px] shrink-0 snap-start flex-col items-center gap-4 rounded-xl border border-hairline bg-surface-card p-6 text-center"
            >
              <span
                aria-hidden
                className="voice-icon-circular h-20 w-20"
                title={
                  "pending" in leader && leader.pending
                    ? "Portrait pending"
                    : `${leader.name} (portrait pending)`
                }
              />
              <div>
                <p className="type-title-sm text-ink">{leader.name}</p>
                <p className="type-body-sm mt-1 text-[var(--color-muted)]">{leader.title}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
