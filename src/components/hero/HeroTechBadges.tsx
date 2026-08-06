"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";

// Purely decorative, additive layer floating around the district map —
// framed around TNeGA's governance mission rather than generic tech-stack
// buzzwords. Pure mission/role statements, never a per-district claim or
// invented figure.

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 20h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

type Corner = "tl" | "tr" | "ml" | "mr" | "bl" | "br";

// Corners around the map's perimeter — kept as pure text/icon labels, never
// a per-district claim. The right side (tr/mr) is left free on purpose:
// HeroImpactCard now floats there, and stacking a badge on top of it there
// was a losing fight for space at anything but the widest viewports.
const BADGES: { icon: ReactNode; label: string; corner: Corner; delay: number }[] = [
  { icon: <BoltIcon />, label: "Powering Governance", corner: "tl", delay: 0 },
  { icon: <ChartIcon />, label: "Transforming Public Services", corner: "ml", delay: 2 },
  { icon: <MapPinIcon />, label: "Enabling Digital Tamil Nadu", corner: "bl", delay: 2.6 },
  { icon: <CpuIcon />, label: "Driving e-Governance", corner: "br", delay: 0.8 },
];

// Fixed gap between a badge and the map's actual rendered edge. Tamil
// Nadu's silhouette bulges unevenly past its own rectangular bounding box
// (e.g. near the Nilgiris in the west, and around Kanyakumari in the
// south), so a gap this size is needed to actually clear the district
// shapes at every corner — a tighter gap reads fine against the box but
// visibly overlaps the map where it bulges past it.
const GAP_PX = 34;

// Rough width estimate per badge (icon circle + padding + label text) —
// used to keep the clamp below from just bounding the anchor point (which
// left the badge's own rendered box free to overflow past it) and instead
// keep the badge's actual far edge inside the container.
const BADGE_HEIGHT = 38;
function estimateBadgeWidth(label: string) {
  return Math.round(label.length * 7.6 + 56);
}

interface MapBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
  containerWidth: number;
  containerHeight: number;
}

// How far an anchor point may sit outside the container's own box before
// it gets clamped back in. The SVG keeps its own aspect ratio inside a
// column that's a fixed height but flexible width, so at very wide
// viewports it can letterbox with a lot of empty margin on its sides —
// without this clamp, a badge anchored to "just past the map's edge"
// could drift far enough left to land on the hero's text column instead.
const CLAMP_INSET = 24;

export function HeroTechBadges() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mapBox, setMapBox] = useState<MapBox | null>(null);

  // The map's on-screen rect shifts with viewport width — its column is a
  // fixed height but flexible width, so the SVG (which keeps its own
  // aspect ratio) letterboxes differently at different sizes. Measuring
  // the actual rendered rect (instead of guessing fixed pixel offsets) is
  // what keeps badges hugging the map rather than drifting onto it.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const svg = container.parentElement?.querySelector<SVGSVGElement>(
      'svg[aria-label="Interactive map of Tamil Nadu districts"]'
    );
    if (!svg) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      setMapBox({
        left: svgRect.left - containerRect.left,
        right: svgRect.right - containerRect.left,
        top: svgRect.top - containerRect.top,
        bottom: svgRect.bottom - containerRect.top,
        containerWidth: containerRect.width,
        containerHeight: containerRect.height,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Each clamp keeps the badge's actual rendered box (not just its anchor
  // point) inside the container — clamping the anchor alone still let a
  // wide badge's own box overflow past it, which is what let "Software
  // Development" drift onto the hero's text column at some widths even
  // after the anchor itself was bounded.
  const clampLeftAnchor = (x: number, size: number, containerSize: number) =>
    Math.min(Math.max(x, CLAMP_INSET + size), containerSize - CLAMP_INSET);
  const clampRightAnchor = (x: number, size: number, containerSize: number) =>
    Math.min(Math.max(x, CLAMP_INSET), containerSize - CLAMP_INSET - size);
  const clampCenterAnchor = (x: number, size: number, containerSize: number) =>
    Math.min(Math.max(x, CLAMP_INSET + size / 2), containerSize - CLAMP_INSET - size / 2);

  const positionFor = (badge: { label: string; corner: Corner }): React.CSSProperties => {
    if (!mapBox) return { opacity: 0 };
    const width = estimateBadgeWidth(badge.label);
    const height = BADGE_HEIGHT;
    const midY = (mapBox.top + mapBox.bottom) / 2;

    switch (badge.corner) {
      case "tl":
        return {
          left: clampLeftAnchor(mapBox.left - GAP_PX, width, mapBox.containerWidth),
          top: clampLeftAnchor(mapBox.top - GAP_PX, height, mapBox.containerHeight),
          transform: "translate(-100%, -100%)",
        };
      case "tr":
        return {
          left: clampRightAnchor(mapBox.right + GAP_PX, width, mapBox.containerWidth),
          top: clampLeftAnchor(mapBox.top - GAP_PX, height, mapBox.containerHeight),
          transform: "translate(0, -100%)",
        };
      case "ml":
        return {
          left: clampLeftAnchor(mapBox.left - GAP_PX, width, mapBox.containerWidth),
          top: clampCenterAnchor(midY, height, mapBox.containerHeight),
          transform: "translate(-100%, -50%)",
        };
      case "mr":
        return {
          left: clampRightAnchor(mapBox.right + GAP_PX, width, mapBox.containerWidth),
          top: clampCenterAnchor(midY, height, mapBox.containerHeight),
          transform: "translate(0, -50%)",
        };
      case "bl":
        return {
          left: clampLeftAnchor(mapBox.left - GAP_PX, width, mapBox.containerWidth),
          top: clampRightAnchor(mapBox.bottom + GAP_PX, height, mapBox.containerHeight),
          transform: "translate(-100%, 0)",
        };
      case "br":
        return {
          left: clampRightAnchor(mapBox.right + GAP_PX, width, mapBox.containerWidth),
          top: clampRightAnchor(mapBox.bottom + GAP_PX, height, mapBox.containerHeight),
          transform: "translate(0, 0)",
        };
    }
  };

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      {BADGES.map((badge) => (
        // Two layers on purpose: the outer div's `transform` anchors the
        // badge to its measured corner (e.g. translate(-100%,-100%)) and
        // must stay static; the inner div's `transform` drives the float
        // animation. A CSS animation on `transform` replaces the whole
        // property rather than composing with it, so putting both on one
        // element would make the float animation snap the badge back to
        // its un-anchored top-left position every frame.
        <div key={badge.label} className="absolute transition-opacity duration-300" style={positionFor(badge)}>
          <div
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/70 bg-surface-card/90 py-1.5 pl-1.5 pr-3 shadow-[0_8px_20px_rgba(12,10,9,0.14)] backdrop-blur-sm"
            style={{
              animation: reducedMotion || !mapBox ? "none" : `hero-badge-float 7s ease-in-out ${badge.delay}s infinite`,
            }}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-blue)] text-white">
              {badge.icon}
            </span>
            <span className="type-caption font-medium text-ink">{badge.label}</span>
          </div>
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
