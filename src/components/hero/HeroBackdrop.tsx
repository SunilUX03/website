"use client";

import { RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { NodeGraphCanvas } from "./NodeGraphCanvas";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Hero background — canvas colour throughout (the brand never introduces
 * a saturated colour wash, per the design system: atmospheric orbs and
 * the ambient dot-network are the only "colour" moments, both at low
 * alpha). Two layers: the pointer-reactive dot/line network that was
 * already part of this site's visual language, plus a very soft
 * gradient-orb bloom for depth, matching every other section's
 * orb-drift-a/b treatment. Parallax-scrolls at a slower rate than the
 * page via `heroRef`'s own scroll progress.
 */
export function HeroBackdrop({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 90]);

  return (
    <motion.div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" style={{ y }} aria-hidden>
      <div
        className="orb-drift-a absolute -left-20 top-[4%] h-[380px] w-[440px] rounded-full opacity-45 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)" }}
      />
      <div
        className="orb-drift-b absolute -right-24 top-[22%] h-[320px] w-[380px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gradient-lavender) 0%, transparent 70%)" }}
      />

      <NodeGraphCanvas className="absolute inset-0 h-full w-full" />
    </motion.div>
  );
}
