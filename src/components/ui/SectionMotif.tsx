"use client";

import { useId } from "react";

/**
 * Decorative background pattern combining a tech (circuit-trace) motif
 * with a Tamil kolam-style geometric dot/loop motif — repeating diamond
 * petals around a dot grid, echoing traditional kolam line-work, plus
 * straight circuit traces linking the dots. Pure decoration; opacity is
 * controlled by the caller via `className` so it can be tuned per
 * background (needs a touch more on a flat canvas than on a tinted one).
 */
export function SectionMotif({ className }: { className?: string }) {
  const id = useId();
  const patternId = `motif-${id}`;

  return (
    <svg
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <defs>
        <pattern id={patternId} width="140" height="140" patternUnits="userSpaceOnUse">
          {/* kolam-style petal loops around each grid dot */}
          {[
            [20, 20],
            [120, 20],
            [20, 120],
            [120, 120],
            [70, 70],
          ].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r="2.6" fill="var(--color-muted)" />
              <path
                d={`M${cx},${cy - 16} C${cx + 12},${cy - 12} ${cx + 12},${cy + 12} ${cx},${cy + 16} C${cx - 12},${cy + 12} ${cx - 12},${cy - 12} ${cx},${cy - 16}Z`}
                fill="none"
                stroke="var(--color-primary-blue)"
                strokeWidth="0.9"
              />
            </g>
          ))}

          {/* connecting kolam curves between dots */}
          <path
            d="M20,20 C45,10 55,45 70,70 C85,95 95,105 120,120"
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth="1"
          />
          <path
            d="M120,20 C95,30 85,45 70,70 C55,95 45,110 20,120"
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth="1"
          />

          {/* circuit traces */}
          <path
            d="M0,70 H54 M86,70 H140 M70,0 V54 M70,86 V140"
            fill="none"
            stroke="var(--color-primary-blue)"
            strokeWidth="1"
          />
          <circle cx="54" cy="70" r="1.8" fill="var(--color-primary-blue)" />
          <circle cx="86" cy="70" r="1.8" fill="var(--color-primary-blue)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
