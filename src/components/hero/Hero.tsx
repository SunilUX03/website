"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { hero } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroDotCursor } from "./HeroDotCursor";
import { useReducedMotion } from "@/lib/hooks";

// Cascading reveal on mount — badge, then each headline word in sequence,
// then tagline, then CTAs. Each word eases in from a slight blur/offset
// rather than popping in instantly.
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

/**
 * The one headline word that keeps rotating through `hero.headlineCycleWords`
 * after the initial reveal — always shown in the brand gradient (not just on
 * hover, unlike its sibling words) so it reads as "this part changes" at a
 * glance. No fixed-width slot: at type-display-mega's 64px size a slot wide
 * enough for "Infrastructure" was ~500-570px, more than half the hero's own
 * max-width, which blew up the headline's line-wrapping entirely. Sizing
 * naturally means the row it sits in re-centers by a few px each cycle
 * instead — a far smaller cost than that.
 */
function HeadlineCycleWord({ words, reducedMotion }: { words: string[]; reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || words.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reducedMotion, words.length]);

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
            "linear-gradient(120deg, var(--color-primary-blue) 0%, var(--color-gradient-sky) 45%, var(--color-gradient-violet) 100%)",
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
  // Split into two fixed rows right after the cycling word ("Powering
  // Digital Governance" / "in Tamil Nadu") rather than one long flex-wrap
  // of the whole headline — the wrap point needs to stay put regardless of
  // container width, not drift with whatever the browser's greedy wrap
  // happens to fit per line.
  const headlineRows = [headlineWords.slice(0, cycleWordIndex + 1), headlineWords.slice(cycleWordIndex + 1)];

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
          // 1000px (not the previous 820px) is deliberate: "Powering Digital
          // Infrastructure" — the longest cycling-word combination — needs
          // ~880px at this font size, and "Governance" ~845px; 820px was
          // narrow enough that only "Services" (~740px) ever fit row 1 on
          // one line, so the other two words wrapped mid-row instead of
          // breaking cleanly after the cycling word. The tagline below
          // keeps its own tighter max-w-[46ch] regardless, so it doesn't
          // end up reading as a wide, hard-to-scan line just because the
          // headline needed more room.
          className="mx-auto flex w-full max-w-[1000px] flex-col items-center gap-6 text-center"
          initial={reducedMotion ? "show" : "hidden"}
          animate="show"
          variants={stagger}
        >
          <motion.p variants={riseIn} className="type-caption-uppercase text-[var(--color-muted)]">
            {hero.agencyLabel}
          </motion.p>

          {/* w-full here is the fix for the headline/tagline drifting out
              of alignment with each other: without it, this div (and the
              h1 inside it) shrink-wraps to the width of its widest line,
              so the shorter tagline below then centers itself within that
              narrower box instead of the full 820px column — the two
              looked "centered" relative to different boxes. Pinning both
              to the same full-width box fixes that for good. */}
          <div className="flex w-full flex-col items-center gap-6" data-hero-text>
            {/* leading-[1.4] overrides type-display-mega's own tight 1.05
                line-height — needed here specifically because hovering a
                word lifts it slightly (hover:-translate-y-1); at the
                type spec's normal line-height that lift made the word
                visually cover the line above it (or the line below covered
                it back), which is exactly what more breathing room fixes. */}
            <h1
              aria-label={hero.headline}
              className="type-display-mega flex w-full flex-col items-center gap-y-2 font-bold leading-[1.4] text-ink"
            >
              {headlineRows.map((row, rowI) => (
                <span key={rowI} className="flex flex-wrap justify-center gap-x-1">
                  {row.map((word, i) => {
                    const wordIndex = rowI === 0 ? i : i + headlineRows[0].length;
                    return wordIndex === cycleWordIndex ? (
                      <motion.span key={`${word}-${wordIndex}`} aria-hidden variants={riseIn}>
                        <HeadlineCycleWord words={hero.headlineCycleWords} reducedMotion={reducedMotion} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key={`${word}-${wordIndex}`}
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
                            "linear-gradient(120deg, var(--color-primary-blue) 0%, var(--color-gradient-sky) 45%, var(--color-gradient-violet) 100%)",
                          backgroundSize: "220% 220%",
                          backgroundPosition: "0% 50%",
                        }}
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </span>
              ))}
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
              hero feeling like a dead end once the CTAs are read. */}
          <motion.div
            variants={riseIn}
            className="mt-2 flex flex-col items-center gap-1.5 text-[var(--color-muted)]"
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
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
