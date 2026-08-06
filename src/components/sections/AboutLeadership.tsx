"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { hero } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/hooks";

type Leader = (typeof hero.leaders)[number];

function LeaderPortrait({ leader, size }: { leader: Leader; size: "lg" | "sm" }) {
  const px = size === "lg" ? 168 : 116;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex shrink-0 flex-col items-center gap-3"
    >
      <div
        className="card-hover-lift relative overflow-hidden rounded-2xl border border-hairline shadow-[0_16px_36px_rgba(12,10,9,0.14)] transition-transform duration-300 hover:-translate-y-1"
        style={{ width: px, height: px }}
      >
        <Image src={leader.photo} alt={leader.name} fill sizes={`${px}px`} className="object-cover" />
      </div>
      <div className="max-w-[160px] text-center">
        <p className={`text-ink ${size === "lg" ? "type-title-sm" : "type-body-strong"}`}>{leader.name}</p>
        <p className="type-caption mt-0.5 text-[var(--color-muted)]">{leader.title}</p>
      </div>
    </motion.div>
  );
}

/**
 * The CM/Minister-led "about TNeGA" band the redesign asked for once the
 * hero went text-only — CM portrait deliberately larger than the
 * Minister's throughout, on both layouts.
 */
export function AboutLeadership() {
  const [cm, minister] = hero.leaders;
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Scroll-linked (not IntersectionObserver-gated) entrance — the whole
  // band rises, scales up slightly and fades in as it's scrolled into the
  // lower half of the viewport, rather than snapping in once "visible".
  // This is the "next section comes in with parallax" the redesign asked
  // for right after the hero.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.55"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [reducedMotion ? 0 : 70, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reducedMotion ? 1 : 0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [reducedMotion ? 1 : 0, 1]);

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className="relative overflow-hidden bg-canvas-soft">
      <div
        aria-hidden
        className="orb-drift-a pointer-events-none absolute left-1/2 top-0 h-[360px] w-[500px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-lavender) 0%, transparent 70%)",
          opacity: 0.3,
        }}
      />

      <motion.div style={{ y, scale, opacity }}>
        <Container className="relative py-xxl md:py-section">
          <div className="flex flex-col items-center gap-10">
            <div className="max-w-[640px] text-center">
              <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">About TNeGA</p>
              <h2
                className="type-display-lg mb-5 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-gradient-lavender)] bg-clip-text font-bold text-transparent"
                style={{ WebkitTextFillColor: "transparent" }}
              >
                Leading Digital Tamil Nadu
              </h2>
              <p className="type-body-md text-[var(--color-body)]">{hero.description}</p>
            </div>

            {/* Mobile: portraits grouped together below the copy, size
                hierarchy still readable side by side. */}
            <div className="flex items-end justify-center gap-6 md:hidden">
              <LeaderPortrait leader={cm} size="lg" />
              <LeaderPortrait leader={minister} size="sm" />
            </div>
          </div>

          {/* Desktop: portraits flank the copy at the section's edges,
              matching the reference layout — needs its own markup rather
              than reordering the mobile row, since "grouped together" and
              "split to the edges" aren't the same DOM shape. */}
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-between px-6 md:flex lg:px-16">
            <div className="pointer-events-auto">
              <LeaderPortrait leader={cm} size="lg" />
            </div>
            <div className="pointer-events-auto">
              <LeaderPortrait leader={minister} size="sm" />
            </div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
