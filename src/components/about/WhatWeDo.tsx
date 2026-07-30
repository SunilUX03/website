"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { whatWeDo } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { useIsDesktop, useReducedMotion } from "@/lib/hooks";

// Node footprint used to keep the radial layout from ever overlapping —
// both the card's own half-width/half-height (so it can't clip the
// container edge) and, crucially, the chord distance between two
// *adjacent* nodes at 60° apart (which is why the radius floor below is
// driven by NODE_WIDTH, not just container size — too small a radius was
// the actual cause of the "crammed 2x2 grid" bug, since adjacent nodes'
// centers end up only `radius` apart at a 60° spacing).
const NODE_WIDTH = 168;
const NODE_MARGIN = 100; // half the card's approx rendered footprint
const HUB_SIZE = 128;
const HUB_RADIUS = HUB_SIZE / 2;
const EDGE_MARGIN = 24;
const MAX_RADIUS = 300;

function WhatWeDoOrbit() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hovered, setHovered] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cx = size.width / 2;
  const cy = size.height / 2;
  const count = whatWeDo.length;
  // Bound the radius against the container's actual measured size (not a
  // guess) so nodes and connecting lines can never spill past the frame —
  // and never end up closer to each other than their own footprint either.
  const maxRadius = Math.max(0, Math.min(cx, cy) - NODE_MARGIN - EDGE_MARGIN);
  const radius = Math.min(maxRadius, MAX_RADIUS);

  return (
    <div ref={containerRef} className="relative mx-auto h-[720px] w-full max-w-[840px]">
      {size.width > 0 && (
        <>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            {whatWeDo.map((_, i) => {
              const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
              const x = cx + radius * Math.cos(angle);
              const y = cy + radius * Math.sin(angle);
              // Start the line at the hub's edge, not its center, so it
              // never disappears underneath the hub circle.
              const startX = cx + HUB_RADIUS * Math.cos(angle);
              const startY = cy + HUB_RADIUS * Math.sin(angle);
              const isHovered = hovered === i;
              return (
                <line
                  key={i}
                  x1={startX}
                  y1={startY}
                  x2={x}
                  y2={y}
                  stroke={isHovered ? "var(--color-primary-blue)" : "var(--color-hairline-strong)"}
                  strokeWidth={isHovered ? 2 : 1.5}
                  style={{ transition: "stroke 200ms ease, stroke-width 200ms ease" }}
                />
              );
            })}
          </svg>

          <div
            className="absolute z-10 flex items-center justify-center rounded-full bg-ink text-white"
            style={{
              left: cx,
              top: cy,
              width: HUB_SIZE,
              height: HUB_SIZE,
              transform: "translate(-50%, -50%)",
            }}
          >
            {!reducedMotion && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  animation: "hub-pulse 3s ease-out infinite",
                  border: "1.5px solid var(--color-primary-blue)",
                }}
              />
            )}
            <p className="type-title-sm relative z-10">TNeGA</p>
          </div>

          {whatWeDo.map((item, i) => {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            const isHovered = hovered === i;
            return (
              <div
                key={item.title}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                className="absolute z-10 outline-none"
                style={{ left: x, top: y, width: NODE_WIDTH, transform: "translate(-50%, -50%)" }}
              >
                <div
                  className={clsx(
                    "card-feature overflow-hidden text-center transition-all duration-200 !p-0",
                    isHovered && "scale-[1.04] border-[var(--color-primary-blue)] shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                  )}
                >
                  <div className="relative h-16 w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="168px"
                      className={clsx(
                        "object-cover transition-transform duration-300",
                        isHovered && "scale-105"
                      )}
                    />
                  </div>
                  <div className="p-3">
                    <p className="type-title-sm mb-1 text-ink">{item.title}</p>
                    <p className="type-caption line-clamp-3 text-[var(--color-muted)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function WhatWeDoGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {whatWeDo.map((item) => (
        <div key={item.title} className="card-feature overflow-hidden text-center !p-0">
          <div className="relative h-20 w-full overflow-hidden">
            <Image src={item.image} alt="" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="p-4">
            <p className="type-title-sm mb-1 text-ink">{item.title}</p>
            <p className="type-caption text-[var(--color-muted)]">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function WhatWeDo() {
  const isDesktop = useIsDesktop();

  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">What We Do</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">
          Six ways TNeGA drives digital governance
        </h2>

        {isDesktop === true && <WhatWeDoOrbit />}
        {isDesktop === false && <WhatWeDoGrid />}
      </Container>

      <style>{`
        @keyframes hub-pulse {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(1.7); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
