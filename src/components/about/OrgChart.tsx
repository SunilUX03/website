"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { orgChart } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { useIsDesktop } from "@/lib/hooks";

/**
 * TNeGA organisation structure: CEO -> JCEO -> six parallel branches.
 * Five branches share the same 4-level shape (Joint Director/DRO ->
 * System Engineer/Deputy Collector -> Project Manager -> ASE); the sixth
 * (Project Director) skips the second level, per the official chart.
 *
 * Only CEO, JCEO, and the six Joint Director-level boxes show by default.
 * A single centered "View Full Structure" toggle reveals every branch's
 * remaining levels together — not one dropdown per branch.
 *
 * Desktop: the JCEO -> six-branches fan-out is the one genuinely branching
 * connector, so instead of computing it from CSS percentages (which drifted
 * out of alignment at some widths), it's drawn as an SVG overlay using each
 * box's actual measured position (via getBoundingClientRect, re-measured on
 * resize) — the same measured-DOM technique already used by the About
 * page's "What We Do" orbit diagram. Each branch's own expand panel is a
 * single sequential column, so it's simple stacked divs, no measurement
 * needed. Mobile stacks everything on one vertical spine with the same
 * single shared toggle, so the collapsed view stays short and the full
 * hierarchy is still one tap away.
 */

type BoxVariant = "top" | "default" | "muted";

function boxClassName(variant: BoxVariant) {
  if (variant === "top") {
    return "org-box flex min-h-[52px] items-center justify-center rounded-xl bg-[var(--color-primary-blue)] px-3 py-2.5 text-center";
  }
  if (variant === "muted") {
    return "org-box flex min-h-[52px] items-center justify-center rounded-xl border border-hairline bg-canvas-soft px-3 py-2.5 text-center";
  }
  return "org-box flex min-h-[52px] items-center justify-center rounded-xl border border-hairline bg-surface-card px-3 py-2.5 text-center";
}

function boxTextClassName(variant: BoxVariant) {
  return variant === "top" ? "type-caption font-semibold text-white" : "type-caption font-medium text-ink";
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TopRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {items.map((label) => (
        <div key={label} className={`${boxClassName("top")} w-[160px]`}>
          <p className={boxTextClassName("top")}>{label}</p>
        </div>
      ))}
    </div>
  );
}

// Single, shared control for every branch at once — "View Full Structure"
// / "Show Fewer Levels", matching the tone of Roll of Honour's own
// "View full history" toggle elsewhere on this page.
function StructureToggle({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className="type-body-sm mx-auto flex items-center gap-1.5 rounded-full border border-dashed border-hairline-strong bg-canvas-soft px-4 py-2 text-[var(--color-primary-blue)] transition-colors hover:border-[var(--color-primary-blue)] hover:bg-[var(--color-surface-strong)]"
    >
      {expanded ? "Show Fewer Levels" : "View Full Structure"}
      <ChevronIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
    </button>
  );
}

// A branch's own remaining levels — always a single sequential column
// (never a fan-out), so plain stacked divs with a thin connector line
// between each are exact regardless of width; no measurement needed here.
function BranchPanel({
  branch,
  isOpen,
}: {
  branch: (typeof orgChart.branches)[number];
  isOpen: boolean;
}) {
  return (
    <div
      className="grid w-full transition-all duration-500 ease-out"
      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
    >
      <div className="overflow-hidden">
        <div className="flex flex-col items-stretch">
          {branch.engineer && (
            <>
              <div aria-hidden className="mx-auto h-4 w-px bg-hairline-strong" />
              <div className={boxClassName("default")}>
                <p className={boxTextClassName("default")}>{branch.engineer}</p>
              </div>
            </>
          )}
          <div aria-hidden className="mx-auto h-4 w-px bg-hairline-strong" />
          <div className={boxClassName("default")}>
            <p className={boxTextClassName("default")}>{branch.manager}</p>
          </div>
          <div aria-hidden className="mx-auto h-4 w-px bg-hairline-strong" />
          <div className={boxClassName("muted")}>
            <p className={boxTextClassName("muted")}>{branch.base}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FanLines {
  trunkX: number;
  trunkTopY: number;
  barY: number;
  boxTopY: number;
  dropXs: number[];
}

function DesktopTree() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const jceoRef = useRef<HTMLDivElement | null>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lines, setLines] = useState<FanLines | null>(null);
  const [expanded, setExpanded] = useState(false);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const jceo = jceoRef.current;
    if (!container || !jceo) return;
    const boxRects = boxRefs.current.map((el) => el?.getBoundingClientRect());
    if (boxRects.some((r) => !r)) return;

    const containerRect = container.getBoundingClientRect();
    const jceoRect = jceo.getBoundingClientRect();
    const firstBox = boxRects[0] as DOMRect;
    const trunkTopY = jceoRect.bottom - containerRect.top;
    const boxTopY = firstBox.top - containerRect.top;

    setLines({
      trunkX: jceoRect.left + jceoRect.width / 2 - containerRect.left,
      trunkTopY,
      barY: trunkTopY + (boxTopY - trunkTopY) / 2,
      boxTopY,
      dropXs: boxRects.map((r) => (r as DOMRect).left + (r as DOMRect).width / 2 - containerRect.left),
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div ref={containerRef} className="relative mx-auto flex max-w-[1100px] flex-col items-center">
      <div ref={jceoRef}>
        <TopRow items={orgChart.top} />
      </div>

      {lines && (
        <svg
          className="pointer-events-none absolute left-0 top-0"
          width="100%"
          height={lines.boxTopY}
          aria-hidden
        >
          <line x1={lines.trunkX} y1={lines.trunkTopY} x2={lines.trunkX} y2={lines.barY} stroke="var(--color-hairline-strong)" strokeWidth={1} />
          <line
            x1={Math.min(...lines.dropXs)}
            y1={lines.barY}
            x2={Math.max(...lines.dropXs)}
            y2={lines.barY}
            stroke="var(--color-hairline-strong)"
            strokeWidth={1}
          />
          {lines.dropXs.map((x, i) => (
            <line key={i} x1={x} y1={lines.barY} x2={x} y2={lines.boxTopY} stroke="var(--color-hairline-strong)" strokeWidth={1} />
          ))}
        </svg>
      )}

      <div
        className="mt-16 grid w-full items-start gap-3"
        style={{ gridTemplateColumns: `repeat(${orgChart.branches.length}, minmax(0, 1fr))` }}
      >
        {orgChart.branches.map((branch, i) => (
          <div key={i} className="flex flex-col items-stretch">
            <div
              ref={(el) => {
                boxRefs.current[i] = el;
              }}
              className={boxClassName("default")}
            >
              <p className={boxTextClassName("default")}>{branch.director}</p>
            </div>
            <BranchPanel branch={branch} isOpen={expanded} />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <StructureToggle expanded={expanded} onClick={() => setExpanded((v) => !v)} />
      </div>
    </div>
  );
}

function MobileNode({ label, variant = "default" }: { label: string; variant?: BoxVariant }) {
  return (
    <div className="relative pl-10">
      <span
        aria-hidden
        className="absolute left-4 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary-blue)] ring-4 ring-canvas"
      />
      <div className={boxClassName(variant)}>
        <p className={boxTextClassName(variant)}>{label}</p>
      </div>
    </div>
  );
}

function MobileTree() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <div aria-hidden className="absolute bottom-3 left-4 top-3 w-px bg-hairline-strong" />
      <div className="flex flex-col gap-3">
        {orgChart.top.map((label) => (
          <MobileNode key={label} label={label} variant="top" />
        ))}

        {orgChart.branches.map((branch, i) => (
          <div key={i} className="flex flex-col gap-3">
            <MobileNode label={branch.director} />
            <div
              className="grid transition-all duration-500 ease-out"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-3">
                  {branch.engineer && <MobileNode label={branch.engineer} />}
                  <MobileNode label={branch.manager} />
                  <MobileNode label={branch.base} variant="muted" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-4 pl-10">
        <StructureToggle expanded={expanded} onClick={() => setExpanded((v) => !v)} />
      </div>
    </div>
  );
}

export function OrgChart() {
  const isDesktop = useIsDesktop();

  return (
    <section id="organisation-structure" className="scroll-mt-24 bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Organisation Structure</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">How TNeGA is organised</h2>

        {isDesktop === true && <DesktopTree />}
        {isDesktop === false && <MobileTree />}
      </Container>

      <style>{`
        .org-box {
          transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
        }
        .org-box:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
        }
        @media (prefers-reduced-motion: reduce) {
          .org-box { transition: none; }
          .org-box:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}
