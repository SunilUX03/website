import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import type { CmsCareersContent } from "@/lib/cms/careers-content";

export function HowToApply({ applicationSteps }: { applicationSteps: CmsCareersContent["applicationSteps"] }) {
  return (
    <section className="bg-canvas-soft py-xxl md:py-section">
      <Container>
        <SectionHead
          heading="How to Apply"
          sub="A simple four step process to join our team."
          id="how-heading"
          align="center"
        />

        <ol
          className="grid gap-lg sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Application steps"
        >
          {applicationSteps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-sm rounded-xl border border-hairline bg-surface-card p-lg"
            >
              <span
                aria-hidden
                className="type-display-sm text-[var(--color-muted-soft)]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="type-title-sm text-[var(--color-body-strong)]">
                {step.title}
              </p>
              <p className="type-body-sm text-[var(--color-body)]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
