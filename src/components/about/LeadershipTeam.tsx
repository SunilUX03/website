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
const DESKTOP_COLS = 6;
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
      className="card-feature team-card flex h-full min-w-0 flex-col overflow-hidden !p-0"
    >
      <div className="relative aspect-square w-full">
        <Image src={member.photo} alt="" fill sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover" />
      </div>
      {/* Name + designation, fixed-height block so every card matches
          regardless of how many lines the designation wraps to. */}
      <div className="flex h-[68px] flex-col items-center justify-center px-2 py-2 text-center">
        <p className="type-body-strong line-clamp-1 text-ink">{member.name}</p>
        <p className="type-caption line-clamp-2 text-[var(--color-muted)]">{member.designation}</p>
      </div>
    </motion.div>
  );
}

export function LeadershipTeam() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.15 });
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  // CEO leads the same grid as the rest of the team, at the same card
  // size — not a separate oversized hero card above it.
  const allMembers = [{ name: teamCeo.name, designation: teamCeo.designation, photo: teamCeo.photo }, ...team];
  const visibleTeam =
    isDesktop === true
      ? allMembers.slice(0, DESKTOP_COLS * MAX_ROWS)
      : isDesktop === false
        ? allMembers.slice(0, MOBILE_COLS * MAX_ROWS)
        : [];

  return (
    <section id="leadership" className="scroll-mt-24 bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Leadership &amp; Team</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">The people behind TNeGA</h2>

        <div
          ref={ref}
          className="grid grid-cols-2 gap-3 overflow-x-clip [grid-template-columns:repeat(2,minmax(0,1fr))] sm:[grid-template-columns:repeat(4,minmax(0,1fr))] lg:[grid-template-columns:repeat(6,minmax(0,1fr))]"
        >
          {visibleTeam.map((member, i) => (
            <TeamCard
              key={`${member.name}-${i}`}
              member={member}
              index={i}
              inView={inView}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </Container>

      <style>{`
        .team-card {
          transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
        }
        .team-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-primary-blue);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.10);
        }
        @media (prefers-reduced-motion: reduce) {
          .team-card { transition: none; }
          .team-card:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}
