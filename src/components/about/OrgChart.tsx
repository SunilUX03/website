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
    <div className="flex flex-col items-center">
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
          "card-feature flex w-full max-w-[240px] items-center justify-center gap-2 py-4 text-center",
          hasChildren && "cursor-pointer outline-none hover:border-[var(--color-primary-blue)] focus-visible:border-[var(--color-primary-blue)]"
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

        <div className="flex flex-col items-center gap-8">
          <div className="card-feature w-full max-w-[280px] border-transparent bg-ink py-5 text-center text-white">
            <p className="type-title-sm font-semibold">{orgChart.level1}</p>
          </div>

          <svg width="16" height="26" viewBox="0 0 16 26" fill="none" aria-hidden>
            <path d="M8 0v18" stroke="var(--color-hairline-strong)" strokeWidth="1.5" />
            <path
              d="M2 16l6 6 6-6"
              stroke="var(--color-hairline-strong)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
            {orgChart.level2.map((node) => (
              <OrgChartNode key={node.label} node={node} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
