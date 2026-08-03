"use client";

import { orgChart } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { useIsDesktop } from "@/lib/hooks";

/**
 * TNeGA organisation structure: CEO -> JCEO -> six parallel branches.
 * Five branches share the same 4-level shape (Joint Director/DRO ->
 * System Engineer/Deputy Collector -> Project Manager -> ASE); the sixth
 * (Project Director) skips the second level, per the official chart.
 *
 * Desktop renders a real tree: each level is a CSS grid with the same
 * column count as `orgChart.branches.length`, so the connector between two
 * levels lines up exactly under each box regardless of container width.
 * The sixth branch's gap at level 2 is drawn as a plain pass-through line
 * (no box) so its column reads as one continuous drop from Project
 * Director straight to Project Manager.
 *
 * Mobile stacks every branch vertically on a single spine — no sideways
 * scrolling — matching the pattern already used by Roll of Honour.
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

// A centered, non-stretched row — used only for the top (CEO/JCEO) level,
// which doesn't need grid-column alignment since nothing above it connects
// to individual columns.
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

// A row of `count` equal columns. `items[i] === null` renders a pass-through
// vertical line instead of a box for that column — used for the branch
// that skips this level.
function GridRow({ items, variant = "default" }: { items: (string | null)[]; variant?: BoxVariant }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((label, i) =>
        label === null ? (
          <div key={i} aria-hidden className="flex justify-center">
            <div className="w-px bg-hairline-strong" />
          </div>
        ) : (
          <div key={i} className={boxClassName(variant)}>
            <p className={boxTextClassName(variant)}>{label}</p>
          </div>
        )
      )}
    </div>
  );
}

// Trunk down from the parent row's center, a horizontal bar spanning the
// first-to-last child column, then one vertical drop per column — drawn
// with plain divs on a matching N-column grid rather than measured SVG, so
// it's exact regardless of container width and never drifts on resize.
function TreeConnector({ count }: { count: number }) {
  return (
    <div className="relative mx-auto h-6 w-full" aria-hidden>
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
// (top row to trunk) and there's nothing to distribute across.
function Stub() {
  return <div aria-hidden className="mx-auto h-6 w-px bg-hairline-strong" />;
}

function DesktopTree() {
  const count = orgChart.branches.length;
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col overflow-x-auto">
      <TopRow items={orgChart.top} />
      <Stub />
      <TreeConnector count={count} />
      <GridRow items={orgChart.branches.map((b) => b.director)} />
      <TreeConnector count={count} />
      <GridRow items={orgChart.branches.map((b) => b.engineer)} />
      <TreeConnector count={count} />
      <GridRow items={orgChart.branches.map((b) => b.manager)} />
      <TreeConnector count={count} />
      <GridRow items={orgChart.branches.map((b) => b.base)} variant="muted" />
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
  return (
    <div className="relative">
      <div aria-hidden className="absolute bottom-3 left-4 top-3 w-px bg-hairline-strong" />
      <div className="flex flex-col gap-3">
        {orgChart.top.map((label) => (
          <MobileNode key={label} label={label} variant="top" />
        ))}

        {orgChart.branches.map((branch, i) => (
          <div key={i} className="flex flex-col gap-3 pt-2 first:pt-0">
            <MobileNode label={branch.director} />
            {branch.engineer && <MobileNode label={branch.engineer} />}
            <MobileNode label={branch.manager} />
            <MobileNode label={branch.base} variant="muted" />
          </div>
        ))}
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
