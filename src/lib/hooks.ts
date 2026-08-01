"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Tracks the user's prefers-reduced-motion setting reactively. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Reports whether the viewport is at/above `breakpoint`, via matchMedia
 * (not CSS visibility). Returns null until mounted — callers should render
 * nothing (or a single skeleton) for that first tick so a desktop/mobile
 * variant pair is never both present in the DOM at once, even briefly.
 */
export function useIsDesktop(breakpoint = 768): boolean | null {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isDesktop;
}

/** Fires `onEnter` once, the first time the element scrolls into view. */
export function useInViewOnce<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.3 }
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}

/**
 * Gently auto-scrolls a horizontal, snap-scrolling carousel.
 *
 * Attach the returned ref to the scroll container. The carousel advances
 * one "page" (viewport width) at a steady interval, loops back to the
 * start after the last item, and pauses whenever the user is interacting
 * — pointer over it, touching it, or focus inside it — resuming a moment
 * after they stop. Fully disabled under prefers-reduced-motion and when
 * the content doesn't overflow (nothing to scroll).
 *
 * Only runs on viewports below `maxWidth` (default 768px) so it stays a
 * mobile-only behaviour; on desktop the carousels are static grids.
 */
export function useAutoScroll<T extends HTMLElement>({
  intervalMs = 3500,
  resumeDelayMs = 4000,
  maxWidth = 768,
}: {
  intervalMs?: number;
  resumeDelayMs?: number;
  maxWidth?: number;
} = {}) {
  // Callback ref stored in state so the effect below re-runs when the
  // element actually attaches. A plain useRef doesn't trigger re-runs, so
  // carousels that mount later (e.g. behind an isDesktop gate that's null
  // on first render) would never get their auto-scroll started.
  const [el, setEl] = useState<T | null>(null);
  const ref = useCallback((node: T | null) => setEl(node), []);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!el || reducedMotion) return;
    if (window.matchMedia(`(min-width: ${maxWidth}px)`).matches) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    let paused = false;

    const atEnd = () => el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;

    const advance = () => {
      if (paused || !el) return;
      // Nothing to scroll — don't fight a non-overflowing container.
      if (el.scrollWidth <= el.clientWidth + 4) return;
      if (atEnd()) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
      }
    };

    const start = () => {
      if (timer) return;
      timer = setInterval(advance, intervalMs);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const pause = () => {
      paused = true;
      if (resumeTimer) clearTimeout(resumeTimer);
    };
    const scheduleResume = () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
      }, resumeDelayMs);
    };

    // Any manual interaction pauses, then resumes after a beat.
    const onPointerDown = () => pause();
    const onPointerUp = () => scheduleResume();
    const onPointerEnter = () => pause();
    const onPointerLeave = () => scheduleResume();
    const onFocusIn = () => pause();
    const onFocusOut = () => scheduleResume();
    // Pause the automatic tick briefly whenever the user scrolls by hand,
    // so it doesn't yank the carousel mid-swipe.
    let userScrollTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      pause();
      if (userScrollTimer) clearTimeout(userScrollTimer);
      userScrollTimer = setTimeout(() => scheduleResume(), 200);
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointerenter", onPointerEnter);
    el.addEventListener("pointerleave", onPointerLeave);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    el.addEventListener("touchstart", onPointerDown, { passive: true });
    el.addEventListener("touchend", onPointerUp, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });

    start();

    return () => {
      stop();
      if (resumeTimer) clearTimeout(resumeTimer);
      if (userScrollTimer) clearTimeout(userScrollTimer);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      el.removeEventListener("touchstart", onPointerDown);
      el.removeEventListener("touchend", onPointerUp);
      el.removeEventListener("scroll", onScroll);
    };
  }, [el, reducedMotion, intervalMs, resumeDelayMs, maxWidth]);

  return ref;
}
