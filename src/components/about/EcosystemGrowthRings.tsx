"use client";

import { useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ecosystemRings, ecosystemCenter } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { useIsDesktop } from "@/lib/hooks";

const NODE_SIZE = 108;
const HUB_SIZE = 140;
const HUB_RADIUS = HUB_SIZE / 2;
const RING_GAP = 46;
const EDGE_MARGIN = 20;
// The golden angle (~137.5°) spreads consecutive-index nodes far apart in
// angle even though their ring radii are also consecutive — plain even
// spacing (360°/7) put radius-adjacent nodes at the same bearing as each
// other, so their (small) radius gap was the only thing separating two
// full-size node circles and they collided. Golden-angle placement keeps
// every pair, adjacent or not, comfortably clear of every other.
const GOLDEN_ANGLE = 137.50776 * (Math.PI / 180);

function EcosystemRingsDesktop() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [active, setActive] = useState<number | null>(null);

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
  const count = ecosystemRings.length;
  // Bound every ring against the container's actual measured size so
  // nothing — rings or org nodes — can spill past the visible frame.
  const maxRadius = Math.max(0, Math.min(cx, cy) - NODE_SIZE / 2 - EDGE_MARGIN);
  const innerStart = Math.min(HUB_RADIUS + RING_GAP, maxRadius);
  const step = count > 1 ? Math.max(0, maxRadius - innerStart) / (count - 1) : 0;

  const positions = ecosystemRings.map((org, i) => {
    const r = innerStart + step * i;
    const angle = i * GOLDEN_ANGLE - Math.PI / 2;
    return { org, r, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const activePos = active !== null ? positions[active] : null;
  const tooltipWidth = 220;
  const tooltipLeft = activePos
    ? Math.min(Math.max(activePos.x, tooltipWidth / 2 + 8), size.width - tooltipWidth / 2 - 8)
    : 0;

  return (
    <div ref={containerRef} className="relative mx-auto h-[600px] w-full max-w-[720px]">
      {size.width > 0 && (
        <>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            {positions.map(({ org, r }) => (
              <circle
                key={org.name}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--color-hairline)"
                strokeWidth={1}
              />
            ))}
          </svg>

          <div
            className="absolute flex items-center justify-center rounded-full bg-ink px-3 text-center text-white"
            style={{
              left: cx,
              top: cy,
              width: HUB_SIZE,
              height: HUB_SIZE,
              transform: "translate(-50%, -50%)",
            }}
          >
            <p className="type-caption font-medium leading-tight">{ecosystemCenter}</p>
          </div>

          {positions.map(({ org, x, y }, i) => {
            const isActive = active === i;
            return (
              <button
                type="button"
                key={org.name}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={clsx(
                  "absolute flex flex-col items-center justify-center rounded-full border p-2 text-center transition-all duration-200",
                  isActive
                    ? "z-10 scale-105 border-[var(--color-primary-blue)] bg-[rgba(29,63,143,0.08)]"
                    : "border-hairline-strong bg-surface-card"
                )}
                style={{
                  left: x,
                  top: y,
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <p className="type-caption font-semibold leading-tight break-words text-ink">
                  {org.name}
                </p>
                <p className="type-caption leading-tight text-[var(--color-muted)]">
                  Est. {org.year}
                </p>
              </button>
            );
          })}

          {/* Detail callout anchored directly above the hovered/focused
              node — not a separate panel elsewhere on the page. */}
          {activePos && (
            <div
              className="pointer-events-none absolute z-20 rounded-xl border border-hairline bg-surface-card px-4 py-3 text-center shadow-[0_10px_28px_rgba(0,0,0,0.12)]"
              style={{
                left: tooltipLeft,
                top: activePos.y - NODE_SIZE / 2 - 12,
                width: tooltipWidth,
                transform: "translate(-50%, -100%)",
              }}
            >
              <p className="type-body-strong text-ink">
                {activePos.org.name}{" "}
                <span className="type-caption text-[var(--color-muted)]">· Est. {activePos.org.year}</span>
              </p>
              <p className="type-caption mt-1 text-[var(--color-body)]">{activePos.org.description}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EcosystemRingsMobile() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-hairline bg-surface-card px-5 py-3 text-center">
        <p className="type-body-strong text-ink">{ecosystemCenter}</p>
      </div>
      {ecosystemRings.map((org, i) => {
        const isActive = active === i;
        return (
          <button
            type="button"
            key={org.name}
            onClick={() => setActive(isActive ? null : i)}
            className={clsx(
              "rounded-xl border px-5 py-4 text-left transition-colors duration-200",
              isActive
                ? "border-[var(--color-primary-blue)] bg-[rgba(29,63,143,0.06)]"
                : "border-hairline bg-surface-card"
            )}
          >
            <p className="type-body-strong text-ink">
              {org.name} <span className="type-caption text-[var(--color-muted)]">· Est. {org.year}</span>
            </p>
            {isActive && <p className="type-body-sm mt-2 text-[var(--color-body)]">{org.description}</p>}
          </button>
        );
      })}
    </div>
  );
}

export function EcosystemGrowthRings() {
  const isDesktop = useIsDesktop();
  return (
    <section id="ecosystem" className="scroll-mt-24 bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Our Ecosystem</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">
          Seven organisations, one digital mission
        </h2>

        {isDesktop === true && <EcosystemRingsDesktop />}
        {isDesktop === false && <EcosystemRingsMobile />}
      </Container>
    </section>
  );
}
