import Image from "next/image";
import { ecosystem } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export function Ecosystem() {
  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-8 text-center text-[var(--color-muted)] md:text-left">
          Our Ecosystem
        </p>

        {/* Desktop: single row, no wrap — shrinks to fit, scrolls as a
            fallback before ever wrapping. Mobile: wrapped grid. */}
        <div className="grid grid-cols-3 place-items-center gap-x-4 gap-y-8 sm:grid-cols-4 md:flex md:flex-nowrap md:items-center md:justify-between md:gap-3 md:overflow-x-auto">
          {ecosystem.map((org) => (
            <a
              key={org.name}
              href={org.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 text-center md:min-w-[112px] md:flex-1 md:basis-0"
            >
              <span className="relative flex h-16 w-16 items-center justify-center grayscale transition-all duration-200 group-hover:grayscale-0 md:h-14 md:w-14">
                <Image src={org.logo} alt="" aria-hidden width={96} height={96} className="h-full w-full object-contain" />
              </span>
              <span className="type-caption text-[var(--color-muted)] transition-colors group-hover:text-ink md:text-xs md:leading-tight">
                {org.name}
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
