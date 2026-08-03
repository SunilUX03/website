"use client";

import { governingBoard } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";

function SeatCard({ role, title, emphasized }: { role: string; title: string; emphasized?: boolean }) {
  return (
    <div
      className={`card-feature board-card flex flex-col gap-2 !p-5 text-left ${
        emphasized ? "border-[var(--color-primary-blue)]" : ""
      }`}
    >
      <p className="type-caption-uppercase text-[var(--color-primary-blue)]">{role}</p>
      <p className="type-body-strong text-ink">{title}</p>
    </div>
  );
}

export function BoardOfDirectors() {
  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Governing Board</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">Governing TNeGA&apos;s mission</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SeatCard role={governingBoard.chairman.role} title={governingBoard.chairman.title} emphasized />
          <SeatCard
            role={governingBoard.memberSecretary.role}
            title={governingBoard.memberSecretary.title}
            emphasized
          />
        </div>

        <p className="type-caption-uppercase mb-3 mt-8 text-[var(--color-muted)]">Members</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {governingBoard.members.map((title) => (
            <SeatCard key={title} role="Member" title={title} />
          ))}
        </div>
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
