"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { gallery } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { useReducedMotion } from "@/lib/hooks";

function GalleryPhoto({ item }: { item: (typeof gallery)[number] }) {
  return (
    <figure className="w-[62vw] max-w-[420px] shrink-0 md:w-[380px]">
      <PhotoTile
        src={item.image}
        alt={item.caption}
        aspect="aspect-[16/9]"
        className="rounded-xl"
        sizes="(min-width: 768px) 380px, 62vw"
      />
      <figcaption className="type-caption mt-3 text-center text-[var(--color-muted)]">
        {item.caption}
      </figcaption>
    </figure>
  );
}

const DRIFT_SPEED = 28; // px/sec
const NUDGE_PX = 400;
const HOVER_RESUME_MS = 500;
const DRAG_RESUME_MS = 1100;

/** Continuous ambient auto-drift filmstrip — same drift language on both
 * breakpoints. Hover (desktop) or drag (touch) pauses it; it resumes
 * shortly after. Prev/next arrows nudge it directly. Not pinned/scroll-
 * jacked, so the section's height is just its content height. */
function GalleryFilmstrip() {
  const loop = [...gallery, ...gallery];
  const trackRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopWidth = useRef(0);

  useLayoutEffect(() => {
    if (trackRef.current) loopWidth.current = trackRef.current.scrollWidth / 2;
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const step = (time: number) => {
      const dt = (time - last) / 1000;
      last = time;
      if (!paused.current && loopWidth.current > 0) {
        let next = x.get() - DRIFT_SPEED * dt;
        if (next <= -loopWidth.current) next += loopWidth.current;
        if (next > 0) next -= loopWidth.current;
        x.set(next);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleResume = (delay: number) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      paused.current = false;
    }, delay);
  };

  const nudge = (dir: 1 | -1) => {
    paused.current = true;
    let next = x.get() - dir * NUDGE_PX;
    if (loopWidth.current > 0) {
      if (next <= -loopWidth.current) next += loopWidth.current;
      if (next > 0) next -= loopWidth.current;
    }
    x.set(next);
    scheduleResume(HOVER_RESUME_MS);
  };

  return (
    <div
      className="group relative overflow-hidden"
      onMouseEnter={() => {
        if (resumeTimer.current) clearTimeout(resumeTimer.current);
        paused.current = true;
      }}
      onMouseLeave={() => scheduleResume(HOVER_RESUME_MS)}
    >
      <motion.div
        ref={trackRef}
        className="flex w-max gap-6"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -100000, right: 100000 }}
        dragElastic={0.08}
        dragMomentum={false}
        onDragStart={() => {
          if (resumeTimer.current) clearTimeout(resumeTimer.current);
          paused.current = true;
        }}
        onDragEnd={() => scheduleResume(DRAG_RESUME_MS)}
      >
        {loop.map((item, i) => (
          <GalleryPhoto key={`${item.caption}-${i}`} item={item} />
        ))}
      </motion.div>

      <button
        type="button"
        aria-label="Previous photos"
        onClick={() => nudge(-1)}
        className="absolute left-2 top-[38%] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline-strong bg-surface-card/90 text-ink opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-opacity duration-200 group-hover:opacity-100 md:opacity-100"
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Next photos"
        onClick={() => nudge(1)}
        className="absolute right-2 top-[38%] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline-strong bg-surface-card/90 text-ink opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-opacity duration-200 group-hover:opacity-100 md:opacity-100"
      >
        →
      </button>
    </div>
  );
}

function GalleryStaticStrip() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * NUDGE_PX, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={trackRef} className="flex gap-6 overflow-x-auto pb-2">
        {gallery.map((item) => (
          <GalleryPhoto key={item.caption} item={item} />
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous photos"
          onClick={() => scrollBy(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-strong text-ink hover:bg-surface-strong"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next photos"
          onClick={() => scrollBy(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-strong text-ink hover:bg-surface-strong"
        >
          →
        </button>
      </div>
    </div>
  );
}

export function Gallery() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Gallery</p>
            <h2 className="type-display-lg text-ink">Moments from the field</h2>
          </div>
          <a href="/gallery" className="type-button btn-outline shrink-0">
            View all
          </a>
        </div>

        {reducedMotion ? <GalleryStaticStrip /> : <GalleryFilmstrip />}
      </Container>
    </section>
  );
}
