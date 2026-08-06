"use client";

import { useReducedMotion } from "@/lib/hooks";

const PETALS = 8;
const RADIUS = 120;
const PETAL_WIDTH = 34;

// A single symmetric petal, tip pointing "up" from the origin — two
// quadratic curves bulging left/right of the centerline. Rotated around a
// shared center at even angles, this is the same two ingredients every
// traditional kolam is drawn from (dots + one continuous looping line),
// composed here as an original lotus-flower form rather than a copy of a
// specific named design.
const PETAL_PATH = `M0,0 Q${PETAL_WIDTH},${-RADIUS * 0.55} 0,${-RADIUS} Q${-PETAL_WIDTH},${-RADIUS * 0.55} 0,0 Z`;

// Rounded to a fixed precision: Math.cos/Math.sin can return a value that
// differs in its last digit between the server's Node runtime and the
// browser, which React flags as a hydration mismatch on these attributes.
const OUTER_DOTS = Array.from({ length: PETALS * 2 }, (_, i) => {
  const angle = (i / (PETALS * 2)) * Math.PI * 2;
  const r = RADIUS + 46;
  return { x: Math.round(Math.cos(angle) * r * 100) / 100, y: Math.round(Math.sin(angle) * r * 100) / 100 };
});

/**
 * Abstract kolam-inspired motif for the hero backdrop — replaces the old
 * cursor-reactive dot/line network, which is exactly the "interaction"
 * feedback said people didn't like. This is static except for a very slow
 * whole-motif breathe (opacity + a hair of scale); it never tracks or
 * responds to the pointer.
 */
export function TamilMotifBackdrop({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="-260 -260 520 520"
      className={className}
      aria-hidden
      style={{
        transformOrigin: "center",
        animation: reducedMotion ? "none" : "kolam-breathe 26s ease-in-out infinite",
      }}
    >
      <g stroke="var(--color-primary-blue)" strokeWidth="1.4" fill="none" opacity="0.4">
        {Array.from({ length: PETALS }, (_, i) => (
          <path key={i} d={PETAL_PATH} transform={`rotate(${(360 / PETALS) * i})`} />
        ))}
      </g>
      <circle r={RADIUS * 0.42} stroke="var(--color-gradient-lavender)" strokeWidth="1.2" fill="none" opacity="0.5" />
      {OUTER_DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={2.2} fill="var(--color-gradient-sky)" opacity="0.5" />
      ))}
      <circle r="3" fill="var(--color-primary-blue)" opacity="0.5" />
    </svg>
  );
}
