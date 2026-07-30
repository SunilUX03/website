"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { boardOfDirectors } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";

function BoardCard({ member }: { member: (typeof boardOfDirectors)[number] }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="board-flip-card w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
      role="button"
      tabIndex={0}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((v) => !v);
        }
      }}
    >
      <div className={clsx("board-flip-inner", flipped && "is-flipped")}>
        <div className="board-flip-face card-feature flex flex-col items-center justify-center gap-3 !p-4 text-center">
          <div className="voice-icon-circular relative h-20 w-20 overflow-hidden">
            <Image src={member.photo} alt="" fill sizes="80px" className="object-cover" />
          </div>
          <div>
            <p className="type-body-strong text-ink">{member.role}</p>
            <p className="type-caption mt-0.5 text-[var(--color-muted)]">{member.department}</p>
          </div>
        </div>
        <div className="board-flip-face board-flip-back card-feature flex flex-col items-center justify-center !p-5 text-center">
          <p className="type-body-sm text-[var(--color-body)]">{member.bio}</p>
        </div>
      </div>
    </div>
  );
}

export function BoardOfDirectors() {
  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Board of Directors</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">Governing TNeGA&apos;s mission</h2>

        {/* flex-wrap + justify-center (not a grid) so an incomplete final
            row — whenever the member count isn't a clean multiple of the
            column count — centers instead of left-aligning with trailing
            empty cells. */}
        <div className="flex flex-wrap justify-center gap-4">
          {boardOfDirectors.map((member) => (
            <BoardCard key={member.key} member={member} />
          ))}
        </div>
      </Container>

      <style>{`
        .board-flip-card {
          perspective: 1200px;
          cursor: pointer;
          outline: none;
        }
        .board-flip-inner {
          position: relative;
          height: 220px;
          transition: transform 500ms;
          transform-style: preserve-3d;
        }
        .board-flip-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .board-flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
        }
        .board-flip-back {
          transform: rotateY(180deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .board-flip-inner { transition: none; }
        }
      `}</style>
    </section>
  );
}
