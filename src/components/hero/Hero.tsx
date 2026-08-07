"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { hero } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroDotCursor } from "./HeroDotCursor";
import { useReducedMotion } from "@/lib/hooks";

// Cascading reveal on mount — brand title, then each headline word in
// sequence, then tagline, then CTAs. Each piece eases in from a slight
// blur/offset rather than popping in instantly.
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};
const riseIn: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const CYCLE_MS = 2600;
const BRAND_CYCLE_MS = 3200;

/** Advances through `length` items on a timer, frozen at 0 under reduced
 * motion. Shared by the brand title (English/Tamil) and the headline's
 * cycling word — same mechanism, different content and interval. */
function useCycleIndex(length: number, intervalMs: number, reducedMotion: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion || length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % length), intervalMs);
    return () => clearInterval(id);
  }, [reducedMotion, length, intervalMs]);
  return index;
}

/**
 * The dominant line in the hero — the agency's own name, cycling English
 * and Tamil, same crossfade technique as the headline's cycling word. Per
 * direct feedback (referencing ELCOT's own site as the bar): the org name
 * should be the first, biggest thing a visitor reads, not a small label
 * above the "real" headline — so this now outsizes the headline below it,
 * which is the reverse of where this started. Solid brand blue, not
 * gradient: the one piece of text whose entire job is "immediately read
 * as TNeGA" gets the plainest, most legible treatment.
 */
function CyclingBrandTitle({ reducedMotion }: { reducedMotion: boolean }) {
  const items = hero.agencyLabelCycle;
  const index = useCycleIndex(items.length, BRAND_CYCLE_MS, reducedMotion);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.p
        key={items[index]}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-[32px] font-bold uppercase leading-[1.2] tracking-wide text-[var(--color-primary-blue)] sm:text-[42px] md:text-[50px]"
        lang={index === 0 ? "en" : "ta"}
      >
        {items[index]}
      </motion.p>
    </AnimatePresence>
  );
}

/**
 * The one headline word that keeps rotating through `hero.headlineCycleWords`
 * after the initial reveal — always shown in the brand gradient (not just on
 * hover, unlike its sibling words) so it reads as "this part changes" at a
 * glance. Sizes naturally (no fixed-width slot). Now the supporting
 * statement under the (much bigger) brand name above it, sized well below
 * it accordingly — small enough that even "Powering Digital Infrastructure
 * in Tamil Nadu" fits on one line within the hero's column, so there's no
 * wrap-point to manage.
 */
function HeadlineCycleWord({ reducedMotion }: { reducedMotion: boolean }) {
  const words = hero.headlineCycleWords;
  const index = useCycleIndex(words.length, CYCLE_MS, reducedMotion);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={words[index]}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -14 }}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(120deg, var(--color-gradient-violet) 0%, var(--color-gradient-sky) 50%, var(--color-primary-blue) 100%)",
        }}
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const headlineWords = hero.headline.split(" ");
  const cycleWordIndex = headlineWords.findIndex((w) => w === hero.headlineCycleWords[0]);

  const scrollToNextSection = () => {
    const el = heroRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <section
      ref={heroRef as React.RefObject<HTMLElement>}
      className="relative flex min-h-[560px] items-center overflow-hidden bg-canvas md:min-h-[680px]"
      id="main-content"
    >
      <HeroDotCursor targetRef={heroRef} />
      <HeroBackdrop heroRef={heroRef} />

      <Container className="relative py-xxl md:py-section">
        <motion.div
          // 1080px (up from the headline-only era's 1000px) — the brand
          // title now runs up to 50px, and "TAMIL NADU E-GOVERNANCE
          // AGENCY" needs the extra headroom to keep clearing the column
          // on one line at that size.
          className="mx-auto flex w-full max-w-[1080px] flex-col items-center gap-5 text-center"
          initial={reducedMotion ? "show" : "hidden"}
          animate="show"
          variants={stagger}
        >
          <motion.div variants={riseIn}>
            <CyclingBrandTitle reducedMotion={reducedMotion} />
          </motion.div>

          {/* w-full here is the fix for the headline/tagline drifting out
              of alignment with each other: without it, this div (and the
              h1 inside it) shrink-wraps to the width of its widest line,
              so the shorter tagline below then centers itself within that
              narrower box instead of the full column — the two looked
              "centered" relative to different boxes. Pinning both to the
              same full-width box fixes that for good. */}
          <div className="flex w-full flex-col items-center gap-5" data-hero-text>
            <h1
              aria-label={hero.headline}
              className="flex w-full flex-wrap justify-center gap-x-1 gap-y-1 text-[22px] font-bold text-ink sm:text-[24px]"
            >
              {headlineWords.map((word, i) =>
                i === cycleWordIndex ? (
                  <motion.span key={`${word}-${i}`} aria-hidden variants={riseIn}>
                    <HeadlineCycleWord reducedMotion={reducedMotion} />
                  </motion.span>
                ) : (
                  <motion.span
                    key={`${word}-${i}`}
                    aria-hidden
                    variants={riseIn}
                    // The gradient is always painted in (bg-clip-text is a
                    // no-op visually while the fill is opaque) — hovering
                    // just swaps the fill to transparent, letting it show
                    // through the letter shapes instead of the solid ink.
                    // Needs the bold weight above: bg-clip-text on thin
                    // strokes reads as messy/illegible, bold gives the
                    // gradient enough letterform to sit in.
                    className="relative inline-block bg-clip-text py-0.5 transition-[background-position,color,transform] duration-500 ease-out hover:-translate-y-1 hover:text-transparent motion-safe:hover:[background-position:100%_50%]"
                    style={{
                      backgroundImage:
                        "linear-gradient(120deg, var(--color-gradient-violet) 0%, var(--color-gradient-sky) 50%, var(--color-primary-blue) 100%)",
                      backgroundSize: "220% 220%",
                      backgroundPosition: "0% 50%",
                    }}
                  >
                    {word}
                  </motion.span>
                )
              )}
            </h1>

            <motion.p
              variants={riseIn}
              className="type-body-md mx-auto max-w-[46ch] text-center text-[var(--color-body)]"
            >
              {hero.tagline}
            </motion.p>
          </div>

          <motion.div className="flex flex-wrap justify-center gap-3 pt-2" variants={riseIn}>
            <a
              href="/about"
              className="type-button btn-primary transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(29,63,143,0.28)]"
            >
              About us
            </a>
            <a
              href="/services"
              className="type-button btn-outline bg-surface-card shadow-[0_1px_3px_rgba(12,10,9,0.06)] hover:bg-canvas-soft"
            >
              View services
            </a>
          </motion.div>

          {/* Scroll cue — invites the next scroll rather than leaving the
              hero feeling like a dead end once the CTAs are read, and now
              actually does something when clicked instead of just decoration. */}
          <motion.button
            type="button"
            onClick={scrollToNextSection}
            variants={riseIn}
            aria-label="Scroll to next section"
            className="mt-2 flex flex-col items-center gap-1.5 text-[var(--color-muted)] transition-colors hover:text-ink"
          >
            <span className="type-caption-uppercase">Scroll</span>
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 motion-safe:animate-bounce"
              fill="none"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </motion.div>
      </Container>
    </section>
  );
}
