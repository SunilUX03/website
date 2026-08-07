"use client";

import { ReactNode, useRef } from "react";

function ChevronIcon({ direction, className }: { direction: "left" | "right"; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Horizontally-scrolling row of cards with arrow controls — caller wraps
 * each child in its own fixed/min-width wrapper so this stays unopinionated
 * about card size. Used wherever a section may hold more items than fit in
 * a static grid (e.g. Related items). */
export function CardCarousel({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const firstItem = el.firstElementChild as HTMLElement | null;
    const amount = firstItem ? firstItem.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface-card/95 text-ink shadow-[0_4px_12px_rgba(12,10,9,0.14)] transition-colors hover:bg-[var(--color-surface-strong)] md:h-10 md:w-10"
      >
        <ChevronIcon direction="left" className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface-card/95 text-ink shadow-[0_4px_12px_rgba(12,10,9,0.14)] transition-colors hover:bg-[var(--color-surface-strong)] md:h-10 md:w-10"
      >
        <ChevronIcon direction="right" className="h-4 w-4" />
      </button>
    </div>
  );
}
