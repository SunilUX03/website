import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import type { CmsCareersContent } from "@/lib/cms/careers-content";
import type { Locale } from "@/lib/locale";

export function HowToApply({
  applicationSteps,
  section,
  locale = "en",
}: {
  applicationSteps: CmsCareersContent["applicationSteps"];
  section: CmsCareersContent["howToApplySection"];
  locale?: Locale;
}) {
  const isTa = locale === "ta";
  return (
    <section className="bg-canvas-soft py-xxl md:py-section">
      <Container>
        <SectionHead
          heading={section.heading}
          sub={section.sub}
          id="how-heading"
          align="center"
        />

        <ol
          className="grid gap-lg sm:grid-cols-2 lg:grid-cols-4"
          aria-label={isTa ? "விண்ணப்ப படிகள்" : "Application steps"}
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
