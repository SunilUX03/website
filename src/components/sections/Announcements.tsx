import Link from "next/link";
import { announcements } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export function Announcements() {
  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Announcements</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">Latest from TNeGA</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {announcements.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex flex-col gap-1 rounded-xl border border-hairline bg-surface-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-hairline-strong hover:shadow-[0_12px_30px_rgba(12,10,9,0.10)]"
            >
              <span className="type-caption text-[var(--color-muted)]">{item.timestamp}</span>
              <span className="type-body-strong text-ink">{item.heading}</span>
              <span className="type-body-sm truncate text-[var(--color-body)]">
                {item.description}
              </span>
            </a>
          ))}
        </div>

        <Link
          href="/notifications/announcements"
          className="type-body-strong mt-8 inline-block text-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue-active)]"
        >
          View all announcements →
        </Link>
      </Container>
    </section>
  );
}
