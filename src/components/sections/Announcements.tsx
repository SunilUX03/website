import { announcements } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export function Announcements() {
  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Announcements</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">Latest from TNeGA</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10">
          {announcements.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="voice-row flex flex-col gap-1 py-4 transition-colors hover:bg-[var(--color-surface-strong)] md:px-2"
            >
              <span className="type-caption text-[var(--color-muted)]">{item.timestamp}</span>
              <span className="type-body-strong text-ink">{item.heading}</span>
              <span className="type-body-sm truncate text-[var(--color-body)]">
                {item.description}
              </span>
            </a>
          ))}
        </div>

        <a
          href="/notifications/announcements"
          className="type-body-strong mt-8 inline-block text-ink hover:text-[var(--color-primary-blue)]"
        >
          View all announcements →
        </a>
      </Container>
    </section>
  );
}
