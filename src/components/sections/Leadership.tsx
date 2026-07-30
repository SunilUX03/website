"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { leadership } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export function Leadership() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [fits, setFits] = useState(false);

  useLayoutEffect(() => {
    const check = () => {
      if (!viewportRef.current || !trackRef.current) return;
      setFits(trackRef.current.scrollWidth <= viewportRef.current.clientWidth + 1);
    };
    check();
    const ro = new ResizeObserver(check);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    viewportRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Leadership</p>
            <h2 className="type-display-lg text-ink">Guiding TNeGA&apos;s mission</h2>
          </div>
          {!fits && (
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
          )}
        </div>

        <div
          ref={viewportRef}
          className={`flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            fits ? "justify-center" : "-mx-6 pl-6 pr-0 md:mx-0 md:pl-0 md:pr-6"
          }`}
        >
          <div ref={trackRef} className="flex gap-5">
            {leadership.map((leader) => (
              <div
                key={leader.name}
                className="card-hover-lift flex min-w-[180px] max-w-[260px] shrink-0 snap-start flex-col items-center gap-4 rounded-xl border border-hairline bg-surface-card p-6 text-center"
              >
                <div className="voice-icon-circular relative h-20 w-20 shrink-0 overflow-hidden">
                  <Image src={leader.photo} alt={leader.name} fill sizes="80px" className="object-cover" />
                </div>
                <div>
                  <p className="type-title-sm text-ink">{leader.name}</p>
                  <p className="type-body-strong mt-1 text-ink">{leader.designation}</p>
                  <p className="type-body-sm mt-1 text-[var(--color-muted)]">{leader.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
