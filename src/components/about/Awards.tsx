"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { awards } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";
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

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(Math.max(t, 0), 1);
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

// Direct reuse of Home's PillarCards mobile card-stack-scroll mechanic —
// same math, same three-card assumption (Awards also has exactly 3
// items): the next card rises to cover the previous one, which recedes
// (moves up slightly, scales down, dims), reversible on scroll-up.
const GAP_PX = 20;

function AwardsMobileAnimated() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setProgress(p));

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

  const slotPadding = { paddingTop: GAP_PX / 2, paddingBottom: GAP_PX / 2 } as const;

  return (
    <div ref={containerRef} className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-20 h-[62vh] w-full overflow-visible">
        <div
          className="absolute inset-0"
          style={{ transform: `translateY(${card1Y}%) scale(${card1Scale})`, opacity: card1Opacity, ...slotPadding }}
        >
          <AwardCard award={awards[0]} className="h-full" />
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
          <AwardCard award={awards[1]} className="h-full" />
        </div>
        <div className="absolute inset-0" style={{ transform: `translateY(${card3Y}%)`, ...slotPadding }}>
          <AwardCard award={awards[2]} className="h-full" />
        </div>
      </div>
    </div>
  );
}

function AwardsMobile() {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <AwardsMobileStatic /> : <AwardsMobileAnimated />;
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
