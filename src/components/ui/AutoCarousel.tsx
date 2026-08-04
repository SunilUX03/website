"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

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

/**
 * Horizontal carousel that advances on its own, one card at a time, and
 * loops back to the start once it runs past the last card — pausing only
 * while the pointer is actually over the track (not the whole section).
 * By default the arrow buttons are laid out as flex siblings of the track
 * so they never sit over card content — but that reserves horizontal space
 * from the track itself, which can squeeze cards where the extra width
 * matters more than clear-of-content arrows (pass `arrowStyle="overlay"`
 * to instead float the arrows on top of the track's edges, the same way
 * FocusCarousel does, and let cards use the full track width). Cards
 * should be sized narrower than the track itself with `snap-center` (not
 * `snap-start`) so the active card sits centered with both its neighbours
 * peeking at the edges — the cue that there's more in both directions, not
 * just forward.
 *
 * Desktop mouse drag is added by hand (native scroll containers support
 * touch-swipe already, but not click-and-drag); touch devices keep their
 * native swipe behaviour untouched.
 */
export function AutoCarousel({
  children,
  intervalMs = 3000,
  arrowStyle = "outside",
}: {
  children: ReactNode;
  intervalMs?: number;
  arrowStyle?: "outside" | "overlay";
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const drag = useRef({ active: false, startX: 0, startScrollLeft: 0 });

  const stepWidth = () => {
    const el = scrollerRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0");
    return first.getBoundingClientRect().width + gap;
  };

  const advance = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = stepWidth();
    if (!step) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    let target = el.scrollLeft + dir * step;
    // Wrap around instead of just stopping dead at either end, so the
    // deck keeps cycling through every card on its own.
    if (target >= maxScroll - 2) target = 0;
    else if (target < 2) target = maxScroll;
    el.scrollTo({ left: target, behavior: reducedMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (reducedMotion) return;
    const el = scrollerRef.current;
    if (!el || el.scrollWidth <= el.clientWidth + 4) return;
    const timer = setInterval(() => {
      if (!pausedRef.current) advance(1);
    }, intervalMs);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, intervalMs]);

  const onPointerEnter = () => {
    pausedRef.current = true;
  };
  const endInteraction = () => {
    pausedRef.current = false;
    drag.current.active = false;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = drag.current.startScrollLeft - (e.clientX - drag.current.startX);
  };

  const track = (
    <div
      ref={scrollerRef}
      onPointerEnter={onPointerEnter}
      onPointerLeave={endInteraction}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endInteraction}
      className="flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 py-4 [cursor:grab] active:[cursor:grabbing] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </div>
  );

  const leftButtonClass =
    arrowStyle === "overlay"
      ? "absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface-card/95 text-ink shadow-[0_4px_12px_rgba(12,10,9,0.14)] transition-colors hover:bg-[var(--color-surface-strong)] md:h-10 md:w-10"
      : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-card text-ink shadow-[0_4px_12px_rgba(12,10,9,0.10)] transition-colors hover:bg-[var(--color-surface-strong)] md:h-10 md:w-10";
  const rightButtonClass =
    arrowStyle === "overlay"
      ? "absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface-card/95 text-ink shadow-[0_4px_12px_rgba(12,10,9,0.14)] transition-colors hover:bg-[var(--color-surface-strong)] md:h-10 md:w-10"
      : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-card text-ink shadow-[0_4px_12px_rgba(12,10,9,0.10)] transition-colors hover:bg-[var(--color-surface-strong)] md:h-10 md:w-10";

  if (arrowStyle === "overlay") {
    return (
      <div className="relative">
        {track}
        <button type="button" onClick={() => advance(-1)} aria-label="Scroll left" className={leftButtonClass}>
          <ChevronIcon direction="left" className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => advance(1)} aria-label="Scroll right" className={rightButtonClass}>
          <ChevronIcon direction="right" className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <button type="button" onClick={() => advance(-1)} aria-label="Scroll left" className={leftButtonClass}>
        <ChevronIcon direction="left" className="h-4 w-4" />
      </button>

      {track}

      <button type="button" onClick={() => advance(1)} aria-label="Scroll right" className={rightButtonClass}>
        <ChevronIcon direction="right" className="h-4 w-4" />
      </button>
    </div>
  );
}
