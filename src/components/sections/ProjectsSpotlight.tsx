"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { CmsProjectSpotlight } from "@/lib/cms/projects-spotlight-types";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { CountUp } from "@/components/ui/CountUp";
import { useReducedMotion, useIsDesktop } from "@/lib/hooks";

type Project = CmsProjectSpotlight;

function SpotlightContent({ project, active }: { project: Project; active: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
      {/* One long, gradual scrim that dissolves into the photo — no boxed
          panel, no backdrop-blur rectangle, no hard edge anywhere. Stops
          tuned so it reaches further up than the text block ever does. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 25%, rgba(0,0,0,0.28) 50%, rgba(0,0,0,0.08) 72%, transparent 88%)",
        }}
      />

      <div className="relative max-w-2xl text-white">
        {"badge" in project && project.badge && (
          <span className="badge-pill mb-3 bg-white/15 text-white backdrop-blur-sm">
            {project.badge}
          </span>
        )}
        <h3 className="type-display-sm mb-2 [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]">
          {project.name}
        </h3>
        <p className="type-body-md mb-5 text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
          {project.description}
        </p>

        <div className="mb-6 flex flex-wrap gap-x-8 gap-y-3">
          {project.stats.map((stat) => (
            <div key={stat.label}>
              <p className="type-display-sm [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
                <CountUp value={stat.value} suffix={stat.suffix} start={active} duration={1100} />
              </p>
              <p className="type-caption-uppercase text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.ctas.map((cta, i) => (
            <a
              key={cta.label}
              href={cta.href}
              className={i === 0 ? "type-button btn-primary" : "type-button btn-outline !border-white/60 !text-white hover:!bg-white/10"}
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

const SLIDE_DURATION_MS = 2500;

function DesktopSpotlight({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const reducedMotion = useReducedMotion();

  const go = (dir: 1 | -1) => {
    setActive((prev) => (prev + dir + projects.length) % projects.length);
  };

  // Runs continuously the whole time this section is on screen; pauses
  // only while the cursor is directly over the slide (not on scroll
  // position — this section doesn't need to be "arrived at" to advance).
  useEffect(() => {
    if (reducedMotion || hovering) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % projects.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [reducedMotion, hovering]);

  return (
    <div
      className="relative h-[640px] w-full overflow-hidden rounded-xl"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={{ opacity: reducedMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.6, ease: "easeInOut" }}
        >
          <PhotoTile
            src={projects[active].image}
            alt={projects[active].name}
            aspect="aspect-auto"
            className="h-full w-full"
            sizes="100vw"
            priority
          />
          <SpotlightContent project={projects[active]} active={true} />
        </motion.div>
      </AnimatePresence>

      {/* dash-dot indicator — bottom-left corner */}
      <div className="absolute bottom-6 left-6 z-10 flex gap-1.5">
        {projects.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to ${p.name}`}
            aria-current={i === active}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-white" : "w-2 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* prev/next — bottom-right corner */}
      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          →
        </button>
      </div>
    </div>
  );
}

const STORY_DURATION = 4000;

function MobileSpotlight({ projects }: { projects: Project[] }) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (reducedMotion || interactionPaused) return;
    startRef.current = performance.now();
    setProgress(0);

    const tick = (time: number) => {
      const elapsed = time - startRef.current;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setActive((a) => (a + 1) % projects.length);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, interactionPaused, reducedMotion]);

  const pauseAutoAdvance = () => setInteractionPaused(true);

  const goTo = (index: number) => {
    pauseAutoAdvance();
    setActive((index + projects.length) % projects.length);
    setProgress(0);
  };

  const project = projects[active];

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-surface-card">
      {/* Image sits in its own uncropped band (aspect-video is close to
          every project photo's real ~16:10 shape) with copy in a plain
          panel below it, rather than white text scrimmed over the photo —
          these photos are dense branded graphics with their own baked-in
          headline/footer text, not plain candid shots, so a bottom-gradient
          overlay doubled up two layers of text on top of each other and a
          taller 3:4 crop cut off their edges. Full image, separate legible
          panel; no cropping, no competing text. */}
      <div className="relative aspect-video w-full overflow-hidden">
        <div className="absolute inset-x-3 top-3 z-10 flex gap-1">
          {projects.map((p, i) => (
            <div key={p.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/40">
              <div
                className="h-full bg-white"
                style={{
                  width: `${i < active || reducedMotion ? 100 : i === active ? progress : 0}%`,
                  transition: reducedMotion ? "none" : undefined,
                }}
              />
            </div>
          ))}
        </div>

        <PhotoTile src={project.image} alt={project.name} aspect="aspect-auto" className="h-full w-full" sizes="100vw" priority />

        {/* tap zones */}
        <button
          type="button"
          aria-label="Previous project"
          className="absolute inset-y-0 left-0 z-10 w-1/2"
          onClick={() => goTo(active - 1)}
        />
        <button
          type="button"
          aria-label="Next project"
          className="absolute inset-y-0 right-0 z-10 w-1/2"
          onClick={() => goTo(active + 1)}
        />

        <div
          className="absolute inset-0 z-0"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 40) {
              goTo(active + (dx < 0 ? 1 : -1));
            }
            touchStartX.current = null;
          }}
        />
      </div>

      <div className="p-5">
        {"badge" in project && project.badge && (
          <span className="badge-pill mb-3">{project.badge}</span>
        )}
        <h3 className="type-title-md mb-2 text-ink">{project.name}</h3>
        <p className="type-body-sm mb-4 text-[var(--color-body)]">{project.description}</p>

        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
          {project.stats.map((stat) => (
            <div key={stat.label}>
              <p className="type-display-sm text-ink">
                <CountUp value={stat.value} suffix={stat.suffix} start={true} duration={1100} />
              </p>
              <p className="type-caption-uppercase text-[var(--color-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.ctas.map((cta, i) => (
            <a key={cta.label} href={cta.href} className={i === 0 ? "type-button btn-primary" : "type-button btn-outline"}>
              {cta.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSpotlight({ projects }: { projects: Project[] }) {
  const isDesktop = useIsDesktop();

  // DesktopSpotlight/MobileSpotlight both index into projects[active] and
  // take `% projects.length` unconditionally — safe for any count above
  // zero (this section is already written to handle 2, 3, 4+ items via
  // .length everywhere), but zero itself (e.g. every spotlighted project's
  // linked service got deleted from the CMS) would divide by zero / index
  // undefined and crash the whole homepage, same failure mode as the
  // pillar-card item lookup. Just hide the section in that case.
  if (projects.length === 0) return null;

  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
              Projects Spotlight
            </p>
            <h2 className="type-display-lg max-w-2xl text-ink">
              A few projects worth viewing
            </h2>
          </div>
          {/* Two separate links, not one class swapped by breakpoint: the
              pill-button treatment (type-button/btn-outline) is a custom
              class, not a Tailwind utility, so `md:btn-outline` wouldn't
              reliably toggle it. Mobile gets a plain right-aligned text
              link — matching the Scroller ticker's "View all →" — since
              the full button was wide enough to wrap below the heading. */}
          <Link href="/initiatives-projects" className="type-button btn-outline hidden shrink-0 md:inline-flex">
            View all Initiatives &amp; Projects
          </Link>
          <Link
            href="/initiatives-projects"
            className="type-caption shrink-0 whitespace-nowrap font-semibold text-[var(--color-primary-blue)] hover:underline md:hidden"
          >
            View all Initiatives &amp; Projects
            <span aria-hidden>{" →"}</span>
          </Link>
        </div>

        {isDesktop === true && <DesktopSpotlight projects={projects} />}
        {isDesktop === false && <MobileSpotlight projects={projects} />}
      </Container>
    </section>
  );
}
