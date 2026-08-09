import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import type { CmsReachUsPanel } from "@/lib/cms/site-copy";

function ReachUsPanel({
  eyebrow,
  title,
  description,
  ctaLabel,
  href,
  icon,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  ctaLabel: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <div className="card-feature flex flex-1 flex-col gap-4">
      <span className="voice-icon-circular flex h-12 w-12 items-center justify-center text-ink">
        {icon}
      </span>
      <div>
        <p className="type-caption-uppercase mb-1 text-[var(--color-muted)]">{eyebrow}</p>
        <h3 className="type-title-md text-ink">{title}</h3>
        <p className="type-body-sm mt-2 text-[var(--color-body)]">{description}</p>
      </div>
      <a href={href} className="type-button btn-primary mt-2 self-start">
        {ctaLabel}
      </a>
    </div>
  );
}

const PANEL_META = [
  {
    href: "/reach-us",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path d="M4 5h16v11H8l-4 4V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/about/careers",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M4 8h16v11H4V8Zm4 0V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function ReachUs({ panels }: { panels: CmsReachUsPanel[] }) {
  return (
    <section className="relative overflow-hidden bg-canvas">
      <div aria-hidden className="pointer-events-none absolute -left-16 top-1/2 -translate-y-1/2">
        <div
          className="orb-drift-a h-[300px] w-[300px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--color-gradient-lavender) 0%, transparent 70%)",
            opacity: 0.4,
          }}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2">
        <div
          className="orb-drift-b h-[280px] w-[280px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--color-gradient-peach) 0%, transparent 70%)",
            opacity: 0.4,
          }}
        />
      </div>
      <Container className="relative pb-xxl pt-lg md:pb-section md:pt-xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {panels.map((panel, i) => (
            <ReachUsPanel
              key={panel.title}
              eyebrow={panel.eyebrow}
              title={panel.title}
              description={panel.description}
              ctaLabel={panel.ctaLabel}
              href={PANEL_META[i].href}
              icon={PANEL_META[i].icon}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
