"use client";

import { metrics } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";
import { useInViewOnce, useReducedMotion } from "@/lib/hooks";

const FEATURED = metrics[0];
const MINI = [
  { ...metrics[1], shortLabel: "Centres" },
  { ...metrics[4], shortLabel: "Aadhaar Txns" },
  { ...metrics[5], shortLabel: "Docs Secured" },
];

/** Floating glass "impact" card layered over the district map — the
 * dashboard-style visual from the reference hero designs, built from Home's
 * own metrics instead of invented numbers. Desktop-only (mounted inside the
 * same lg:block wrapper as the map), and rides the map's float animation
 * from a separate ancestor layer rather than fighting it on this element. */
export function HeroImpactCard() {
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className="absolute -right-4 top-[8%] z-20 w-[220px] rounded-2xl border border-white/70 bg-surface-card/90 p-5 shadow-[0_20px_50px_rgba(12,10,9,0.18)] backdrop-blur-md md:-right-9 md:w-[236px]"
      style={{
        animation: reducedMotion ? "none" : "hero-impact-float 8s ease-in-out 0.6s infinite",
      }}
    >
      <p className="type-caption-uppercase text-[var(--color-muted)]">Live impact</p>
      <p className="type-display-sm mt-1 text-ink">
        <CountUp value={FEATURED.value} prefix={FEATURED.prefix} suffix={FEATURED.suffix} start={inView} duration={1400} />
      </p>
      <p className="type-caption mt-0.5 text-[var(--color-body)]">{FEATURED.label}</p>

      <div className="mt-4 space-y-2 border-t border-hairline pt-3">
        {MINI.map((m, i) => (
          <div key={m.label} className="flex items-center justify-between gap-2">
            <span className="type-caption truncate text-[var(--color-muted)]">{m.shortLabel}</span>
            <span className="type-caption shrink-0 font-semibold text-ink">
              <CountUp value={m.value} prefix={m.prefix} suffix={m.suffix} start={inView} duration={1200} delay={i * 120} />
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes hero-impact-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
