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

function PillarCardsMobileStatic() {
  return (
    <div className="flex flex-col gap-6">
      {pillars.map((pillar) => (
        <PillarCard key={pillar.title} pillar={pillar} />
      ))}
    </div>
  );
}

// Extra translateY (in addition to the recede offset) so stacked cards
// never appear flush/touching, even at the very start/end of the range.
const GAP_PX = 20;

function PillarCardsMobileAnimated() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setProgress(p));

  // Phase 1 (0 -> 0.5): card 2 rises to cover card 1.
  // Phase 2 (0.5 -> 1): card 3 rises to cover card 2.
  const phase1 = Math.min(progress, 0.5) / 0.5;
  const phase2 = Math.max(progress - 0.5, 0) / 0.5;

  const card1Y = lerp(0, -14, phase1);
  const card1Scale = lerp(1, 0.94, phase1);
  const card1Opacity = lerp(1, 0.45, phase1);

  const card2EnterY = lerp(100, 0, phase1);
  const card2RecedeY = lerp(0, -14, phase2);
  const card2Scale = lerp(1, 0.94, phase2);
  const card2Opacity = lerp(1, 0.45, phase2);

  const card3Y = lerp(100, 0, phase2);

  // Each stacked layer reserves GAP_PX of padding top+bottom around its
  // card, so adjacent cards can never end up perfectly flush/touching —
  // there's always a canvas-colored gap between them, independent of the
  // scroll-driven transform math above.
  const slotPadding = { paddingTop: GAP_PX / 2, paddingBottom: GAP_PX / 2 } as const;

  return (
    <div ref={containerRef} className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-20 h-[62vh] w-full overflow-visible">
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${card1Y}%) scale(${card1Scale})`,
            opacity: card1Opacity,
            ...slotPadding,
          }}
        >
          <PillarCard pillar={pillars[0]} className="h-full" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${progress <= 0.5 ? card2EnterY : card2RecedeY}%) scale(${
              progress <= 0.5 ? 1 : card2Scale
            })`,
            opacity: progress <= 0.5 ? 1 : card2Opacity,
            ...slotPadding,
          }}
        >
          <PillarCard pillar={pillars[1]} className="h-full" />
        </div>
        <div
          className="absolute inset-0"
          style={{ transform: `translateY(${card3Y}%)`, ...slotPadding }}
        >
          <PillarCard pillar={pillars[2]} className="h-full" />
        </div>
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
