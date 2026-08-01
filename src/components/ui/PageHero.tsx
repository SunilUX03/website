import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/**
 * Shared hero for the Notifications + Careers pages, replacing the
 * per-page `.hero` block that was duplicated across the seven source
 * prototypes. The two blurred gradient orbs are driven by props so each
 * page keeps its own colour pairing (mint/peach, sky/rose, …) exactly as
 * the prototypes had them, while the layout and type scale stay shared.
 *
 * Orb colours reference the --color-gradient-* tokens already defined in
 * globals.css, so they stay in sync with Home/About/Services.
 */

export type OrbColor = "mint" | "peach" | "lavender" | "sky" | "rose";

type OrbPlacement = {
  color: OrbColor;
  /** Tailwind position + size utilities for this orb. */
  className: string;
};

export function PageHero({
  eyebrow,
  heading,
  body,
  cta,
  graphic,
  orbs,
  id = "main-content",
}: {
  eyebrow: string;
  heading: string;
  body: string;
  cta?: { label: string; href: string };
  graphic?: ReactNode;
  orbs: readonly [OrbPlacement, OrbPlacement];
  id?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-canvas" id={id}>
      {orbs.map((orb, i) => (
        <div
          key={orb.color + i}
          aria-hidden
          className={`${i === 0 ? "orb-drift-a" : "orb-drift-b"} pointer-events-none absolute rounded-full blur-3xl ${orb.className}`}
          style={{
            background: `radial-gradient(circle, var(--color-gradient-${orb.color}) 0%, transparent 70%)`,
            opacity: 0.5,
          }}
        />
      ))}

      <Container className="relative py-xxl md:py-section">
        <div className="grid items-center gap-xxl md:grid-cols-2">
          <div>
            <p className="type-caption-uppercase mb-md text-[var(--color-muted)]">
              {eyebrow}
            </p>
            <h1 className="type-display-xl mb-lg text-ink">{heading}</h1>
            <p className="type-body-md max-w-[480px] text-[var(--color-body)]">
              {body}
            </p>
            {cta ? (
              <div className="mt-xl">
                <a href={cta.href} className="type-button btn-primary">
                  {cta.label}
                </a>
              </div>
            ) : null}
          </div>

          {graphic ? (
            <div className="hidden items-center justify-center md:flex" aria-hidden>
              {graphic}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
