"use client";

import { useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ecosystemRings, ecosystemCenter } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { useIsDesktop } from "@/lib/hooks";

const NODE_SIZE = 132;
const HUB_RADIUS = 66;
const RING_GAP = 44;
const EDGE_MARGIN = 24;

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
  const radiusFor = (i: number) => innerStart + step * i;

  const activeOrg = active !== null ? ecosystemRings[active] : null;

  return (
    <div>
      <div ref={containerRef} className="relative mx-auto h-[560px] w-full max-w-[640px]">
        {size.width > 0 && (
          <>
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              {ecosystemRings.map((org, i) => (
                <circle
                  key={org.name}
                  cx={cx}
                  cy={cy}
                  r={radiusFor(i)}
                  fill="none"
                  stroke="var(--color-hairline)"
                  strokeWidth={1}
                />
              ))}
            </svg>

            <div
              className="absolute flex h-[132px] w-[132px] items-center justify-center rounded-full bg-ink px-3 text-center text-white"
              style={{ left: cx, top: cy, transform: "translate(-50%, -50%)" }}
            >
              <p className="type-caption font-medium leading-tight">{ecosystemCenter}</p>
            </div>

            {ecosystemRings.map((org, i) => {
              const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
              const r = radiusFor(i);
              const x = cx + r * Math.cos(angle);
              const y = cy + r * Math.sin(angle);
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
                    "absolute flex flex-col items-center justify-center rounded-full border text-center transition-all duration-200",
                    isActive
                      ? "border-[var(--color-primary-blue)] bg-[rgba(29,63,143,0.08)]"
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
                  <p className="type-body-strong px-2 text-ink">{org.name}</p>
                  <p className="type-caption text-[var(--color-muted)]">Est. {org.year}</p>
                </button>
              );
            })}
          </>
        )}
      </div>

      <div className="mx-auto mt-6 max-w-xl rounded-xl border border-hairline bg-surface-card px-6 py-4 text-center">
        {activeOrg ? (
          <>
            <p className="type-body-strong text-ink">
              {activeOrg.name}{" "}
              <span className="text-[var(--color-muted)]">· Est. {activeOrg.year}</span>
            </p>
            <p className="type-body-sm mt-1 text-[var(--color-body)]">{activeOrg.description}</p>
          </>
        ) : (
          <p className="type-body-sm text-[var(--color-muted)]">
            Hover or focus an organisation to read more.
          </p>
        )}
      </div>
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
