"use client";

import Image from "next/image";
import { boardOfDirectors } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";

function BoardCard({ member }: { member: (typeof boardOfDirectors)[number] }) {
  return (
    <div className="card-feature board-card flex w-[calc(50%-8px)] flex-col items-center gap-3 !p-4 text-center lg:w-[calc(25%-12px)]">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg">
        <Image src={member.photo} alt="" fill sizes="80px" className="object-cover" />
      </div>
      <div>
        <p className="type-body-strong text-ink">{member.role}</p>
        <p className="type-caption mt-0.5 text-[var(--color-muted)]">{member.department}</p>
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
