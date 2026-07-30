"use client";

import { useState } from "react";
import clsx from "clsx";
import { orgChart } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { ChevronDownIcon } from "@/components/nav/icons";

type Level2Node = (typeof orgChart.level2)[number];

function OrgChartNode({ node }: { node: Level2Node }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children.length > 0;

  return (
    <div className="flex w-full flex-col items-center">
      <div
        role={hasChildren ? "button" : undefined}
        tabIndex={hasChildren ? 0 : undefined}
        onClick={hasChildren ? () => setExpanded((v) => !v) : undefined}
        onKeyDown={
          hasChildren
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setExpanded((v) => !v);
                }
              }
            : undefined
        }
        aria-expanded={hasChildren ? expanded : undefined}
        className={clsx(
          "card-feature flex h-24 w-full max-w-[240px] items-center justify-center gap-2 px-4 text-center outline-none transition-colors duration-200",
          "hover:border-[var(--color-primary-blue)] hover:bg-[rgba(29,63,143,0.04)]",
          hasChildren && "cursor-pointer focus-visible:border-[var(--color-primary-blue)] focus-visible:bg-[rgba(29,63,143,0.04)]"
        )}
      >
        <p className="type-body-strong text-ink">{node.label}</p>
        {hasChildren && (
          <ChevronDownIcon
            className={clsx(
              "h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform duration-300",
              expanded && "rotate-180"
            )}
          />
        )}
      </div>

      {hasChildren && (
        <div
          className="grid w-full max-w-[240px] transition-all duration-300 ease-out"
          style={{
            gridTemplateRows: expanded ? "1fr" : "0fr",
            opacity: expanded ? 1 : 0,
          }}
        >
          <div className="overflow-hidden">
            <div className="mt-3 flex flex-col items-center gap-2 pb-1">
              {node.children.map((child) => (
                <div
                  key={child.label}
                  className="w-full rounded-lg border border-hairline bg-surface-card px-4 py-2 text-center"
                >
                  <p className="type-body-sm text-ink">{child.label}</p>
                  {child.tags && (
                    <div className="mt-1.5 flex flex-wrap justify-center gap-1">
                      {child.tags.map((tag) => (
                        <span key={tag} className="badge-pill type-caption">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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

        <div className="flex flex-col items-center">
          <div className="card-feature w-full max-w-[280px] border-transparent bg-ink py-5 text-center text-white">
            <p className="type-title-sm font-semibold">{orgChart.level1}</p>
          </div>

          {/* Simple trunk connector below md (single row/stacked cards
              don't have distinct "columns" to branch to). */}
          <div aria-hidden className="h-8 w-px bg-hairline-strong lg:hidden" />

          {/* Elbow connector at lg+: one trunk down from the CEO card,
              then a horizontal bar spanning the row, then a vertical drop
              to each of the 4 Level-2 cards — not a plain "↓" glyph. */}
          <div aria-hidden className="hidden h-8 w-px bg-hairline-strong lg:block" />

          <div className="relative w-full lg:pt-8">
            <div
              aria-hidden
              className="absolute top-0 hidden h-px bg-hairline-strong lg:block"
              style={{ left: "12.5%", right: "12.5%" }}
            />
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
              {orgChart.level2.map((node) => (
                <div key={node.label} className="relative flex flex-col items-center">
                  <div
                    aria-hidden
                    className="absolute -top-8 hidden h-8 w-px bg-hairline-strong lg:block"
                  />
                  <OrgChartNode node={node} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
