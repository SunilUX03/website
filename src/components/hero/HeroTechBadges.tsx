"use client";

import { ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks";

// Purely decorative, additive layer floating around the district map —
// signals "this is a tech agency" at a glance without claiming any
// per-district fact (the map itself deliberately avoids inventing
// per-district numbers, see HeroDistrictMap). Four generic, true
// categories of TNeGA's actual work, reusing the same descriptive
// language as About's "What We Do" cards rather than one-off copy.

function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M2 8.5a15 15 0 0 1 20 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5.5 12.5a10 10 0 0 1 13 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 16.5a5 5 0 0 1 6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <rect x="3" y="4" width="18" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="7" cy="7" r="1" fill="currentColor" />
      <circle cx="7" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CpuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <rect x="7" y="7" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M8 5 2 12l6 7M16 5l6 7-6 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M19 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" fill="currentColor" />
    </svg>
  );
}

// Six categories around the map's perimeter (corners + mid-edges) rather
// than four — kept as pure text/icon labels, never a per-district claim.
const BADGES: { icon: ReactNode; label: string; className: string; delay: number }[] = [
  { icon: <ServerIcon />, label: "Cloud Infrastructure", className: "-left-2 -top-1", delay: 0 },
  { icon: <WifiIcon />, label: "Statewide Network", className: "-right-2 top-10", delay: 1.4 },
  { icon: <CodeIcon />, label: "Software Development", className: "-left-10 top-[36%]", delay: 2 },
  { icon: <SparkleIcon />, label: "AI", className: "-right-6 top-1/2 -translate-y-1/2", delay: 3.2 },
  { icon: <ShieldIcon />, label: "Data Security", className: "-left-2 bottom-16", delay: 2.6 },
  { icon: <CpuIcon />, label: "Data Analytics", className: "-right-2 -bottom-1", delay: 0.8 },
];

export function HeroTechBadges() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      {BADGES.map((badge) => (
        <div
          key={badge.label}
          className={`absolute flex items-center gap-1.5 rounded-full border border-white/70 bg-surface-card/90 py-1.5 pl-1.5 pr-3 shadow-[0_8px_20px_rgba(12,10,9,0.14)] backdrop-blur-sm ${badge.className}`}
          style={{
            animation: reducedMotion ? "none" : `hero-badge-float 7s ease-in-out ${badge.delay}s infinite`,
          }}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-blue)] text-white">
            {badge.icon}
          </span>
          <span className="type-caption whitespace-nowrap font-medium text-ink">{badge.label}</span>
        </div>
      ))}

      <style>{`
        @keyframes hero-badge-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
