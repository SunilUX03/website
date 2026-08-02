"use client";

import { awards } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { MobileCardStack } from "@/components/ui/MobileCardStack";
import { useIsDesktop, useReducedMotion } from "@/lib/hooks";

function AwardCard({
  award,
  className,
  style,
}: {
  award: (typeof awards)[number];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`card-feature group overflow-hidden !p-0 ${className ?? ""}`} style={style}>
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

function AwardsDesktop() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {awards.map((award) => (
        <AwardCard key={award.title} award={award} className="h-full" />
      ))}
    </div>
  );
}

function AwardsMobileStatic() {
  return (
    <div className="flex flex-col gap-6">
      {awards.map((award) => (
        <AwardCard key={award.title} award={award} />
      ))}
    </div>
  );
}

function AwardsMobile() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <AwardsMobileStatic />;
  return (
    <MobileCardStack
      items={awards}
      getKey={(award) => award.title}
      renderCard={(award) => <AwardCard award={award} />}
      // Shorter than the 70vh default — this section sits right under its
      // own heading with no extra content above the deck, so the taller
      // default left a visibly empty band before the first card appeared.
      deckHeightVh={50}
    />
  );
}

export function Awards() {
  const isDesktop = useIsDesktop();

  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          Awards &amp; Recognition
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">
          Recognised for governance impact
        </h2>

        {isDesktop === true && <AwardsDesktop />}
        {isDesktop === false && <AwardsMobile />}
      </Container>
    </section>
  );
}
