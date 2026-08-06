"use client";

import { RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Hero background — canvas colour throughout (the brand never introduces
 * a saturated colour wash, per the design system: soft gradient orbs are
 * the only "colour" moment, always at low alpha). Three very-slow-drifting
 * "sky" orbs in the brand's existing blue/lavender/mint pastels and a faint
 * film-grain for tactile depth — no pointer-reactivity anywhere, which was
 * exactly the "interaction" on the old background people didn't like.
 * Parallax-scrolls noticeably slower than the page via `heroRef`'s own
 * scroll progress, so it visibly lags "upward" relative to the content as
 * you scroll past.
 */
export function HeroBackdrop({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 170]);

  return (
    <motion.div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" style={{ y }} aria-hidden>
      <div
        className="orb-drift-c absolute -left-24 top-[2%] h-[420px] w-[480px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)" }}
      />
      <div
        className="orb-drift-a absolute -right-28 top-[14%] h-[360px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gradient-lavender) 0%, transparent 70%)" }}
      />
      <div
        className="orb-drift-b absolute bottom-[-8%] left-[28%] h-[320px] w-[380px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gradient-mint) 0%, transparent 70%)" }}
      />

      <div aria-hidden className="bg-grain absolute inset-0 opacity-[0.02]" />
    </motion.div>
  );
}
