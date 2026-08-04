"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(Math.max(t, 0), 1);
}

// Smooth ease-in-out so a card glides into place and settles, instead of
// travelling at a constant rate and stopping dead.
function easeInOut(t: number) {
  const c = Math.min(Math.max(t, 0), 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

// How far a receded card sits behind the top of the stack, and how much it
// shrinks / fades — tuned so the previous card clearly peeks out above the
// active one rather than vanishing.
const RECEDE_Y = -8; // % upward per level behind
const RECEDE_SCALE = 0.05; // scale lost per level behind
const RECEDE_OPACITY = 0.4; // opacity floor for the deepest visible card

/**
 * Shared mobile card-deck scroll animation.
 *
 * As the user scrolls, cards stack like a physical deck: the active card
 * sits on top; cards already passed recede behind and slightly up so they
 * stay visible peeking out; the incoming card eases up from below to
 * settle on top. Scrolling up reverses the sequence naturally because
 * every transform is a pure function of scroll progress.
 *
 * Each card is centered by a stable outer wrapper; only the inner element
 * carries the scroll-driven transform (keeping the two separate is what
 * prevents the card from drifting off the left edge). Cards size to their
 * own content height — no fixed viewport height stretching them.
 *
 * Services page's own mobile card grid — see [[same-card-interaction-standing-rule]].
 */
export function MobileCardStack<T>({
  items,
  renderCard,
  getKey,
  topPx = 80,
  deckHeightVh = 70,
}: {
  items: T[];
  renderCard: (item: T) => ReactNode;
  getKey: (item: T, index: number) => string;
  /** Pixels this sticks below the viewport top. Defaults to 80 (the
   * scrolled main nav's height). Pages with an extra sticky layer between
   * the nav and this component (e.g. Services' sticky tab bar) should pass
   * nav height + that layer's rendered height so this sticks below both. */
  topPx?: number;
  /** Height (as vh) of the sticky deck viewport. Cards center within it, so
   * a taller value reads as more empty space above the card on first
   * scroll-into-view — lower this for sections that sit right under a
   * short heading. Defaults to 70 (Home/Services' original value). */
  deckHeightVh?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  // Plain scroll listener rather than framer-motion's useScroll — same
  // "start start" → "end end" progress math, but self-contained and easy
  // to reason about/instrument directly while chasing the "stuck on the
  // first card" report, instead of trusting a third-party hook's internals.
  useEffect(() => {
    const compute = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      setProgress(p);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const count = items.length;
  const segments = Math.max(count - 1, 1);

  return (
    // ~150vh of scroll room per hand-off so nothing feels rushed.
    <div ref={containerRef} className="relative" style={{ height: `${100 + segments * 150}vh` }}>
      <div
        className="sticky flex w-full items-center justify-center overflow-visible"
        style={{ top: topPx, height: `${deckHeightVh}vh` }}
      >
        {items.map((item, i) => {
          const scrollPos = progress * segments;
          const delta = i - scrollPos;

          let translateY: number;
          let scale: number;
          let opacity: number;
          let zIndex: number;

          if (delta >= 1) {
            translateY = 100;
            scale = 1;
            opacity = 0;
            zIndex = 0;
          } else if (delta > 0) {
            const t = easeInOut(1 - delta);
            translateY = lerp(100, 0, t);
            scale = 1;
            opacity = lerp(0, 1, Math.min(t * 1.4, 1));
            zIndex = 10 + i;
          } else {
            const behind = -delta;
            const t = easeInOut(Math.min(behind, 1));
            translateY = RECEDE_Y * behind;
            scale = 1 - RECEDE_SCALE * behind;
            opacity = lerp(1, RECEDE_OPACITY, t);
            zIndex = 10 - Math.ceil(behind);
          }

          return (
            <div
              key={getKey(item, i)}
              className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-center"
              style={{ zIndex }}
            >
              {/* No side padding or max-width here — this should render at
                  exactly the same width as the section's intro card above
                  it (which just fills the shared Container's own padding),
                  not a narrower inset card. */}
              <div
                className="pointer-events-auto w-full"
                style={{
                  transform: `translateY(-50%) translateY(${translateY}%) scale(${scale})`,
                  opacity,
                  transformOrigin: "center center",
                  willChange: "transform, opacity",
                }}
              >
                {renderCard(item)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
