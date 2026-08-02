"use client";

import { useState } from "react";
import { orgChart } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { useIsDesktop } from "@/lib/hooks";

/**
 * TNeGA organisation structure.
 *
 * CEO/Joint CEO and the Joint Directors are always visible; the rest of
 * the reporting chain (Deputy Collectors down to Assistant System
 * Engineers) is behind a single expand toggle — the source data doesn't
 * say which Joint Director each of those reports to, so this stays one
 * shared "rest of the structure" branch rather than fabricating six
 * separate ones.
 *
 * Desktop renders a real tree: each level is a CSS grid with N equal
 * columns, and the connector between two levels uses the exact same N so
 * its drop-lines land dead-center under each box — no manual pixel
 * measurement, no drift. Mobile swaps to a single vertical spine (the same
 * pattern already used by Roll of Honour) since a 6-column tree simply
 * doesn't fit a phone width without shrinking text past readability —
 * this avoids the sideways-scrolling chart entirely.
 */

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type BoxVariant = "top" | "default" | "muted";

function boxClassName(variant: BoxVariant) {
  if (variant === "top") {
    return "org-box flex min-h-[60px] items-center justify-center rounded-xl bg-[var(--color-primary-blue)] px-3 py-2.5 text-center";
  }
  if (variant === "muted") {
    return "org-box flex min-h-[56px] items-center justify-center rounded-xl border border-hairline bg-canvas-soft px-3 py-2.5 text-center";
  }
  return "org-box flex min-h-[60px] items-center justify-center rounded-xl border border-hairline bg-surface-card px-3 py-2.5 text-center";
}

function boxTextClassName(variant: BoxVariant) {
  return variant === "top" ? "type-body-strong text-white" : "type-caption font-medium text-ink";
}

// A centered, non-stretched row — used only for the top (CEO/Joint CEO)
// level, which doesn't need grid-column alignment since nothing above it
// connects to individual columns.
function TopRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {items.map((label) => (
        <div key={label} className={`${boxClassName("top")} w-[180px]`}>
          <p className={boxTextClassName("top")}>{label}</p>
        </div>
      ))}
    </div>
  );
}

// Every other level: a grid of exactly `items.length` equal columns, so a
// TreeConnector with the same count lines up with it precisely.
function GridRow({ items, variant = "default" }: { items: string[]; variant?: BoxVariant }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((label) => (
        <div key={label} className={boxClassName(variant)}>
          <p className={boxTextClassName(variant)}>{label}</p>
        </div>
      ))}
    </div>
  );
}

// Trunk down from the parent row's center, a horizontal bar spanning the
// first-to-last child column, then one vertical drop per column — drawn
// with plain divs on a matching N-column grid rather than measured SVG, so
// it's exact regardless of container width and never drifts on resize.
function TreeConnector({ count }: { count: number }) {
  return (
    <div className="relative mx-auto h-8 w-full" aria-hidden>
      <div className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-hairline-strong" />
      {count > 1 && (
        <div
          className="absolute top-1/2 h-px bg-hairline-strong"
          style={{ left: `${50 / count}%`, right: `${50 / count}%` }}
        />
      )}
      <div
        className="absolute inset-x-0 top-1/2 grid h-1/2"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="mx-auto h-full w-px bg-hairline-strong" />
        ))}
      </div>
    </div>
  );
}

// A plain single-line stub — used where exactly one node follows another
// (top row to trunk, director row to the toggle) and there's nothing to
// distribute across.
function Stub() {
  return <div aria-hidden className="mx-auto h-6 w-px bg-hairline-strong" />;
}

function ToggleButton({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className="type-body-sm mx-auto flex items-center gap-1.5 rounded-full border border-dashed border-hairline-strong bg-canvas-soft px-4 py-2 text-[var(--color-primary-blue)] transition-colors hover:border-[var(--color-primary-blue)] hover:bg-[var(--color-surface-strong)]"
    >
      {expanded ? "Show fewer levels" : "View reporting structure"}
      <ChevronIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
    </button>
  );
}

function DesktopTree({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <div className="mx-auto flex max-w-[1040px] flex-col">
      <TopRow items={orgChart.top} />
      <TreeConnector count={orgChart.directors.length} />
      <GridRow items={orgChart.directors} />
      <Stub />
      <ToggleButton expanded={expanded} onClick={onToggle} />

      <div
        className="grid transition-all duration-500 ease-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <div className="mx-auto flex max-w-[560px] flex-col pt-2">
            <TreeConnector count={orgChart.deputies.length} />
            <GridRow items={orgChart.deputies} />
            <TreeConnector count={orgChart.leads.length} />
            <GridRow items={orgChart.leads} />
            <TreeConnector count={1} />
            <GridRow items={[orgChart.base]} variant="muted" />
          </div>
        </div>
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

function MobileToggleNode({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <div className="relative pl-10">
      <span
        aria-hidden
        className="absolute left-4 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary-blue)] ring-4 ring-canvas"
      />
      <button
        type="button"
        onClick={onClick}
        aria-expanded={expanded}
        className="type-body-sm flex w-full items-center justify-between gap-2 rounded-xl border border-dashed border-hairline-strong bg-canvas-soft px-4 py-2.5 text-[var(--color-primary-blue)] transition-colors hover:border-[var(--color-primary-blue)]"
      >
        {expanded ? "Show fewer levels" : "View reporting structure"}
        <ChevronIcon className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}

function MobileTree({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  const restNodes: { label: string; variant?: BoxVariant }[] = [
    ...orgChart.deputies.map((label) => ({ label })),
    ...orgChart.leads.map((label) => ({ label })),
    { label: orgChart.base, variant: "muted" as const },
  ];

  return (
    <div className="relative">
      <div aria-hidden className="absolute bottom-3 left-4 top-3 w-px bg-hairline-strong" />
      <div className="flex flex-col gap-3">
        {orgChart.top.map((label) => (
          <MobileNode key={label} label={label} variant="top" />
        ))}
        {orgChart.directors.map((label) => (
          <MobileNode key={label} label={label} />
        ))}
        <MobileToggleNode expanded={expanded} onClick={onToggle} />

        <div
          className="grid transition-all duration-500 ease-out"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-3">
              {restNodes.map((node) => (
                <MobileNode key={node.label} label={node.label} variant={node.variant} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrgChart() {
  const [expanded, setExpanded] = useState(false);
  const isDesktop = useIsDesktop();
  const toggle = () => setExpanded((v) => !v);

  return (
    <section id="organisation-structure" className="scroll-mt-24 bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Organisation Structure</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">How TNeGA is organised</h2>

        {isDesktop === true && <DesktopTree expanded={expanded} onToggle={toggle} />}
        {isDesktop === false && <MobileTree expanded={expanded} onToggle={toggle} />}
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
