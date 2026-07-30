"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { whatWeDo } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { useIsDesktop, useReducedMotion } from "@/lib/hooks";

const NODE_WIDTH = 168;
const HUB_SIZE = 128;
const HUB_RADIUS = HUB_SIZE / 2;
const EDGE_MARGIN = 24;
// Extra clearance beyond the bare minimum, so cards never look like
// they're just barely avoiding each other.
const GAP_BUFFER = 48;

function WhatWeDoOrbit() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [cardHeight, setCardHeight] = useState(0);
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

  // Card height is driven purely by content at a fixed NODE_WIDTH, so it
  // doesn't change with container size — measure it once after mount
  // (real content, since a hardcoded height estimate was wrong before and
  // caused nodes to overlap) rather than guessing.
  useLayoutEffect(() => {
    const heights = cardRefs.current
      .filter((el): el is HTMLDivElement => el !== null)
      .map((el) => el.getBoundingClientRect().height);
    if (heights.length) setCardHeight(Math.max(...heights));
  }, []);

  const cx = size.width / 2;
  const cy = size.height / 2;
  const count = whatWeDo.length;
  // In a 6-node hexagon, two of the six adjacent-node pairs sit directly
  // above/below one another (angularly 60° apart but purely vertical),
  // so THEIR separation is exactly `radius`, and it has to clear the full
  // card height (not just its width) to avoid overlapping — a chord/width
  // calculation alone isn't enough once cards are taller than they are
  // wide, which is what actually caused the visible overlap bug here.
  const verticalPairFloor = cardHeight > 0 ? cardHeight + GAP_BUFFER : 0;
  const nodeHalfExtent = Math.max(NODE_WIDTH, cardHeight) / 2;
  const containerCeiling = Math.max(0, Math.min(cx, cy) - nodeHalfExtent - EDGE_MARGIN);
  // Prefer filling the available space (up to a sane cap so the diagram
  // doesn't sprawl on very wide screens); if the container is ever too
  // small to clear the vertical-pair floor, avoiding overlap wins over
  // staying inside the edge margin.
  const radius = Math.min(Math.max(containerCeiling, verticalPairFloor), 280);

  return (
    <div ref={containerRef} className="relative mx-auto h-[760px] w-full max-w-[840px]">
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
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={clsx(
                    "card-feature overflow-hidden text-center transition-all duration-200 !p-0",
                    isHovered && "scale-[1.04] border-[var(--color-primary-blue)] shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                  )}
                >
                  <div className="relative h-20 w-full overflow-hidden">
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
          <div className="relative h-28 w-full overflow-hidden">
            <Image src={item.image} alt="" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="p-4">
            <p className="type-title-sm mb-1 text-ink">{item.title}</p>
            <p className="type-caption line-clamp-4 text-[var(--color-muted)]">{item.description}</p>
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
