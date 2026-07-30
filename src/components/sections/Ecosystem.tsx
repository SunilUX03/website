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

        {/* Desktop: single row, no wrap — fixed large logo size, horizontal
            scroll as the fallback (rather than shrinking) if it doesn't
            fit at a given viewport width. Mobile: wrapped grid. */}
        <div className="grid grid-cols-3 place-items-center gap-x-4 gap-y-8 sm:grid-cols-4 md:flex md:flex-nowrap md:items-center md:justify-center md:gap-8 md:overflow-x-auto md:pb-2">
          {ecosystem.map((org) => (
            <a
              key={org.name}
              href={org.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 text-center md:shrink-0"
            >
              <span className="relative flex h-20 w-20 items-center justify-center grayscale transition-all duration-200 group-hover:grayscale-0 md:h-24 md:w-24">
                <Image src={org.logo} alt="" aria-hidden width={192} height={192} className="h-full w-full object-contain" />
              </span>
              <span className="type-caption text-[var(--color-muted)] transition-colors group-hover:text-ink md:text-[15px]">
                {org.name}
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
