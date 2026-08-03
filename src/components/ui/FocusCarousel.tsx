"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ServiceItem } from "@/lib/services-content";
import { ServiceItemCard } from "@/components/services/ServiceItemCard";
import { useIsDesktop, useReducedMotion } from "@/lib/hooks";

/**
 * Centered focus-pull carousel.
 *
 * The active card sits dead-centre at full scale, with the previous and next
 * cards peeking in from either side at reduced scale/opacity. Arrows flank the
 * focused card, dots sit below, and the whole track can be dragged. It
 * auto-advances until the user is interacting with it.
 *
 * Layout maths: cards are laid out on a fixed pitch (card width + gap), so
 * centring card `i` is just a matter of translating the track by
 * `wrapWidth/2 - i*pitch - cardWidth/2`. Scale is a visual transform only and
 * never affects that pitch, which is what keeps the peek symmetrical.
 */

const AUTO_ADVANCE_MS = 4500;
// How far a pointer must travel before we treat the gesture as a drag rather
// than a click on the card underneath.
const DRAG_THRESHOLD_PX = 50;

const DESKTOP_CARD_W = 320;
const DESKTOP_GAP = 24;
const MOBILE_CARD_W = 250;
const MOBILE_GAP = 16;

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

export function FocusCarousel({ items, label }: { items: ServiceItem[]; label: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  const [current, setCurrent] = useState(0);
  const [wrapWidth, setWrapWidth] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const [dragging, setDragging] = useState(false);

  const dragStartX = useRef(0);
  // Set once a pointer gesture passes the threshold, so the click it ends with
  // doesn't also follow the card's link.
  const movedRef = useRef(false);

  const cardW = isDesktop === false ? MOBILE_CARD_W : DESKTOP_CARD_W;
  const gap = isDesktop === false ? MOBILE_GAP : DESKTOP_GAP;
  const pitch = cardW + gap;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + items.length) % items.length);
    },
    [items.length]
  );

  // Measure the viewport we're centring within — it changes with the band's
  // own width, not just the window's (the left panel is a flex sibling).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWrapWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setWrapWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || paused || dragging || items.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [reducedMotion, paused, dragging, items.length]);

  // Drag is tracked on the window so the gesture survives the pointer leaving
  // the carousel mid-swipe.
  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      const delta = e.clientX - dragStartX.current;
      if (Math.abs(delta) > DRAG_THRESHOLD_PX) movedRef.current = true;
      setDragDelta(delta);
    };
    const onUp = (e: PointerEvent) => {
      const delta = e.clientX - dragStartX.current;
      setDragging(false);
      setDragDelta(0);
      if (delta < -DRAG_THRESHOLD_PX) goTo(current + 1);
      else if (delta > DRAG_THRESHOLD_PX) goTo(current - 1);
      // Let the click that ends this gesture be suppressed first, then clear.
      window.setTimeout(() => {
        movedRef.current = false;
      }, 0);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, current, goTo]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStartX.current = e.clientX;
    movedRef.current = false;
    setDragging(true);
  };

  const ready = wrapWidth !== null && isDesktop !== null;
  const offset = (wrapWidth ?? 0) / 2 - current * pitch - cardW / 2 + dragDelta;

  return (
    <div className="min-w-0 flex-1">
      <div
        ref={wrapRef}
        // pan-y keeps vertical page scrolling native while horizontal drags
        // come to us instead of the browser.
        className="relative touch-pan-y select-none overflow-hidden py-6 md:py-7"
        onPointerDown={onPointerDown}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        // A drag that ends over a card would otherwise also activate its link.
        onClickCapture={(e) => {
          if (movedRef.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <ul
          className={`flex items-stretch ${dragging ? "" : "transition-transform duration-[550ms] ease-[cubic-bezier(.22,.9,.34,1)]"}`}
          style={{
            gap: `${gap}px`,
            transform: `translateX(${offset}px)`,
            opacity: ready ? 1 : 0,
            transitionDuration: reducedMotion ? "0ms" : undefined,
            cursor: dragging ? "grabbing" : "grab",
          }}
        >
          {items.map((item, i) => {
            const focused = i === current;
            return (
              <li
                key={item.name}
                className={
                  reducedMotion
                    ? "shrink-0"
                    : "shrink-0 transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(.22,.9,.34,1)]"
                }
                style={{
                  width: `${cardW}px`,
                  transform: focused ? "scale(1)" : "scale(0.88)",
                  opacity: focused ? 1 : 0.5,
                }}
                // Keyboard users tabbing through cards pull focus to centre.
                onFocusCapture={() => goTo(i)}
              >
                <ServiceItemCard
                  item={item}
                  compact
                  className={focused ? "shadow-[0_16px_34px_rgba(12,10,9,0.12)]" : ""}
                />
              </li>
            );
          })}
        </ul>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              aria-label={`Previous ${label}`}
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface-card/95 text-ink shadow-[0_4px_12px_rgba(12,10,9,0.14)] transition-colors hover:bg-[var(--color-surface-strong)] md:h-10 md:w-10"
            >
              <ChevronIcon direction="left" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              aria-label={`Next ${label}`}
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface-card/95 text-ink shadow-[0_4px_12px_rgba(12,10,9,0.14)] transition-colors hover:bg-[var(--color-surface-strong)] md:h-10 md:w-10"
            >
              <ChevronIcon direction="right" className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-6 md:pb-7">
          {items.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${item.name}`}
              aria-current={i === current}
              className={`h-[7px] rounded-full transition-all duration-200 ${
                i === current
                  ? "w-[18px] bg-[var(--color-primary-blue)]"
                  : "w-[7px] bg-[var(--color-hairline-strong)] hover:bg-[var(--color-muted)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
