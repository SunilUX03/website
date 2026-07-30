"use client";

import { useEffect, useState } from "react";
import { easeOutCubic, formatIndianNumber } from "@/lib/format";
import { useReducedMotion } from "@/lib/hooks";

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  start: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}

/**
 * Animates 0 -> value with an eased-out curve once `start` becomes true.
 * Only the digits animate; prefix/suffix render statically throughout.
 *
 * No "has it already run" ref guard here on purpose — that pattern breaks
 * under React StrictMode's dev-mode double-effect-invocation (the first
 * invocation's cleanup cancels the timer, then the ref would block the
 * second invocation from ever restarting it, leaving the count frozen at
 * 0). Relying only on the effect's own cleanup to cancel a stale run is
 * the idiomatic, StrictMode-safe way to do this.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  start,
  duration = 1300,
  delay = 0,
  className,
}: CountUpProps) {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;

    if (reducedMotion) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let startTime = 0;
    const timeout = setTimeout(() => {
      const tick = (time: number) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setDisplay(Math.round(easeOutCubic(progress) * value));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [start, value, duration, delay, reducedMotion]);

  return (
    <span className={className}>
      {prefix}
      {formatIndianNumber(display)}
      {suffix}
    </span>
  );
}
