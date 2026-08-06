"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { hero } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/hooks";

type Leader = (typeof hero.leaders)[number];

// Both photo slots are this wide regardless of leader size — the CM's
// photo fills it, the Minister's smaller photo sits flush-left inside it.
// Without this, the smaller photo made the Minister's name/title start
// further left than the CM's, so the two rows' text never lined up.
const PHOTO_SLOT = 100;

function LeaderSignature({ leader, size }: { leader: Leader; size: "lg" | "sm" }) {
  const px = size === "lg" ? 100 : 76;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex w-full items-center gap-3 md:w-auto"
    >
      <div
        className="flex shrink-0 items-center justify-start"
        style={{ width: PHOTO_SLOT, height: PHOTO_SLOT }}
      >
        <div
          className="overflow-hidden rounded-full border border-hairline shadow-[0_6px_14px_rgba(12,10,9,0.14)]"
          style={{ width: px, height: px }}
        >
          <Image
            src={leader.photo}
            alt={leader.name}
            width={px}
            height={px}
            className="h-full w-full object-cover"
            style={{ objectPosition: leader.photoPosition }}
          />
        </div>
      </div>
      <div className="text-left">
        <p className={`text-ink ${size === "lg" ? "type-title-sm" : "type-body-strong"}`}>{leader.name}</p>
        <p className="type-caption mt-0.5 text-[var(--color-muted)]">{leader.title}</p>
      </div>
    </motion.div>
  );
}

/**
 * The CM/Minister-led "about TNeGA" band — the message (heading +
 * description) leads, with the two leaders appearing underneath as a
 * quiet "signed by" strip rather than large flanking portraits.
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
          <div className="mx-auto max-w-[640px] text-center">
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">About TNeGA</p>
            {/* leading-[1.4] overrides type-display-lg's own tight 1.17 —
                at that line-height the "g" descender in "Leading" was
                getting clipped by the line box. */}
            <h2 className="type-display-lg mb-5 font-bold leading-[1.4] text-[var(--color-primary-blue)]">
              Leading Digital Tamil Nadu
            </h2>
            <p className="type-body-md text-[var(--color-body)]">{hero.description}</p>

            <div aria-hidden className="mx-auto my-8 h-[2px] w-20 rounded-full bg-[var(--color-hairline-strong)]" />
          </div>

          {/* Deliberately its own, wider block rather than nesting inside
              the 640px copy column above: at the larger photo sizes, the
              full titles ("Hon'ble Chief Minister of Tamil Nadu", "Hon'ble
              Minister of IT&DS") need more than 640px to stay on one line
              next to their photos, while the paragraph above still wants
              the narrower, more readable column. */}
          <div className="mx-auto max-w-[860px] text-center">
            {/* The fixed width below is deliberate, not a guess at "roughly
                centered": a row sized by its own content would center
                itself independently of the other row, so with names of
                different lengths the two photos land at different
                x-positions. A shared fixed width on both rows is what
                guarantees the photos share one left edge on mobile.
                330px (capped to 100% for narrower screens) is wide enough
                that "Thiru C. Joseph Vijay" next to the 100px CM photo
                still fits on one line instead of wrapping. */}
            <div className="mx-auto flex w-[min(330px,100%)] flex-col items-stretch gap-5 md:w-auto md:flex-row md:items-center md:justify-center md:gap-8">
              <LeaderSignature leader={cm} size="lg" />
              <div aria-hidden className="hidden h-12 w-px bg-[var(--color-hairline-strong)] md:block" />
              <LeaderSignature leader={minister} size="sm" />
            </div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
