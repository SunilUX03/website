"use client";

import { useId, useState } from "react";
import { TN_DISTRICTS, TN_MAP_VIEWBOX } from "@/lib/tn-districts";
import { useReducedMotion } from "@/lib/hooks";

export function HeroDistrictMap({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  // This component mounts twice (desktop + mobile-hidden share the page at
  // once) — defs ids must be unique per instance or the visible instance
  // can resolve to a <defs> sitting in the other's display:none subtree.
  const uid = useId();
  const glowId = `districtGlow-${uid}`;
  const sheenId = `sheenGradient-${uid}`;

  const activeDistrict = TN_DISTRICTS.find((d) => d.name === active) ?? null;

  return (
    <div className={className}>
      {/* ambient drifting glow — always present, frozen under reduced motion */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-10 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)",
          opacity: 0.7,
          animation: reducedMotion ? "none" : "hero-orb-drift 22s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 bottom-0 h-[300px] w-[300px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-lavender) 0%, transparent 70%)",
          opacity: 0.55,
          animation: reducedMotion ? "none" : "hero-orb-drift-2 26s ease-in-out infinite",
        }}
      />

      <svg
        viewBox={`0 0 ${TN_MAP_VIEWBOX.width} ${TN_MAP_VIEWBOX.height}`}
        className="relative h-full w-full"
        role="img"
        aria-label="Interactive map of Tamil Nadu districts"
        style={{
          animation: reducedMotion ? "none" : "hero-map-float 9s ease-in-out infinite",
          filter: "drop-shadow(0 18px 30px rgba(29,63,143,0.18))",
        }}
      >
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {!reducedMotion && (
          <g className="hero-map-ambient-sheen" style={{ mixBlendMode: "screen" }}>
            <circle r="140" fill={`url(#${sheenId})`} />
            <radialGradient id={sheenId}>
              <stop offset="0%" stopColor="#a8c8e8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#a8c8e8" stopOpacity="0" />
            </radialGradient>
          </g>
        )}

        {TN_DISTRICTS.map((d) => {
          const isActive = active === d.name;
          return (
            <path
              key={d.name}
              d={d.path}
              fill={isActive ? "#12275c" : "#2d4fa8"}
              fillOpacity={isActive ? 0.98 : 0.55}
              stroke="#f5f5f5"
              strokeWidth={1}
              filter={isActive ? `url(#${glowId})` : undefined}
              style={{ transition: "fill-opacity 220ms ease, fill 220ms ease", cursor: "pointer" }}
              onMouseEnter={() => setActive(d.name)}
              onMouseLeave={() => setActive((cur) => (cur === d.name ? null : cur))}
              onTouchStart={() => setActive((cur) => (cur === d.name ? null : d.name))}
              onClick={() => setActive((cur) => (cur === d.name ? null : d.name))}
            >
              <title>{d.name}</title>
            </path>
          );
        })}
      </svg>

      {/* hover/tap reveal panel — a text card rather than a photo.
          The prototype's example ("345 e-Sevai centres in <district>")
          implied a per-district count, but real per-district figures
          aren't in our dataset and inventing 30 different numbers for a
          government site isn't acceptable. Instead the card names the
          district and states what's true statewide (e-Sevai's own
          published reach), which reads as a genuine "services here"
          affordance without fabricating local data. Swap in real
          per-district counts here if/when they're available. */}
      {activeDistrict && (
        <div
          className="pointer-events-none absolute z-10 w-[210px] overflow-hidden rounded-xl border border-white/60 bg-surface-card shadow-[0_8px_28px_rgba(12,10,9,0.22)]"
          style={{
            left: `${(activeDistrict.cx / TN_MAP_VIEWBOX.width) * 100}%`,
            top: `${(activeDistrict.cy / TN_MAP_VIEWBOX.height) * 100}%`,
            transform: "translate(-50%, -115%)",
          }}
        >
          <div className="px-3 py-2.5">
            <p className="type-body-strong leading-tight text-ink">
              {activeDistrict.name}
            </p>
            <p className="type-caption mt-0.5 text-[var(--color-body)]">
              e-Sevai services available across the district
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes hero-orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-24px, 20px) scale(1.08); }
        }
        @keyframes hero-orb-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(18px, -16px) scale(1.06); }
        }
        .hero-map-ambient-sheen {
          animation: hero-map-sheen-drift 14s ease-in-out infinite;
        }
        @keyframes hero-map-sheen-drift {
          0% { transform: translate(180px, 120px); }
          25% { transform: translate(380px, 300px); }
          50% { transform: translate(220px, 550px); }
          75% { transform: translate(420px, 380px); }
          100% { transform: translate(180px, 120px); }
        }
        @keyframes hero-map-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  );
}
