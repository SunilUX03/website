"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { CmsOrgChart, CmsOrgChartNode, CmsSectionHeading } from "@/lib/cms/about-types";
import { Container } from "@/components/ui/Container";
import { useIsDesktop } from "@/lib/hooks";
import type { Locale } from "@/lib/locale";

/**
 * TNeGA organisation structure: CEO -> JCEO -> seven parallel divisions,
 * each with its own sequential staff chain of variable length (2 rows for
 * Quality Control & Audit, 18 for Project Division) — the real reporting
 * structure, not a fixed shape, so each branch's `nodes` array is
 * genuinely variable-length rather than 3 fixed levels.
 *
 * Every box at every level — CEO/JCEO, division headers, and every staff
 * row including the individual-contributor ones — renders at the exact
 * same fixed width (its grid column) and fixed height, regardless of how
 * much text it holds. Per explicit feedback: varying box sizes by content
 * length read as messy: content that overflows a fixed height clamps
 * (line-clamp) rather than growing the box.
 *
 * Only the CEO/JCEO boxes and each division's own title/subtitle header
 * show by default. A single centered "View Full Structure" toggle reveals
 * every division's staff list together — not one dropdown per branch.
 *
 * Desktop: the JCEO -> seven-division fan-out is the one genuinely
 * branching connector, so instead of computing it from CSS percentages
 * (which drifted out of alignment at some widths), it's drawn as an SVG
 * overlay using each header box's actual measured position (via
 * getBoundingClientRect, re-measured on resize) — the same measured-DOM
 * technique already used by the About page's "What We Do" orbit diagram.
 * Each branch's own expand panel is a single sequential column, so it's
 * simple stacked divs, no measurement needed. Mobile stacks everything on
 * one vertical spine with the same single shared toggle, so the collapsed
 * view stays short and the full hierarchy is still one tap away.
 */

const HEADER_HEIGHT = "h-[92px]";
const NODE_HEIGHT = "h-[60px]";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TopBox({ label }: { label: string }) {
  return (
    <div className={`org-box flex ${NODE_HEIGHT} w-[220px] items-center justify-center rounded-xl bg-[var(--color-primary-blue)] px-3 py-2 text-center`}>
      <p className="type-caption line-clamp-2 font-semibold text-white">{label}</p>
    </div>
  );
}

function HeaderBox({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      className={`org-box flex ${HEADER_HEIGHT} w-full flex-col items-center justify-center gap-1 rounded-xl border border-[var(--color-primary-blue)] bg-[var(--color-surface-strong)] px-2.5 py-2 text-center`}
    >
      <p className="type-caption line-clamp-2 font-semibold leading-tight text-ink">{title}</p>
      <p className="text-[11px] font-semibold leading-tight text-[var(--color-primary-blue)]">{subtitle}</p>
    </div>
  );
}

// A single staff row inside a branch's expand panel. Every row gets the
// same fixed-size box — numbered/lettered roles (bold label + role
// sublabel) and individual-contributor roles (one plain line) alike —
// only the text weight/color differs, per feedback that unboxed plain
// rows read as inconsistent with the rest of the chart.
function NodeBox({ node }: { node: CmsOrgChartNode }) {
  if (node.muted) {
    return (
      <div
        className={`org-box flex ${NODE_HEIGHT} w-full items-center justify-center rounded-xl border border-hairline bg-canvas-soft px-2.5 py-2 text-center`}
      >
        <p className="type-caption line-clamp-2 text-[var(--color-muted)]">{node.label}</p>
      </div>
    );
  }
  return (
    <div
      className={`org-box flex ${NODE_HEIGHT} w-full flex-col items-center justify-center gap-0.5 rounded-xl border border-hairline bg-surface-card px-2.5 py-2 text-center`}
    >
      <p className="type-caption line-clamp-1 font-semibold leading-tight text-ink">{node.label}</p>
      {node.sublabel ? <p className="line-clamp-1 text-[11px] leading-tight text-[var(--color-muted)]">{node.sublabel}</p> : null}
    </div>
  );
}

// Single, shared control for every branch at once — "View Full Structure"
// / "Show Fewer Levels", matching the tone of Roll of Honour's own
// "View full history" toggle elsewhere on this page.
function StructureToggle({ expanded, onClick, locale = "en" }: { expanded: boolean; onClick: () => void; locale?: Locale }) {
  const isTa = locale === "ta";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className="type-body-sm mx-auto flex items-center gap-1.5 rounded-full border border-dashed border-hairline-strong bg-canvas-soft px-4 py-2 text-[var(--color-primary-blue)] transition-colors hover:border-[var(--color-primary-blue)] hover:bg-[var(--color-surface-strong)]"
    >
      {expanded
        ? isTa
          ? "குறைவான நிலைகளைக் காட்டு"
          : "Show Fewer Levels"
        : isTa
          ? "முழு அமைப்பையும் காண்க"
          : "View Full Structure"}
      <ChevronIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
    </button>
  );
}

// A branch's own staff list — always a single sequential column (never a
// fan-out), so plain stacked divs with a thin connector line between each
// are exact regardless of width; no measurement needed here.
function BranchPanel({ nodes, isOpen }: { nodes: CmsOrgChartNode[]; isOpen: boolean }) {
  return (
    <div
      className="grid w-full transition-all duration-500 ease-out"
      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
    >
      <div className="overflow-hidden">
        <div className="flex flex-col items-stretch">
          {nodes.map((node, i) => (
            <div key={i} className="flex flex-col items-stretch">
              <div aria-hidden className="mx-auto h-3 w-px bg-hairline-strong" />
              <NodeBox node={node} />
            </div>
          ))}
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

function DesktopTree({ orgChart, locale = "en" }: { orgChart: CmsOrgChart; locale?: Locale }) {
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
    <div ref={containerRef} className="relative mx-auto flex max-w-[1400px] flex-col items-center">
      <div className="flex flex-col items-center gap-3">
        <TopBox label={orgChart.topLabel} />
        <div ref={jceoRef}>
          <TopBox label={orgChart.jceoLabel} />
        </div>
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
            >
              <HeaderBox title={branch.title} subtitle={branch.subtitle} />
            </div>
            <BranchPanel nodes={branch.nodes} isOpen={expanded} />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <StructureToggle expanded={expanded} onClick={() => setExpanded((v) => !v)} locale={locale} />
      </div>
    </div>
  );
}

function MobileTopNode({ label }: { label: string }) {
  return (
    <div className="relative pl-10">
      <span
        aria-hidden
        className="absolute left-4 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary-blue)] ring-4 ring-canvas"
      />
      <TopBox label={label} />
    </div>
  );
}

function MobileHeaderNode({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative pl-10">
      <span
        aria-hidden
        className="absolute left-4 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary-blue)] ring-4 ring-canvas"
      />
      <HeaderBox title={title} subtitle={subtitle} />
    </div>
  );
}

function MobileStaffNode({ node }: { node: CmsOrgChartNode }) {
  return (
    <div className="relative pl-10">
      <span
        aria-hidden
        className="absolute left-4 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary-blue)] ring-4 ring-canvas"
      />
      <NodeBox node={node} />
    </div>
  );
}

function MobileTree({ orgChart, locale = "en" }: { orgChart: CmsOrgChart; locale?: Locale }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <div aria-hidden className="absolute bottom-3 left-4 top-3 w-px bg-hairline-strong" />
      <div className="flex flex-col gap-3">
        <MobileTopNode label={orgChart.topLabel} />
        <MobileTopNode label={orgChart.jceoLabel} />

        {orgChart.branches.map((branch, i) => (
          <div key={i} className="flex flex-col gap-3">
            <MobileHeaderNode title={branch.title} subtitle={branch.subtitle} />
            <div
              className="grid transition-all duration-500 ease-out"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-3">
                  {branch.nodes.map((node, ni) => (
                    <MobileStaffNode key={ni} node={node} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-4 pl-10">
        <StructureToggle expanded={expanded} onClick={() => setExpanded((v) => !v)} locale={locale} />
      </div>
    </div>
  );
}

export function OrgChart({
  orgChart,
  section,
  locale = "en",
}: {
  orgChart: CmsOrgChart;
  section: CmsSectionHeading;
  locale?: Locale;
}) {
  const isDesktop = useIsDesktop();

  return (
    <section id="organisation-structure" className="scroll-mt-24 bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">{section.eyebrow}</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">{section.heading}</h2>

        {isDesktop === true && <DesktopTree orgChart={orgChart} locale={locale} />}
        {isDesktop === false && <MobileTree orgChart={orgChart} locale={locale} />}
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
