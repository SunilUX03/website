import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { ErrorIllustration, type ErrorVariant } from "./ErrorIllustration";

/** The page body shared by every public error page (404, 500, maintenance):
 * eyebrow, calm heading, reassurance, a short "why / what you can do" box,
 * then the actions, with the illustration alongside. Presentational only
 * (no hooks, no server imports) so it can be used from error.tsx, which
 * must be a Client Component, as well as from server pages. */
export function ErrorPageLayout({
  variant,
  eyebrow,
  heading,
  lead,
  boxTitle,
  boxItems,
  actions,
  after,
  graphicLabel,
}: {
  variant: ErrorVariant;
  eyebrow: string;
  heading: string;
  lead: string;
  boxTitle: string;
  boxItems: readonly string[];
  actions: ReactNode;
  after?: ReactNode;
  graphicLabel: string;
}) {
  return (
    <section className="relative overflow-hidden bg-canvas" id="main-content">
      <div
        aria-hidden
        className="orb-drift-a pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)", opacity: 0.5 }}
      />
      <div
        aria-hidden
        className="orb-drift-b pointer-events-none absolute -bottom-20 right-10 h-[360px] w-[360px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gradient-mint) 0%, transparent 70%)", opacity: 0.5 }}
      />

      <Container className="relative py-xxl md:py-section">
        <div className="grid items-center gap-xxl md:grid-cols-2">
          <div>
            <p className="type-caption-uppercase mb-md text-[var(--color-muted)]">{eyebrow}</p>
            <h1 className="type-display-xl mb-lg text-ink">{heading}</h1>
            <p className="type-body-md mb-xl max-w-[520px] text-[var(--color-body)]">{lead}</p>

            <div className="mb-xl max-w-[520px] rounded-xl border border-hairline bg-surface-card p-lg">
              <p className="type-caption-uppercase mb-sm text-[var(--color-muted)]">{boxTitle}</p>
              <ul role="list" className="flex flex-col gap-xs">
                {boxItems.map((item) => (
                  <li key={item} className="type-body-sm flex gap-sm text-[var(--color-body)]">
                    <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-blue)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-xl flex flex-wrap gap-3">{actions}</div>
            {after}
          </div>

          <div className="flex items-center justify-center">
            <ErrorIllustration variant={variant} label={graphicLabel} />
          </div>
        </div>
      </Container>
    </section>
  );
}
