"use client";

import type { CmsMetric } from "@/lib/cms/metrics-types";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { useInViewOnce } from "@/lib/hooks";

export function Metrics({ metrics }: { metrics: CmsMetric[] }) {
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
      {/* Central spotlight pooled behind the metric grid, giving the whole
          section more presence than the two edge orbs alone. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 720px 460px at 50% 55%, rgba(29,63,143,0.08) 0%, transparent 70%)",
        }}
      />

      <Container className="relative py-xxl md:py-section">
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">
          Delivering Digital Governance at Scale
        </h2>

        <div ref={ref} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {metrics.map((metric, i) => (
            <div
              key={metric.label}
              className="metric-card group relative overflow-hidden rounded-xl border border-hairline bg-surface-card px-4 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-[0_10px_30px_rgba(29,63,143,0.10)] md:px-6 md:py-7"
            >
              {/* Ambient soothing glow that fades in behind the number on
                  hover — soft primary-tinted radial that sits under the
                  content, per design. Pointer-events off so it never
                  interferes; fades via opacity for a smooth reveal. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-6 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, var(--color-gradient-sky) 0%, transparent 70%)",
                }}
              />
              <div className="relative">
                <p className="type-display-sm text-ink">
                  <CountUp
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    start={inView}
                    delay={i * 90}
                    decimals={"decimals" in metric ? metric.decimals : undefined}
                  />
                </p>
                <p className="type-caption-uppercase mt-1 text-[var(--color-muted)]">
                  {metric.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
