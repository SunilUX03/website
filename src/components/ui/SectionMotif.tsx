"use client";

import { useId } from "react";

/**
 * Very low-opacity decorative background pattern combining a tech
 * (circuit-trace) motif with a Tamil kolam-style geometric dot/loop motif.
 * Pure decoration — kept faint enough that it reads as texture, not
 * something a user consciously notices while reading card content on top.
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
        <pattern id={patternId} width="120" height="120" patternUnits="userSpaceOnUse">
          {/* kolam-style dot grid with looping curves */}
          <circle cx="20" cy="20" r="2.2" fill="var(--color-muted-soft)" />
          <circle cx="100" cy="20" r="2.2" fill="var(--color-muted-soft)" />
          <circle cx="20" cy="100" r="2.2" fill="var(--color-muted-soft)" />
          <circle cx="100" cy="100" r="2.2" fill="var(--color-muted-soft)" />
          <circle cx="60" cy="60" r="2.2" fill="var(--color-muted-soft)" />
          <path
            d="M20,20 C45,10 55,45 60,60 C65,75 95,85 100,100"
            fill="none"
            stroke="var(--color-hairline-strong)"
            strokeWidth="1"
          />
          <path
            d="M100,20 C75,30 65,45 60,60 C55,75 45,90 20,100"
            fill="none"
            stroke="var(--color-hairline-strong)"
            strokeWidth="1"
          />
          {/* circuit-trace lines */}
          <path
            d="M0,60 H35 M85,60 H120 M60,0 V25 M60,95 V120"
            fill="none"
            stroke="var(--color-hairline-strong)"
            strokeWidth="1"
          />
          <circle cx="35" cy="60" r="1.6" fill="var(--color-hairline-strong)" />
          <circle cx="85" cy="60" r="1.6" fill="var(--color-hairline-strong)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
