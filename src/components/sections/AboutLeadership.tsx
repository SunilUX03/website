"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { CmsLeader, CmsLeadershipBand } from "@/lib/cms/leadership-band-types";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/hooks";

type Leader = CmsLeader;

// Square photo, name and designation stacked underneath and centered —
// matches the ELCOT-site reference the redesign was asked to follow,
// replacing the old circular "signed by" strip layout. `photoSize` and
// `textWidth` are independent: the Minister's photo runs smaller than
// the CM's (per feedback), but its designation is much longer ("Hon'ble
// Minister for Artificial Intelligence, Information Technology and
// Digital Services") and needs a wider text column to wrap to 2 lines
// rather than 3 — tying that column to the smaller photo width would
// have made the wrap worse, not better.
function LeaderCard({ leader, photoSize, textWidth }: { leader: Leader; photoSize: number; textWidth: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      // shrink-0 is load-bearing: without it, the row's default flex-shrink
      // let this column get compressed under the center text block's
      // demand for space, which silently undid `textWidth` and pushed the
      // designation back to 3 lines. The paragraph below can reflow
      // narrower gracefully; a name/photo column should not.
      //
      // items-stretch (not items-center) — align-items:center on a flex
      // column shrink-wraps every child to its own content width instead
      // of the column's set width, so the designation <p> had nothing to
      // wrap against and collapsed to its narrowest possible line. The
      // fixed-size photo below is unaffected (it has its own explicit
      // width/height) and gets `mx-auto` to stay centered now that the
      // column itself no longer centers it.
      className="flex shrink-0 flex-col items-stretch text-center"
      style={{ width: textWidth, maxWidth: "100%" }}
    >
      <div
        className="mx-auto overflow-hidden rounded-2xl border border-hairline shadow-[0_6px_14px_rgba(12,10,9,0.14)]"
        style={{ width: photoSize, height: photoSize }}
      >
        <Image
          src={leader.photo}
          alt={leader.name}
          width={photoSize}
          height={photoSize}
          className="h-full w-full object-cover"
          style={{ objectPosition: leader.photoPosition }}
        />
      </div>
      <p className="type-title-sm mt-4 text-ink">{leader.name}</p>
      <p className="type-caption mt-1 text-[var(--color-muted)]">{leader.title}</p>
    </motion.div>
  );
}

/** The CM/Minister-led "about TNeGA" band — square leader portraits flank
 * the heading/description on desktop, matching the reference layout. */
export function AboutLeadership({ band }: { band: CmsLeadershipBand }) {
  const [cm, minister] = band.leaders;
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
          {/* CM and Minister flank the message on desktop (matching the
              reference layout); stack top-to-bottom on mobile in the same
              left-to-right reading order: CM, message, Minister. */}
          <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-10 md:flex-row md:items-center md:justify-center md:gap-10">
            <LeaderCard leader={cm} photoSize={220} textWidth={220} />

            <div className="max-w-[560px] text-center">
              {/* leading-[1.4] overrides type-display-lg's own tight 1.17 —
                  at that line-height the "g" descender in "Leading" was
                  getting clipped by the line box. */}
              <h2 className="type-display-lg mb-5 font-bold leading-[1.4] text-[var(--color-primary-blue)]">
                Leading Digital Tamil Nadu
              </h2>
              <p className="type-body-md text-[var(--color-body)]">{band.description}</p>
            </div>

            <LeaderCard leader={minister} photoSize={143} textWidth={300} />
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
