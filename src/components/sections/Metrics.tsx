import type { CmsMetricsContent } from "@/lib/cms/metrics-types";
import { Container } from "@/components/ui/Container";

export function Metrics({ heading, metrics }: CmsMetricsContent) {
  return (
    // Solid brand blue — per reference design. White cards sit on top with
    // blue numbers/labels, rather than the light-section treatment.
    <section className="bg-[var(--color-primary-blue)]">
      <Container className="py-xxl md:py-section">
        <h2 className="type-display-lg mb-10 max-w-2xl text-white">{heading}</h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl bg-white px-4 py-5 transition-transform duration-300 hover:-translate-y-0.5 md:px-6 md:py-7"
            >
              <p className="type-display-sm text-[var(--color-primary-blue)]">{metric.metric}</p>
              <p className="type-caption-uppercase mt-1 text-[var(--color-primary-blue)]">{metric.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
