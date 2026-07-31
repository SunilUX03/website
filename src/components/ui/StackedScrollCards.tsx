"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(Math.max(t, 0), 1);
}
function clamp01(t: number) {
  return Math.min(Math.max(t, 0), 1);
}

// Same constants as the 3-card mechanic on Home (PillarCards) / About
// (Awards): each card-to-card transition covers PER_PHASE_DVH of scroll
// distance under a STICKY_DVH-tall sticky viewport, so the per-card feel is
// identical no matter how many cards there are — only the total scroll
// length (and therefore how many phases) changes.
//
// Uses `dvh` (dynamic viewport height), not `vh`: on mobile, `vh` is fixed
// to the *smallest* viewport and doesn't account for the address bar
// collapsing as the user scrolls, so a very tall vh-based container (this
// generalizes to 13-24 cards, vs. the original's 3 — proportionally much
// taller) visibly drifts out of sync with real scroll position mid-gesture.
// `dvh` tracks the actual current viewport and avoids that drift.
const GAP_PX = 20;
const STICKY_DVH = 62;
const PER_PHASE_DVH = 79;

function computePhase(
  progress: number,
  index: number,
  total: number,
  numPhases: number
): { y: number; scale: number; opacity: number } {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const enterPhase = index - 1;
  const recedePhase = index;

  if (isFirst) {
    const t = clamp01(progress * numPhases);
    return { y: lerp(0, -14, t), scale: lerp(1, 0.94, t), opacity: lerp(1, 0.45, t) };
  }
  if (isLast) {
    const boundary = enterPhase / numPhases;
    const t = clamp01((progress - boundary) * numPhases);
    return { y: lerp(100, 0, t), scale: 1, opacity: 1 };
  }
  const boundary = recedePhase / numPhases;
  if (progress < boundary) {
    const t = clamp01((progress - enterPhase / numPhases) * numPhases);
    return { y: lerp(100, 0, t), scale: 1, opacity: 1 };
  }
  const t = clamp01((progress - boundary) * numPhases);
  return { y: lerp(0, -14, t), scale: lerp(1, 0.94, t), opacity: lerp(1, 0.45, t) };
}

function StackedCard({
  scrollYProgress,
  index,
  total,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
  children: ReactNode;
}) {
  const numPhases = Math.max(total - 1, 1);
  // Each of y/scale/opacity is its own MotionValue subscription — framer-
  // motion writes these straight to the DOM style on scroll, without going
  // through React state/re-render (unlike the previous useState +
  // useMotionValueEvent version, which re-rendered every card on every
  // scroll frame — fine for 3 cards, but a real perf cost at 13-24).
  const y = useTransform(scrollYProgress, (p) => `${computePhase(p, index, total, numPhases).y}%`);
  const scale = useTransform(scrollYProgress, (p) => computePhase(p, index, total, numPhases).scale);
  const opacity = useTransform(scrollYProgress, (p) => computePhase(p, index, total, numPhases).opacity);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ y, scale, opacity, paddingTop: GAP_PX / 2, paddingBottom: GAP_PX / 2 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Generalization of the Home/About "next card rises to cover the previous
 * one" mobile mechanic to N cards (those two are hardcoded for exactly 3).
 * Reuse this for any future mobile card stack instead of re-deriving the
 * lerp math — see [[same-card-interaction-standing-rule]].
 *
 * `topPx` — pixels this sticks below the viewport top. Defaults to 80 (the
 * scrolled main nav's height, matching Home/About). Pages with an extra
 * sticky layer between the nav and this component (e.g. a sticky tab bar)
 * should pass nav height + that layer's rendered height so the sticky card
 * viewport sits below *both*, not underneath/overlapping either.
 */
export function StackedScrollCards<T>({
  items,
  getKey,
  renderCard,
  topPx = 80,
}: {
  items: T[];
  getKey: (item: T) => string;
  renderCard: (item: T, className: string) => ReactNode;
  topPx?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

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
  const totalHeightDvh = STICKY_DVH + numPhases * PER_PHASE_DVH;

  return (
    <div ref={containerRef} className="relative" style={{ height: `${totalHeightDvh}dvh` }}>
      <div className="sticky w-full overflow-visible" style={{ top: topPx, height: "62dvh" }}>
        {items.map((item, k) => (
          <StackedCard key={getKey(item)} scrollYProgress={scrollYProgress} index={k} total={items.length}>
            {renderCard(item, "h-full")}
          </StackedCard>
        ))}
      </div>
    </div>
  );
}
