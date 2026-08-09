"use client";

import { motion } from "framer-motion";
import type { CmsTeamMember } from "@/lib/cms/team-member-types";
import { Container } from "@/components/ui/Container";
import { AutoCarousel } from "@/components/ui/AutoCarousel";
import { useInViewOnce, useIsDesktop, useReducedMotion } from "@/lib/hooks";

type TeamMember = CmsTeamMember;

function TeamCard({
  member,
  index,
  inView,
  reducedMotion,
}: {
  member: TeamMember;
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
      className="card-feature team-card flex h-full min-w-0 flex-col items-center justify-center text-center"
    >
      {/* min-h (not a fixed h) so a 2-line name or designation never gets
          clipped or ellipsized — it just wraps, and every card still ends
          up the same height since they all share this same minimum. */}
      <div className="flex min-h-[80px] flex-col items-center justify-center">
        <p className="type-body-strong text-ink">{member.name}</p>
        <p className="type-caption mt-1 text-[var(--color-muted)]">{member.designation}</p>
        {member.subject ? (
          <p className="type-caption text-[var(--color-muted)]">{member.subject}</p>
        ) : null}
      </div>
    </motion.div>
  );
}

function DesktopGrid({
  members,
  inView,
  reducedMotion,
}: {
  members: TeamMember[];
  inView: boolean;
  reducedMotion: boolean;
}) {
  return (
    // flex-wrap + justify-center (not CSS grid) so a partial last row
    // centers itself instead of trailing left with empty trailing columns.
    <div className="flex flex-wrap justify-center gap-3">
      {members.map((member, i) => (
        <div key={member.id} className="w-[calc(50%-0.375rem)] sm:w-[calc(25%-0.5625rem)] lg:w-[calc(16.6667%-0.625rem)]">
          <TeamCard member={member} index={i} inView={inView} reducedMotion={reducedMotion} />
        </div>
      ))}
    </div>
  );
}

function MobileCarousel({
  members,
  inView,
  reducedMotion,
}: {
  members: TeamMember[];
  inView: boolean;
  reducedMotion: boolean;
}) {
  return (
    <AutoCarousel>
      {members.map((member, i) => (
        <div
          key={member.id}
          data-carousel-item
          className="w-3/4 max-w-[220px] shrink-0 snap-center sm:w-[200px]"
        >
          <TeamCard member={member} index={i} inView={inView} reducedMotion={reducedMotion} />
        </div>
      ))}
    </AutoCarousel>
  );
}

export function LeadershipTeam({ members }: { members: CmsTeamMember[] }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.15 });
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  return (
    <section id="leadership" className="scroll-mt-24 bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Leadership &amp; Team</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">The people behind TNeGA</h2>

        <div ref={ref}>
          {isDesktop === true && <DesktopGrid members={members} inView={inView} reducedMotion={reducedMotion} />}
          {isDesktop === false && <MobileCarousel members={members} inView={inView} reducedMotion={reducedMotion} />}
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
