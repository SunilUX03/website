"use client";

import { useEffect, useRef, useState } from "react";
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
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;

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
