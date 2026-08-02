"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks an element's live rendered height via ResizeObserver, so a
 * dependent layout (e.g. a sticky bar's `top` offset) never drifts out of
 * sync with something like the main nav's own scroll-triggered height
 * transition (96px unscrolled -> 80px scrolled) — a fixed pixel guess can
 * only ever be correct for one of those two states.
 */
export function useElementHeight<T extends HTMLElement>(initial = 0) {
  const ref = useRef<T | null>(null);
  const [height, setHeight] = useState(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setHeight(entries[0].contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, height] as const;
}
