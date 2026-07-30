"use client";

import { useState } from "react";
import { categories } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { useIsDesktop } from "@/lib/hooks";

type Category = (typeof categories)[number];

function CategoryDesktopRow({ items, offset }: { items: Category[]; offset: number }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex gap-4">
      {items.map((cat, i) => {
        const isHovered = hovered === i;
        const grow = hovered === null ? 1 : isHovered ? 2.4 : 0.65;
        return (
          <div
            key={cat.title}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ flexGrow: grow, flexBasis: 0 }}
            className="card-feature relative h-64 min-w-0 overflow-hidden !p-0 transition-[flex-grow] duration-[400ms] ease-out"
          >
            <PhotoTile
              src={cat.image}
              alt=""
              aspect="aspect-auto"
              className="absolute inset-0 h-full w-full"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
            {/* Strong, full-card scrim — these are compact cards, so text
                needs guaranteed contrast against whatever the photo is,
                not just a bottom-heavy fade like the larger Spotlight
                slabs get away with. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(12,10,9,0.92) 0%, rgba(12,10,9,0.78) 40%, rgba(12,10,9,0.45) 65%, rgba(12,10,9,0.15) 100%)",
              }}
            />
            <div className="relative flex h-full flex-col justify-end p-6 text-white">
              <p className="type-caption-uppercase mb-2 text-white/70">
                {String(offset + i + 1).padStart(2, "0")}
              </p>
              {/* Squeezed-card fix: title wraps up to 2 lines instead of
                  nowrap-overflowing, and clips cleanly if it still doesn't
                  fit rather than spilling past the card frame. */}
              <h3 className="type-title-md line-clamp-2 text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
                {cat.title}
              </h3>
              {/* Always visible now — hover still widens the card (more
                  breathing room, up to 4 lines) but the description is
                  never hidden behind a hover requirement. */}
              <p
                className={`type-body-sm mt-2 max-w-[46ch] text-white/90 transition-all duration-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] ${
                  isHovered ? "line-clamp-4" : "line-clamp-2"
                }`}
              >
                {cat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CategoryMobileItem({ cat }: { cat: Category }) {
  return (
    <div className="card-feature relative overflow-hidden !p-0">
      <PhotoTile src={cat.image} alt="" aspect="aspect-[16/9]" className="w-full" />
      <div className="p-5">
        <h3 className="type-title-md text-ink">{cat.title}</h3>
        {/* Always visible — no tap-to-expand gate hiding the description. */}
        <p className="type-body-sm mt-2 text-[var(--color-body)]">{cat.description}</p>
      </div>
    </div>
  );
}

export function CategoryCards() {
  const isDesktop = useIsDesktop();
  const rowA = categories.slice(0, 3);
  const rowB = categories.slice(3, 6);

  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          What We Bring to the Table
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">Projects &amp; Services</h2>

        {/* isDesktop is null until mounted — render nothing that first tick
            so desktop/mobile variants (and their background images) are
            never both in the DOM at once. */}
        {isDesktop === true && (
          <div className="flex flex-col gap-4">
            <CategoryDesktopRow items={rowA} offset={0} />
            <CategoryDesktopRow items={rowB} offset={3} />
          </div>
        )}

        {isDesktop === false && (
          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <CategoryMobileItem key={cat.title} cat={cat} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
