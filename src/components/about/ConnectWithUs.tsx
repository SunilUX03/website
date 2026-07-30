import { connectWithUs } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";

export function ConnectWithUs() {
  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <div className="card-feature mx-auto flex w-full max-w-[576px] flex-col items-center gap-6 px-5 py-10 text-center sm:px-10">
          <h2 className="type-display-sm text-ink">Connect With Us</h2>

          <div>
            <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">Write to Us</p>
            <a
              href={`mailto:${connectWithUs.email}`}
              className="type-title-sm text-[var(--color-primary-blue)] hover:underline"
            >
              {connectWithUs.email}
            </a>
          </div>

          <div>
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Follow Us</p>
            <div className="flex flex-wrap justify-center gap-3">
              {connectWithUs.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge-pill type-body-sm transition-colors hover:bg-[rgba(29,63,143,0.1)]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <a href="/reach-us" className="type-button btn-primary mt-2">
            Reach us
          </a>
        </div>
      </Container>
    </section>
  );
}
