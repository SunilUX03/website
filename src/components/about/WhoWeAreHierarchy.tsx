"use client";

import clsx from "clsx";
import { whoWeAre, hierarchy } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";

function Connector() {
  return (
    <div aria-hidden className="flex justify-center py-1">
      <svg width="16" height="26" viewBox="0 0 16 26" fill="none">
        <path d="M8 0v18" stroke="var(--color-hairline-strong)" strokeWidth="1.5" />
        <path
          d="M2 16l6 6 6-6"
          stroke="var(--color-hairline-strong)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function HierarchyBox({ label, emphasized }: { label: string; emphasized: boolean }) {
  return (
    <div
      tabIndex={0}
      className={clsx(
        "hierarchy-box w-full rounded-xl border px-6 py-4 text-center outline-none transition-all duration-200",
        emphasized
          ? "hierarchy-box-emphasized border-transparent bg-[var(--color-primary-blue)] text-white"
          : "border-hairline bg-surface-card text-ink"
      )}
    >
      <p className={emphasized ? "type-title-sm font-semibold" : "type-body-strong"}>{label}</p>
    </div>
  );
}

export function WhoWeAreHierarchy() {
  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[55%_45%] lg:items-center lg:gap-12">
          <div>
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Who We Are</p>
            <h2 className="type-display-lg mb-5 text-ink">{whoWeAre.heading}</h2>
            <p className="type-body-md max-w-[62ch] text-[var(--color-body)]">
              {whoWeAre.paragraph}
            </p>
          </div>

          <div className="flex flex-col items-center">
            {hierarchy.map((tier, i) => (
              <div key={tier.label} className="w-full max-w-[320px]">
                <HierarchyBox label={tier.label} emphasized={tier.emphasized} />
                {i < hierarchy.length - 1 && <Connector />}
              </div>
            ))}
          </div>
        </div>
      </Container>

      <style>{`
        .hierarchy-box:hover,
        .hierarchy-box:focus-visible {
          transform: scale(1.03);
          border-color: var(--color-primary-blue);
        }
        .hierarchy-box:not(.hierarchy-box-emphasized):hover,
        .hierarchy-box:not(.hierarchy-box-emphasized):focus-visible {
          background-color: rgba(29, 63, 143, 0.06);
        }
        .hierarchy-box-emphasized:hover,
        .hierarchy-box-emphasized:focus-visible {
          background-color: var(--color-primary-blue-active);
        }
      `}</style>
    </section>
  );
}
