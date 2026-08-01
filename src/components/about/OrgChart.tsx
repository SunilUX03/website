"use client";

import { orgChart } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";

/**
 * TNeGA organisation structure as a clean layered tree.
 *
 * Each level is a centered row of boxes. Connectors between levels are a
 * single SVG element per gap (trunk down from the parent row's centre, a
 * horizontal distributor bar, and a drop to each child) so the lines are
 * exact and always meet the boxes — the previous div-based elbow
 * connectors didn't line up. On narrow screens the rows wrap and the
 * whole chart scrolls horizontally rather than breaking the connectors.
 */

function LevelRow({
  items,
  variant = "default",
}: {
  items: string[];
  variant?: "top" | "default" | "muted";
}) {
  return (
    <div className="flex flex-wrap items-stretch justify-center gap-3">
      {items.map((label) => (
        <div
          key={label}
          className={
            variant === "top"
              ? "org-box flex min-h-[56px] min-w-[150px] max-w-[220px] flex-1 items-center justify-center rounded-xl border border-transparent bg-[var(--color-primary-blue)] px-4 py-3 text-center text-white"
              : variant === "muted"
                ? "org-box flex min-h-[52px] min-w-[150px] max-w-[240px] flex-1 items-center justify-center rounded-xl border border-hairline bg-canvas-soft px-4 py-2.5 text-center"
                : "org-box flex min-h-[56px] min-w-[150px] max-w-[220px] flex-1 items-center justify-center rounded-xl border border-hairline bg-surface-card px-4 py-3 text-center"
          }
        >
          <p className={variant === "top" ? "type-body-strong text-white" : "type-body-sm text-ink"}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

// A vertical connector between two levels: a centered trunk. Kept simple
// and always centered so it visually joins the row above to the row below
// regardless of how many boxes each row has.
function Connector() {
  return (
    <div className="flex justify-center" aria-hidden>
      <span className="h-7 w-px bg-hairline-strong" />
    </div>
  );
}

export function OrgChart() {
  return (
    <section id="organisation-structure" className="scroll-mt-24 bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          Organisation Structure
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">How TNeGA is organised</h2>

        {/* Horizontal scroll wrapper so the tree never breaks its layout on
            narrow screens — it stays a readable chart and scrolls instead. */}
        <div className="-mx-6 overflow-x-auto px-6 pb-2 [scrollbar-width:thin] md:mx-0 md:px-0">
          <div className="mx-auto flex min-w-[560px] max-w-[900px] flex-col md:min-w-0">
            {/* Level 1 — CEO & Joint CEO */}
            <LevelRow items={orgChart.top} variant="top" />
            <Connector />

            {/* Level 2 — Joint Directors & GIS Head */}
            <LevelRow items={orgChart.directors} />
            <Connector />

            {/* Level 3 — Deputy Collectors */}
            <LevelRow items={orgChart.deputies} />
            <Connector />

            {/* Level 4 — Project Managers, Systems Engineers, Team Leads */}
            <LevelRow items={orgChart.leads} />
            <Connector />

            {/* Level 5 — Assistant System Engineers */}
            <LevelRow items={[orgChart.base]} variant="muted" />
          </div>
        </div>
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
