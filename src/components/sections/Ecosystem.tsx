import { ecosystem } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export function Ecosystem() {
  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-8 text-center text-[var(--color-muted)] md:text-left">
          Our Ecosystem
        </p>

        <div className="grid grid-cols-3 place-items-center gap-x-6 gap-y-8 sm:grid-cols-4 md:flex md:flex-wrap md:justify-between md:gap-8">
          {ecosystem.map((org) => (
            <a
              key={org.name}
              href={org.href}
              target="_blank"
              rel="noopener noreferrer"
              className="type-body-sm flex h-16 w-full items-center justify-center rounded-lg border border-hairline px-4 text-center text-[var(--color-muted)] grayscale transition-all duration-200 hover:text-ink hover:grayscale-0 md:w-auto md:min-w-[140px] md:border-0"
            >
              {org.name}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
