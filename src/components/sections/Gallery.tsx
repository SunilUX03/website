"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { gallery } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { useReducedMotion } from "@/lib/hooks";

function GalleryPhoto({ item, className }: { item: (typeof gallery)[number]; className?: string }) {
  return (
    <figure className={`w-[70vw] max-w-[560px] shrink-0 md:w-[420px] ${className ?? ""}`}>
      <ImagePlaceholder label={item.caption} gradient={item.gradient} aspect="aspect-[16/9]" className="rounded-xl" />
      <figcaption className="type-caption mt-3 text-center text-[var(--color-muted)]">
        {item.caption}
      </figcaption>
    </figure>
  );
}

function GalleryScrollJacked() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [maxScroll, setMaxScroll] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);

  useLayoutEffect(() => {
    const measure = () => {
      if (trackRef.current && viewportRef.current) {
        setMaxScroll(
          Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth)
        );
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div ref={sectionRef} className="relative hidden md:block" style={{ height: "380vh" }}>
      <div ref={viewportRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="flex h-full flex-col justify-center">
          <motion.div ref={trackRef} className="flex gap-8 px-10" style={{ x }}>
            {gallery.map((item) => (
              <GalleryPhoto key={item.caption} item={item} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function GalleryStaticStrip() {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4 md:gap-8">
      {gallery.map((item) => (
        <GalleryPhoto key={item.caption} item={item} className="w-[62vw] md:w-[420px]" />
      ))}
    </div>
  );
}

const DRIFT_SPEED = 24; // px/sec

function GalleryMobileFilmstrip() {
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
        x.set(next);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragStart = () => {
    paused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };
  const onDragEnd = () => {
    resumeTimer.current = setTimeout(() => {
      paused.current = false;
    }, 1100);
  };

  return (
    <div className="overflow-hidden md:hidden">
      <motion.div
        ref={trackRef}
        className="flex w-max gap-6"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -100000, right: 100000 }}
        dragElastic={0.08}
        dragMomentum={false}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {loop.map((item, i) => (
          <GalleryPhoto key={`${item.caption}-${i}`} item={item} className="w-[62vw]" />
        ))}
      </motion.div>
    </div>
  );
}

export function Gallery() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="overflow-hidden bg-canvas-soft">
      <Container className="pt-xxl md:pt-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Gallery</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">Moments from the field</h2>
      </Container>

      {reducedMotion ? (
        <Container className="pb-xxl md:pb-section">
          <GalleryStaticStrip />
        </Container>
      ) : (
        <>
          <GalleryScrollJacked />
          <div className="pb-xxl md:pb-section" />
        </>
      )}

      <Container className={reducedMotion ? "hidden" : "pb-xxl md:hidden"}>
        <GalleryMobileFilmstrip />
      </Container>
    </section>
  );
}
