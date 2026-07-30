"use client";

import { metrics } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { useInViewOnce } from "@/lib/hooks";

export function Metrics() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.35 });

  return (
    <section className="relative overflow-hidden bg-canvas-soft">
      <div
        aria-hidden
        className="orb-drift-a pointer-events-none absolute -left-24 top-0 h-[380px] w-[380px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-mint) 0%, transparent 70%)",
          opacity: 0.45,
        }}
      />
      <div
        aria-hidden
        className="orb-drift-b pointer-events-none absolute -right-24 bottom-0 h-[340px] w-[340px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-lavender) 0%, transparent 70%)",
          opacity: 0.45,
        }}
      />

      <Container className="relative py-xxl md:py-section">
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">
          Delivering Digital Governance at State Scale
        </h2>

        <div ref={ref} className="metrics-grid grid grid-cols-2 md:grid-cols-3">
          {metrics.map((metric, i) => (
            <div key={metric.label} className="metrics-grid-item px-0 py-4 md:px-6 md:py-6">
              <p className="type-display-sm text-ink">
                <CountUp
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  start={inView}
                  delay={i * 90}
                />
              </p>
              <p className="type-caption-uppercase mt-1 text-[var(--color-muted)]">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </Container>

      <style>{`
        /* Mobile: 2 columns x 3 rows */
        .metrics-grid-item:nth-child(n + 3) {
          border-top: 1px solid var(--color-hairline);
        }
        .metrics-grid-item:nth-child(2n) {
          border-left: 1px solid var(--color-hairline);
        }

        /* Desktop: 3 columns x 2 rows */
        @media (min-width: 768px) {
          .metrics-grid-item:nth-child(n + 3) {
            border-top: none;
          }
          .metrics-grid-item:nth-child(2n) {
            border-left: none;
          }
          .metrics-grid-item:nth-child(n + 4) {
            border-top: 1px solid var(--color-hairline);
          }
          .metrics-grid-item:nth-child(3n + 2),
          .metrics-grid-item:nth-child(3n) {
            border-left: 1px solid var(--color-hairline);
          }
        }
      `}</style>
    </section>
  );
}
