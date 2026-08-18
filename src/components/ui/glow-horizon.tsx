"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 2;

export type GlowHorizonVariant = "top" | "bottom" | "left" | "right";

const VARIANTS: Record<
  GlowHorizonVariant,
  { axis: "x" | "y"; scaleAxis: "scaleX" | "scaleY"; enterPct: string; restPct: string }
> = {
  top: { axis: "y", scaleAxis: "scaleY", enterPct: "-100%", restPct: "-50%" },
  bottom: { axis: "y", scaleAxis: "scaleY", enterPct: "100%", restPct: "50%" },
  left: { axis: "x", scaleAxis: "scaleX", enterPct: "100%", restPct: "50%" },
  right: { axis: "x", scaleAxis: "scaleX", enterPct: "-100%", restPct: "-50%" },
};

/** One blurred disc in the stack, from back (warmest/softest) to front
 * (coolest/crispest) — see GlowHorizon for the actual dawn palette. */
const LAYERS: { color: string; size: string; blur: number; opacity: number; delay: number; initialOffset: string }[] = [
  { color: "var(--color-gradient-peach)", size: "122%", blur: 58, opacity: 0.32, delay: 0, initialOffset: "10%" },
  { color: "var(--color-gradient-lavender)", size: "126%", blur: 38, opacity: 0.3, delay: 0.22, initialOffset: "10%" },
  { color: "var(--color-gradient-sky)", size: "118%", blur: 22, opacity: 0.3, delay: 0.44, initialOffset: "10%" },
];

export interface GlowHorizonProps {
  className?: string;
  variant?: GlowHorizonVariant;
  /** Skips the entrance animation and renders already-settled. */
  reducedMotion?: boolean;
}

/**
 * A soft, layered glow that slides in from one edge and settles — adapted
 * from a 21st.dev find (original: white/violet/indigo/black arcs glowing
 * against a near-black canvas). Recolored for this site's light canvas and
 * "no saturated colour wash, always low alpha" rule: three brand pastels
 * (peach → lavender → sky, a dawn progression) instead of the original's
 * neon violet-on-black, no box-shadow "glow" ring (that trick only reads
 * against a dark backdrop — here it would just look like a smudge), same
 * staggered slide/scale/blur-in choreography otherwise.
 */
export function GlowHorizon({ className, variant = "top", reducedMotion = false }: GlowHorizonProps) {
  const { axis, scaleAxis, enterPct, restPct } = VARIANTS[variant];

  return (
    <motion.div
      className={"absolute h-full w-full " + (className ?? "")}
      style={{ isolation: "isolate" }}
      initial={reducedMotion ? false : { [axis]: enterPct, [scaleAxis]: 1.5, opacity: 0, filter: "blur(15px)" }}
      animate={{ [axis]: restPct, [scaleAxis]: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: reducedMotion ? 0 : DURATION, ease: EASE }}
    >
      {LAYERS.map((layer) => (
        <GlowArc key={layer.color} variant={variant} reducedMotion={reducedMotion} {...layer} />
      ))}
    </motion.div>
  );
}

function GlowArc({
  variant,
  color,
  size,
  initialOffset,
  blur,
  opacity,
  delay,
  reducedMotion,
}: {
  variant: GlowHorizonVariant;
  color: string;
  size: string;
  initialOffset: string;
  blur: number;
  opacity: number;
  delay: number;
  reducedMotion: boolean;
}) {
  const scale = Number.parseFloat(size) / 100;
  const { axis, enterPct } = VARIANTS[variant];
  const sign = enterPct.startsWith("-") ? -1 : 1;
  const startPct = `${sign * Math.abs(Number.parseFloat(initialOffset) - 50)}%`;

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 rounded-full"
      style={{ scale, background: color, opacity, filter: `blur(${blur}px)` }}
      initial={reducedMotion ? false : { [axis]: startPct }}
      animate={{ [axis]: 0 }}
      transition={{ duration: reducedMotion ? 0 : DURATION, ease: EASE, delay: reducedMotion ? 0 : delay }}
    />
  );
}

export default GlowHorizon;
