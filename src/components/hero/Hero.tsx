"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { CmsHeroContent } from "@/lib/cms/hero-content-types";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/hooks";
// Static import (not a "/images/..." string path) on purpose: Next
// fingerprints the built filename by content hash, so replacing this file
// on disk always produces a new URL instead of silently reusing a stale
// cached copy at the old one — the "old image keeps coming back" bug.
import heroCollage from "../../../public/images/hero/tn-citizens-collage.png";

// One-time entrance reveal on mount — name, then caption, then image, then
// the scroll cue. No longer a continuous cycle: per feedback, the hero is
// now just the agency name + caption, so there's nothing left to cycle
// through.
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
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

const WORD_INTERVAL_MS = 2400;

// Vertical roll, box width tracks the current word (no reserved dead
// space) — mode="popLayout" drops the exiting word out of flow the
// instant it starts leaving, so the box resizes to the incoming word
// immediately rather than sitting at a fixed max-word width. Each word
// also gets a one-shot light sweep (hero-word-shine, globals.css) that
// runs on mount, i.e. every time a new word cycles in.
function CyclingWord({ words, reducedMotion }: { words: string[]; reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), WORD_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reducedMotion, words.length]);

  const word = words[index % words.length] ?? "";

  if (reducedMotion) return <>{word}</>;

  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="hero-word-shine col-start-1 row-start-1 whitespace-nowrap"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Soft atmospheric wash (peach / lavender / sky) instead of the previous
// node-graph backdrop — background color only, no motion, no cursor
// interaction, per explicit feedback.
const ATMOSPHERE_BACKGROUND = [
  "radial-gradient(760px 420px at 22% -6%, color-mix(in srgb, var(--color-gradient-peach) 55%, transparent), transparent 60%)",
  "radial-gradient(620px 460px at 85% 8%, color-mix(in srgb, var(--color-gradient-lavender) 45%, transparent), transparent 62%)",
  "radial-gradient(900px 620px at 60% 115%, color-mix(in srgb, var(--color-gradient-sky) 55%, transparent), transparent 65%)",
  "var(--color-canvas)",
].join(", ");

export function Hero({ hero }: { hero: CmsHeroContent }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const agencyName = hero.agencyLabelCycle[0] ?? "Tamil Nadu e-Governance Agency";

  // Resolves the CMS headline template ("Powering Digital {word} in Tamil
  // Nadu") into three parts. The last static word before the placeholder
  // ("Digital") stays fixed; the placeholder itself cycles through
  // headlineCycleWords (Governance / Infrastructure / Services) — both
  // colored as one accent phrase, matching the reference site's scroller.
  const [beforeText, afterText = ""] = hero.headlineTemplate.split("{word}");
  const beforeWords = beforeText.trim().split(/\s+/).filter(Boolean);
  const leadingWords = beforeWords.slice(0, -1).join(" ");
  const lastStaticWord = beforeWords[beforeWords.length - 1] ?? "";
  const cycleWords = hero.headlineCycleWords.length > 0 ? hero.headlineCycleWords : ["Governance"];

  const scrollToNextSection = () => {
    const el = heroRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <section
      ref={heroRef as React.RefObject<HTMLElement>}
      className="relative flex min-h-0 flex-1 items-center overflow-hidden"
      id="main-content"
      style={{ background: ATMOSPHERE_BACKGROUND }}
    >
      <Container className="relative w-full py-10 md:py-14">
        <motion.div
          className="grid items-center gap-10 md:grid-cols-[1.35fr_1fr] md:gap-10"
          initial={reducedMotion ? "show" : "hidden"}
          animate="show"
          variants={stagger}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <motion.h1
              variants={riseIn}
              className="text-[30px] font-bold leading-[1.15] text-ink sm:text-[36px] md:whitespace-nowrap md:text-[34px] lg:text-[38px]"
            >
              {agencyName}
            </motion.h1>
            <motion.p
              variants={riseIn}
              className="text-[20px] font-semibold leading-[1.3] text-ink sm:text-[24px] md:whitespace-nowrap md:text-[22px] lg:text-[25px]"
            >
              {leadingWords ? `${leadingWords} ` : ""}
              {lastStaticWord ? `${lastStaticWord} ` : ""}
              <span style={{ color: "var(--color-primary-blue)" }}>
                <CyclingWord words={cycleWords} reducedMotion={reducedMotion} />
              </span>
              {afterText}
            </motion.p>
            <motion.p
              variants={riseIn}
              className="max-w-[42ch] text-[17px] leading-[1.5] text-[var(--color-body)] sm:text-[19px] md:text-[20px]"
            >
              {hero.tagline}
            </motion.p>
          </div>

          <motion.div
            variants={riseIn}
            className="relative mx-auto h-[336px] w-full max-w-[336px] sm:h-[400px] sm:max-w-[384px] md:h-[424px] md:max-w-[360px]"
          >
            <Image
              src={heroCollage}
              alt="Collage of Tamil Nadu citizens across different walks of life, over a map of the state"
              fill
              priority
              className="object-contain"
              sizes="(min-width: 768px) 360px, 336px"
            />
          </motion.div>
        </motion.div>

        <motion.button
          type="button"
          onClick={scrollToNextSection}
          initial={reducedMotion ? "show" : "hidden"}
          animate="show"
          variants={riseIn}
          aria-label="Scroll to next section"
          className="mx-auto mt-10 flex flex-col items-center gap-1.5 text-[var(--color-muted)] transition-colors hover:text-ink"
        >
          <span className="type-caption-uppercase">Scroll</span>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 motion-safe:animate-bounce" fill="none" aria-hidden>
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </Container>
    </section>
  );
}
