"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { teamCeo, team } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { useInViewOnce, useReducedMotion } from "@/lib/hooks";

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
      className="card-feature flex flex-col items-center gap-3 text-center"
    >
      <div className="voice-icon-circular relative h-20 w-20 overflow-hidden">
        <Image src={member.photo} alt="" fill sizes="80px" className="object-cover" />
      </div>
      <p className="type-body-strong text-ink">{member.designation}</p>
    </motion.div>
  );
}

export function LeadershipTeam() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.15 });
  const reducedMotion = useReducedMotion();

  return (
    <section id="leadership" className="scroll-mt-24 bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Leadership &amp; Team</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">The people behind TNeGA</h2>

        <div className="mb-8 flex justify-center">
          <div className="card-feature flex max-w-sm flex-col items-center gap-4 px-10 py-8 text-center">
            <div className="voice-icon-circular relative h-28 w-28 overflow-hidden">
              <Image
                src={teamCeo.photo}
                alt={teamCeo.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="type-title-md text-ink">{teamCeo.name}</p>
              <p className="type-body-sm mt-1 text-[var(--color-muted)]">{teamCeo.designation}</p>
            </div>
          </div>
        </div>

        <div ref={ref} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {team.map((member, i) => (
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
