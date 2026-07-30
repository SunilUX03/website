import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

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

export function ReachUs() {
  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ReachUsPanel
            eyebrow="Support"
            title="Reach Us"
            description="Raise a ticket with our support team through the official TNeGA ticketing portal — login required to track your request."
            ctaLabel="Raise a Ticket"
            href="/reach-us"
            icon={
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
                <path
                  d="M4 5h16v11H8l-4 4V5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <ReachUsPanel
            eyebrow="Careers"
            title="Current Openings"
            description="Join TNeGA and help build the digital infrastructure powering governance across Tamil Nadu."
            ctaLabel="View Openings"
            href="/about/careers"
            icon={
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
                <path
                  d="M4 8h16v11H4V8Zm4 0V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>
      </Container>
    </section>
  );
}
