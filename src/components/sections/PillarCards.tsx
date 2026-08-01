"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { pillars } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { useReducedMotion, useIsDesktop } from "@/lib/hooks";

function PillarCard({
  pillar,
  className,
  style,
}: {
  pillar: (typeof pillars)[number];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`card-feature group overflow-hidden !p-0 ${className ?? ""}`} style={style}>
      <div className="overflow-hidden">
        <PhotoTile
          src={pillar.image}
          alt={pillar.title}
          aspect="aspect-[4/3]"
          className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-6">
        <h3 className="type-title-md mb-2 text-ink">{pillar.title}</h3>
        <p className="type-body-sm text-[var(--color-body)]">{pillar.description}</p>
      </div>
    </div>
  );
}

function PillarCardsDesktop() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {pillars.map((pillar, i) => (
        <motion.div
          key={pillar.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.09, ease: "easeOut" }}
        >
          <PillarCard pillar={pillar} className="h-full" />
        </motion.div>
      ))}
    </div>
  );
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(Math.max(t, 0), 1);
}

// Smooth ease-in-out so a card glides into place and settles, instead of
// travelling at a constant rate and stopping dead (the "comes too quickly
// & stops" problem). Applied to every scroll-driven transition below.
function easeInOut(t: number) {
  const c = Math.min(Math.max(t, 0), 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

function PillarCardsMobileStatic() {
  return (
    <div className="flex flex-col gap-6">
      {pillars.map((pillar) => (
        <PillarCard key={pillar.title} pillar={pillar} />
      ))}
    </div>
  );
}

/**
 * Mobile card deck.
 *
 * As the user scrolls, cards stack like a physical deck: the active card
 * sits on top, and cards already passed recede *behind and slightly up*
 * so they stay visible peeking out (you can always see the previous card,
 * which the earlier version hid). The incoming card eases up from below to
 * settle on top. Scroll up and the sequence reverses naturally (3 → 2 → 1),
 * because every transform is a pure function of scroll progress.
 *
 * N pillars share one sticky viewport; progress is divided into N-1 equal
 * segments, one per hand-off between adjacent cards.
 */

// How far a receded card sits behind the top of the stack, and how much it
// shrinks / fades — tuned so the previous card clearly peeks out above the
// active one rather than vanishing.
const RECEDE_Y = -8; // % upward per level behind
const RECEDE_SCALE = 0.05; // scale lost per level behind
const RECEDE_OPACITY = 0.4; // opacity floor for the deepest visible card

function PillarCardsMobileAnimated() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setProgress(p));

  const count = pillars.length;
  const segments = Math.max(count - 1, 1);

  return (
    // Taller scroll room per card gives each hand-off space to breathe, so
    // nothing is rushed. ~150vh per transition.
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${100 + segments * 150}vh` }}
    >
      <div className="sticky top-20 flex h-[70vh] w-full items-center justify-center overflow-visible">
        {pillars.map((pillar, i) => {
          // scrollPos in card-index space: 0 = card 0 active, 1 = card 1
          // active, … Fractional values are mid hand-off.
          const scrollPos = progress * segments;
          // How far this card's "active moment" is from the current scroll
          // position. Negative = already passed (receded behind);
          // positive = still waiting below; ~0 = active on top.
          const delta = i - scrollPos;

          let translateY: number;
          let scale: number;
          let opacity: number;
          let zIndex: number;

          if (delta >= 1) {
            // Still fully below the deck, waiting off-screen.
            translateY = 100;
            scale = 1;
            opacity = 0;
            zIndex = 0;
          } else if (delta > 0) {
            // Entering: ease up from below (100% → 0%) as delta 1 → 0.
            const t = easeInOut(1 - delta);
            translateY = lerp(100, 0, t);
            scale = 1;
            opacity = lerp(0, 1, Math.min(t * 1.4, 1));
            zIndex = 10 + i;
          } else {
            // Passed: recede behind and up, staying visible as a peeking
            // layer. `behind` grows the further back this card is.
            const behind = -delta; // 0..(count-1)
            const t = easeInOut(Math.min(behind, 1));
            translateY = RECEDE_Y * behind;
            scale = 1 - RECEDE_SCALE * behind;
            opacity = lerp(1, RECEDE_OPACITY, t);
            // Cards further back sit lower in the stack.
            zIndex = 10 - Math.ceil(behind);
          }

          return (
            // Outer layer handles ONLY horizontal centering + width
            // constraint (stable, never animated). The inner layer carries
            // the scroll-driven vertical transform. Keeping these separate
            // avoids the earlier bug where an inline `transform` that
            // re-declared translate(-50%,…) fought the Tailwind centering
            // classes and pushed the card ~120px off the left edge.
            <div
              key={pillar.title}
              className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-center px-5"
              style={{ zIndex }}
            >
              <div
                className="pointer-events-auto w-full max-w-[360px]"
                style={{
                  transform: `translateY(-50%) translateY(${translateY}%) scale(${scale})`,
                  opacity,
                  transformOrigin: "center center",
                  willChange: "transform, opacity",
                }}
              >
                <PillarCard
                  pillar={pillar}
                  className="shadow-[0_10px_40px_rgba(12,10,9,0.10)]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PillarCardsMobile() {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <PillarCardsMobileStatic /> : <PillarCardsMobileAnimated />;
}

export function PillarCards() {
  const isDesktop = useIsDesktop();

  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          Enabling Digital Governance
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">
          How TNeGA powers governance across Tamil Nadu
        </h2>

        {/* isDesktop is null until mounted — render nothing that first tick
            so desktop/mobile variants are never both in the DOM at once. */}
        {isDesktop === true && <PillarCardsDesktop />}
        {isDesktop === false && <PillarCardsMobile />}
      </Container>
    </section>
  );
}
