"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/hooks";

// Simplified, hand-drawn Tamil Nadu silhouette (not a traced geographic
// dataset) — a flat-design approximation, plenty legible as "the wedge-
// shaped southern state tapering to a point at Kanyakumari" at hero scale.
const TN_PATH =
  "M95,15 L210,10 L250,45 L260,110 L245,180 L265,220 L240,260 L215,330 " +
  "L185,410 L170,435 L140,390 L100,330 L70,260 L65,190 L50,150 L80,100 " +
  "L60,50 Z";

const VIEW_W = 320;
const VIEW_H = 460;

// Anchor points (in viewBox units) used both for the dashed connectivity
// arcs and for placing the photo cutouts "within/around" the silhouette.
const NODES = {
  chennai: { x: 235, y: 90 },
  coimbatore: { x: 80, y: 180 },
  madurai: { x: 165, y: 300 },
  kanyakumari: { x: 172, y: 420 },
  offState1: { x: 20, y: 90 },
  offState2: { x: 290, y: 260 },
};

const ARCS: [keyof typeof NODES, keyof typeof NODES][] = [
  ["offState1", "chennai"],
  ["chennai", "coimbatore"],
  ["chennai", "madurai"],
  ["coimbatore", "madurai"],
  ["madurai", "kanyakumari"],
  ["madurai", "offState2"],
];

interface PhotoCutout {
  key: string;
  seed: string;
  alt: string;
  x: number;
  y: number;
  size: number;
}

// Real citizen photography still pending (per the brief) — seeded
// placeholder photos with a blue duotone treatment stand in until
// appropriately-licensed final images are supplied.
const PHOTOS: PhotoCutout[] = [
  { key: "student", seed: "tnega-hero-student-laptop", alt: "Student studying with a laptop", x: 232, y: 70, size: 92 },
  { key: "flowers", seed: "tnega-hero-woman-flowers", alt: "Woman threading flowers into a basket", x: 40, y: 130, size: 84 },
  { key: "worker", seed: "tnega-hero-worker-hardhat", alt: "Worker with a hard hat using a laptop", x: 250, y: 250, size: 88 },
  { key: "phone", seed: "tnega-hero-man-phone", alt: "Man checking his phone", x: 90, y: 350, size: 80 },
];

function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 18;
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
}

export function HeroMapVisual({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [bright, setBright] = useState<Record<string, number>>({});
  // This component mounts twice (desktop + mobile-hidden variants share the
  // page at once), so gradient/clip IDs must be unique per instance —
  // otherwise the visible instance's fill can resolve to a <defs> sitting
  // inside the other instance's display:none subtree and paint nothing.
  const uid = useId();
  const fillId = `tnFill-${uid}`;
  const clipId = `tnClip-${uid}`;

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const positions: { key: string; x: number; y: number }[] = [
      ...PHOTOS.map((p) => ({ key: p.key, x: p.x, y: p.y })),
      ...ARCS.map(([a, b], i) => {
        const pa = NODES[a];
        const pb = NODES[b];
        return { key: `arc-${i}`, x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
      }),
    ];

    let raf = 0;
    const handlePointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const px = ((clientX - rect.left) / rect.width) * VIEW_W;
      const py = ((clientY - rect.top) / rect.height) * VIEW_H;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next: Record<string, number> = {};
        for (const p of positions) {
          const dist = Math.hypot(p.x - px, p.y - py);
          next[p.key] = Math.max(0, 1 - dist / 110);
        }
        setBright(next);
      });
    };

    const onMove = (e: PointerEvent) => handlePointer(e.clientX, e.clientY);
    const onLeave = () => setBright({});
    const onTap = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      handlePointer(e.clientX, e.clientY);
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    container.addEventListener("pointerdown", onTap);
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      container.removeEventListener("pointerdown", onTap);
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className={className} style={{ touchAction: "pan-y" }}>
      {/* ambient gradient-sky orb, drifting behind the whole composition */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-[380px] w-[380px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)",
          opacity: 0.5,
          animation: reducedMotion ? "none" : "hero-orb-drift 22s ease-in-out infinite",
        }}
      />

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="relative h-full w-full"
        style={{ overflow: "visible" }}
        aria-hidden
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#3a63c8" />
            <stop offset="100%" stopColor="#152a63" />
          </linearGradient>
          <clipPath id={clipId}>
            <path d={TN_PATH} />
          </clipPath>
        </defs>

        <path
          d={TN_PATH}
          fill={`url(#${fillId})`}
          className={reducedMotion ? "" : "hero-map-pulse"}
        />

        {/* dashed connectivity arcs — a soft dark "casing" underneath the
            white dashes so they stay legible whether they're crossing the
            blue map fill or the light canvas around it */}
        {ARCS.map(([a, b], i) => {
          const key = `arc-${i}`;
          const intensity = bright[key] ?? 0;
          const d = arcPath(NODES[a], NODES[b]);
          return (
            <g key={key}>
              <path d={d} fill="none" stroke="rgba(12,10,9,0.18)" strokeWidth={3} strokeLinecap="round" />
              <path
                d={d}
                fill="none"
                stroke="#ffffff"
                strokeWidth={1.2}
                strokeDasharray="5 5"
                strokeLinecap="round"
                opacity={0.55 + intensity * 0.45}
                className={reducedMotion ? "" : "hero-arc-drift"}
                style={{ animationDelay: `${i * 0.6}s` }}
              />
            </g>
          );
        })}

        {/* photo cutouts — duotone-treated, layered within/around the map */}
        {PHOTOS.map((photo) => {
          const intensity = bright[photo.key] ?? 0;
          return (
            <foreignObject
              key={photo.key}
              x={photo.x - photo.size / 2}
              y={photo.y - photo.size / 2}
              width={photo.size}
              height={photo.size}
              style={{ overflow: "visible" }}
            >
              <div
                className="h-full w-full overflow-hidden rounded-2xl border-2 border-white/70 shadow-[0_8px_24px_rgba(12,10,9,0.25)] transition-transform duration-300"
                style={{
                  transform: `scale(${1 + intensity * 0.08})`,
                }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={`https://picsum.photos/seed/${photo.seed}/200/200`}
                    alt={photo.alt}
                    fill
                    sizes="120px"
                    className="object-cover"
                    style={{
                      filter: `grayscale(1) contrast(1.05) brightness(${1 + intensity * 0.15})`,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "rgba(29,63,143,0.28)",
                      mixBlendMode: "color",
                    }}
                  />
                </div>
              </div>
            </foreignObject>
          );
        })}
      </svg>

      <style>{`
        @keyframes hero-orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-24px, 20px) scale(1.08); }
        }
        @keyframes hero-map-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.92; }
        }
        .hero-map-pulse {
          animation: hero-map-pulse 6s ease-in-out infinite;
        }
        @keyframes hero-arc-drift {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -20; }
        }
        .hero-arc-drift {
          animation: hero-arc-drift 3.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
