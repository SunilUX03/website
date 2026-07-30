"use client";

import { useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { rollOfHonour } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/hooks";

const VISIBLE_COUNT = 5;

function TimelineEntry({
  entry,
  index,
  reducedMotion,
}: {
  entry: (typeof rollOfHonour)[number];
  index: number;
  reducedMotion: boolean;
}) {
  const isRight = index % 2 === 1;
  const initial = reducedMotion ? undefined : { opacity: 0, x: isRight ? 40 : -40 };

  return (
    <div
      className={clsx(
        "relative pl-10 md:w-1/2 md:pl-0",
        isRight ? "md:ml-auto md:pl-10" : "md:mr-auto md:pr-10"
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "absolute top-5 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[var(--color-primary-blue)] ring-4 ring-canvas",
          "left-[11px] md:left-auto",
          isRight ? "md:-left-[5px]" : "md:-right-[5px]"
        )}
      />
      <motion.div
        initial={initial}
        whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-xl border border-hairline bg-surface-card px-5 py-4"
      >
        <p className="type-body-strong text-ink">{entry.name ?? entry.designation}</p>
        {entry.name && (
          <p className="type-caption text-[var(--color-muted)]">{entry.designation}</p>
        )}
        <p className="type-caption-uppercase mt-1 text-[var(--color-primary-blue)]">
          {entry.range}
        </p>
      </motion.div>
    </div>
  );
}

export function RollOfHonour() {
  const [expanded, setExpanded] = useState(false);
  const reducedMotion = useReducedMotion();
  const visible = rollOfHonour.slice(0, VISIBLE_COUNT);
  const rest = rollOfHonour.slice(VISIBLE_COUNT);

  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Roll of Honour</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">Leading TNeGA since 2006</h2>

        <div className="relative">
          <div
            aria-hidden
            className="absolute bottom-0 left-4 top-0 w-px bg-hairline-strong md:left-1/2"
          />
          <div className="flex flex-col gap-6">
            {visible.map((entry, i) => (
              <TimelineEntry key={entry.range} entry={entry} index={i} reducedMotion={reducedMotion} />
            ))}
          </div>

          <div
            className="grid transition-all duration-500 ease-out"
            style={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-6 pt-6">
                {rest.map((entry, i) => (
                  <TimelineEntry
                    key={entry.range}
                    entry={entry}
                    index={VISIBLE_COUNT + i}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button type="button" onClick={() => setExpanded((v) => !v)} className="type-button btn-outline">
            {expanded ? "Show fewer" : "View full history"}
          </button>
        </div>
      </Container>
    </section>
  );
}
