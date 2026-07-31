"use client";

import { ReactNode, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(Math.max(t, 0), 1);
}
function clamp01(t: number) {
  return Math.min(Math.max(t, 0), 1);
}

// Same constants as the 3-card mechanic on Home (PillarCards) / About
// (Awards): each card-to-card transition covers PER_PHASE_VH of scroll
// distance under a STICKY_VH-tall sticky viewport, so the per-card feel is
// identical no matter how many cards there are — only the total scroll
// length (and therefore how many phases) changes.
const GAP_PX = 20;
const STICKY_VH = 62;
const PER_PHASE_VH = 79;

/**
 * Generalization of the Home/About "next card rises to cover the previous
 * one" mobile mechanic to N cards (those two are hardcoded for exactly 3).
 * Reuse this for any future mobile card stack instead of re-deriving the
 * lerp math — see [[same-card-interaction-standing-rule]].
 */
export function StackedScrollCards<T>({
  items,
  getKey,
  renderCard,
}: {
  items: T[];
  getKey: (item: T) => string;
  renderCard: (item: T, className: string) => ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setProgress(p));

  if (reducedMotion) {
    return (
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={getKey(item)}>{renderCard(item, "h-full")}</div>
        ))}
      </div>
    );
  }

  const numPhases = Math.max(items.length - 1, 1);
  const slotPadding = { paddingTop: GAP_PX / 2, paddingBottom: GAP_PX / 2 } as const;
  const totalHeightVh = STICKY_VH + numPhases * PER_PHASE_VH;

  return (
    <div ref={containerRef} className="relative" style={{ height: `${totalHeightVh}vh` }}>
      <div className="sticky top-20 h-[62vh] w-full overflow-visible">
        {items.map((item, k) => {
          const isFirst = k === 0;
          const isLast = k === items.length - 1;
          const enterPhase = k - 1;
          const recedePhase = k;

          let y: number;
          let scale: number;
          let opacity: number;

          if (isFirst) {
            const t = clamp01(progress * numPhases);
            y = lerp(0, -14, t);
            scale = lerp(1, 0.94, t);
            opacity = lerp(1, 0.45, t);
          } else if (isLast) {
            const boundary = enterPhase / numPhases;
            const t = clamp01((progress - boundary) * numPhases);
            y = lerp(100, 0, t);
            scale = 1;
            opacity = 1;
          } else {
            const boundary = recedePhase / numPhases;
            if (progress < boundary) {
              const t = clamp01((progress - enterPhase / numPhases) * numPhases);
              y = lerp(100, 0, t);
              scale = 1;
              opacity = 1;
            } else {
              const t = clamp01((progress - boundary) * numPhases);
              y = lerp(0, -14, t);
              scale = lerp(1, 0.94, t);
              opacity = lerp(1, 0.45, t);
            }
          }

          return (
            <div
              key={getKey(item)}
              className="absolute inset-0"
              style={{ transform: `translateY(${y}%) scale(${scale})`, opacity, ...slotPadding }}
            >
              {renderCard(item, "h-full")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
