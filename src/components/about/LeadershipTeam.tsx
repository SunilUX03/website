"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { teamCeo, team } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { useInViewOnce, useIsDesktop, useReducedMotion } from "@/lib/hooks";

// Cap the grid to 2 rows below the CEO card at each breakpoint's own
// column count (4 cols desktop, 2 cols mobile) rather than a single fixed
// count, so neither layout ever spills into a 3rd, awkward partial row.
const MAX_ROWS = 2;
const DESKTOP_COLS = 4;
const MOBILE_COLS = 2;

function TeamCard({
  member,
  index,
  inView,
  reducedMotion,
}: {
  member: (typeof team)[number];
  index: number;
  inView: boolean;
  reducedMotion: boolean;
}) {
  const fromLeft = index % 2 === 0;
  const settled = { opacity: 1, x: 0, y: 0, rotate: 0 };
  const scattered = { opacity: 0, x: fromLeft ? -56 : 56, y: -36, rotate: fromLeft ? -6 : 6 };

  return (
    <motion.div
      initial={reducedMotion ? settled : scattered}
      animate={reducedMotion || inView ? settled : scattered}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
        delay: reducedMotion ? 0 : index * 0.07,
      }}
      className="card-feature flex h-full flex-col overflow-hidden !p-0"
    >
      <div className="relative aspect-[3/4] w-full">
        <Image src={member.photo} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
      </div>
      {/* Fixed height (not min-height) + a line-clamp safety net, so
          every card in the grid stays exactly the same size regardless
          of how many lines the designation wraps to at any breakpoint —
          longer designations ("Deputy Collector — Administration") wrap
          up to 3 lines here instead of growing the card taller than its
          siblings. */}
      <div className="flex h-28 items-center justify-center px-3 py-3 text-center">
        <p className="type-body-strong line-clamp-3 text-ink">{member.designation}</p>
      </div>
    </motion.div>
  );
}

export function LeadershipTeam() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.15 });
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const visibleTeam =
    isDesktop === true
      ? team.slice(0, DESKTOP_COLS * MAX_ROWS)
      : isDesktop === false
        ? team.slice(0, MOBILE_COLS * MAX_ROWS)
        : [];

  return (
    <section id="leadership" className="scroll-mt-24 bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Leadership &amp; Team</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">The people behind TNeGA</h2>

        <div className="mb-10 flex w-full justify-center">
          <div className="card-feature mx-auto flex w-full max-w-[280px] flex-col overflow-hidden !p-0">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={teamCeo.photo}
                alt={teamCeo.name}
                fill
                sizes="280px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-center px-6 py-5 text-center">
              {/* Fixed-height, centered name block (reserved for 2 lines)
                  so a long name like "Dr. Alby John Varghese, IAS" wraps
                  within the same footprint a short name would use. */}
              <div className="flex min-h-[54px] items-center justify-center">
                <p className="type-title-md text-ink">{teamCeo.name}</p>
              </div>
              <p className="type-body-sm mt-1 text-[var(--color-muted)]">{teamCeo.designation}</p>
            </div>
          </div>
        </div>

        <div ref={ref} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visibleTeam.map((member, i) => (
            <TeamCard
              key={member.designation}
              member={member}
              index={i}
              inView={inView}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
