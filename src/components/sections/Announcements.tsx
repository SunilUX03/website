"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue } from "framer-motion";
import { announcements } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/hooks";

type Announcement = (typeof announcements)[number];

function AnnouncementCard({ item }: { item: Announcement }) {
  return (
    <a
      href={item.href}
      className="group flex w-[300px] shrink-0 flex-col gap-1 rounded-xl border border-hairline bg-surface-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-hairline-strong hover:shadow-[0_12px_30px_rgba(12,10,9,0.10)] md:w-[340px]"
    >
      <span className="type-caption text-[var(--color-muted)]">{item.timestamp}</span>
      <span className="type-body-strong text-ink">{item.heading}</span>
      <span className="type-body-sm text-[var(--color-body)]">{item.description}</span>
    </a>
  );
}

const DRIFT_SPEED = 26; // px/sec
const NUDGE_PX = 360;
const HOVER_RESUME_MS = 500;
const DRAG_RESUME_MS = 1100;

/** Continuous ambient auto-drift filmstrip, same drift language as the
 * social channels row below it — hover/drag pauses, arrows nudge. */
function AnnouncementsFilmstrip() {
  const loop = [...announcements, ...announcements];
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
      className="group/strip relative overflow-hidden"
      onMouseEnter={() => {
        if (resumeTimer.current) clearTimeout(resumeTimer.current);
        paused.current = true;
      }}
      onMouseLeave={() => scheduleResume(HOVER_RESUME_MS)}
    >
      <motion.div
        ref={trackRef}
        className="flex w-max gap-5"
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
          <AnnouncementCard key={`${item.href}-${i}`} item={item} />
        ))}
      </motion.div>

      <button
        type="button"
        aria-label="Previous announcements"
        onClick={() => nudge(-1)}
        className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline-strong bg-surface-card/90 text-ink opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-opacity duration-200 group-hover/strip:opacity-100 md:opacity-100"
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Next announcements"
        onClick={() => nudge(1)}
        className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline-strong bg-surface-card/90 text-ink opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-opacity duration-200 group-hover/strip:opacity-100 md:opacity-100"
      >
        →
      </button>
    </div>
  );
}

function AnnouncementsStaticStrip() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * NUDGE_PX, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={trackRef} className="flex gap-5 overflow-x-auto pb-2">
        {announcements.map((item) => (
          <AnnouncementCard key={item.href} item={item} />
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous announcements"
          onClick={() => scrollBy(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-strong text-ink hover:bg-surface-strong"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next announcements"
          onClick={() => scrollBy(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-strong text-ink hover:bg-surface-strong"
        >
          →
        </button>
      </div>
    </div>
  );
}

export function Announcements() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Announcements</p>
            <h2 className="type-display-lg max-w-2xl text-ink">Latest from TNeGA</h2>
          </div>
          <Link href="/notifications/announcements" className="type-button btn-outline shrink-0">
            View all announcements
          </Link>
        </div>

        {reducedMotion ? <AnnouncementsStaticStrip /> : <AnnouncementsFilmstrip />}
      </Container>
    </section>
  );
}
