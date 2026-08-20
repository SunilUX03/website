"use client";

import type { CmsMetric } from "@/lib/cms/metrics-types";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { useInViewOnce } from "@/lib/hooks";

export function Metrics({ metrics }: { metrics: CmsMetric[] }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.35 });

  return (
    // Solid brand blue — per reference design. White cards sit on top with
    // blue numbers/labels, rather than the light-section treatment.
    <section className="bg-[var(--color-primary-blue)]">
      <Container className="py-xxl md:py-section">
        <h2 className="type-display-lg mb-10 max-w-2xl text-white">
          Delivering Digital Governance at Scale
        </h2>

        <div ref={ref} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {metrics.map((metric, i) => (
            <div
              key={metric.label}
              className="rounded-xl bg-white px-4 py-5 transition-transform duration-300 hover:-translate-y-0.5 md:px-6 md:py-7"
            >
              <p className="type-display-sm text-[var(--color-primary-blue)]">
                <CountUp
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  start={inView}
                  delay={i * 90}
                  decimals={"decimals" in metric ? metric.decimals : undefined}
                />
              </p>
              <p className="type-caption-uppercase mt-1 text-[var(--color-primary-blue)]">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
