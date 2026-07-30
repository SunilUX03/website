"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { whatWeDo } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { useIsDesktop, useReducedMotion } from "@/lib/hooks";

const NODE_WIDTH = 190;
const NODE_HALF = NODE_WIDTH / 2;
const HUB_SIZE = 132;
const EDGE_MARGIN = 20;
const MAX_RADIUS = 260;

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
  // guess) so nodes and connecting lines can never spill past the frame.
  const maxRadius = Math.max(0, Math.min(cx, cy) - NODE_HALF - EDGE_MARGIN);
  const radius = Math.min(maxRadius, MAX_RADIUS);

  return (
    <div ref={containerRef} className="relative mx-auto h-[640px] w-full max-w-[760px]">
      {size.width > 0 && (
        <>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            {whatWeDo.map((_, i) => {
              const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
              const x = cx + radius * Math.cos(angle);
              const y = cy + radius * Math.sin(angle);
              const isHovered = hovered === i;
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke={isHovered ? "var(--color-primary-blue)" : "var(--color-hairline-strong)"}
                  strokeWidth={isHovered ? 2 : 1}
                  style={{ transition: "stroke 200ms ease, stroke-width 200ms ease" }}
                />
              );
            })}
          </svg>

          <div
            className="absolute flex items-center justify-center rounded-full bg-ink text-white"
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
                className="absolute outline-none"
                style={{ left: x, top: y, width: NODE_WIDTH, transform: "translate(-50%, -50%)" }}
              >
                <div
                  className={clsx(
                    "card-feature !p-3 text-center transition-all duration-200",
                    isHovered && "scale-[1.04] border-[var(--color-primary-blue)] shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                  )}
                >
                  <div className="relative mx-auto mb-2 h-14 w-14 overflow-hidden rounded-full">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="56px"
                      className={clsx(
                        "object-cover transition-transform duration-300",
                        isHovered && "scale-105"
                      )}
                    />
                  </div>
                  <p className="type-title-sm mb-1 text-ink">{item.title}</p>
                  <p className="type-caption line-clamp-3 text-[var(--color-muted)]">
                    {item.description}
                  </p>
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
        <div key={item.title} className="card-feature text-center">
          <div className="relative mx-auto mb-3 h-14 w-14 overflow-hidden rounded-full">
            <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
          </div>
          <p className="type-title-sm mb-1 text-ink">{item.title}</p>
          <p className="type-caption text-[var(--color-muted)]">{item.description}</p>
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
