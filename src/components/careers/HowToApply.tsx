import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { applicationSteps } from "@/lib/careers-content";

export function HowToApply() {
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
          {applicationSteps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col gap-sm rounded-xl border border-hairline bg-surface-card p-lg"
            >
              <span
                aria-hidden
                className="type-display-sm text-[var(--color-muted-soft)]"
              >
                {step.number}
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
