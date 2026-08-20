"use client";

import type { CmsBoardContent } from "@/lib/cms/board-content";
import { Container } from "@/components/ui/Container";
import { AutoCarousel } from "@/components/ui/AutoCarousel";

function SeatCard({
  role,
  name,
  title,
  emphasized,
}: {
  role: string;
  name: string;
  title: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`board-card card-feature relative flex h-full min-h-[150px] flex-col gap-2 overflow-hidden !p-5 text-left ${
        emphasized ? "border-[var(--color-primary-blue)]" : ""
      }`}
    >
      <p className="type-caption-uppercase text-[var(--color-primary-blue)]">{role}</p>
      <p className="type-body-strong text-ink">{name}</p>
      {title ? <p className="type-caption text-[var(--color-muted)]">{title}</p> : null}
    </div>
  );
}

export function BoardOfDirectors({ board }: { board: CmsBoardContent }) {
  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Governing Board</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">Governing TNeGA&apos;s mission</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SeatCard
            role={board.chairman.role}
            name={board.chairman.name}
            title={board.chairman.title}
            emphasized
          />
          <SeatCard
            role={board.memberSecretary.role}
            name={board.memberSecretary.name}
            title={board.memberSecretary.title}
            emphasized
          />
        </div>

        <p className="type-caption-uppercase mb-3 mt-8 text-[var(--color-muted)]">Members</p>
        <AutoCarousel>
          {board.members.map((member) => (
            <div
              key={member.title}
              data-carousel-item
              className="w-3/4 max-w-[300px] shrink-0 snap-center sm:w-[280px]"
            >
              <SeatCard role="Member" name={member.name} title={member.title} />
            </div>
          ))}
        </AutoCarousel>
      </Container>

      <style>{`
        .board-card {
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        }
        .board-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-primary-blue);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
        }
        @media (prefers-reduced-motion: reduce) {
          .board-card { transition: none; }
          .board-card:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}
