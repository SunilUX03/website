"use client";

import type { CmsAward } from "@/lib/cms/about-types";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { AutoCarousel } from "@/components/ui/AutoCarousel";

function AwardCard({ award }: { award: CmsAward }) {
  return (
    <div className="card-feature group flex h-full flex-col overflow-hidden !p-0">
      <div className="overflow-hidden">
        <PhotoTile
          src={award.image}
          alt={award.title}
          aspect="aspect-[4/3]"
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-6">
        <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">{award.year}</p>
        <h3 className="type-title-md mb-2 text-ink">{award.title}</h3>
        <p className="type-body-sm text-[var(--color-body)]">{award.description}</p>
      </div>
    </div>
  );
}

export function Awards({ awards }: { awards: CmsAward[] }) {
  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          Awards &amp; Recognition
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">
          Recognised for governance impact
        </h2>

        {/* Arrows float over the track's edges here (instead of sitting
            beside it) so the card itself can use the track's full width —
            title text like "National Digital Transformation Award" needs
            the extra room to avoid wrapping into single-word lines. */}
        <AutoCarousel arrowStyle="overlay">
          {awards.map((award) => (
            <div
              key={award.id}
              data-carousel-item
              className="w-[88%] max-w-[340px] shrink-0 snap-center sm:w-[300px]"
            >
              <AwardCard award={award} />
            </div>
          ))}
        </AutoCarousel>
      </Container>
    </section>
  );
}
