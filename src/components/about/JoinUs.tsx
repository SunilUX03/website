import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { JoinUsGraphic } from "@/components/heroes/JoinUsGraphic";
import type { CmsCareersContent } from "@/lib/cms/careers-content";
import type { CmsJobOpening } from "@/lib/cms/job-openings";

// Reuses the real Careers page data (the "careers-content" CMS global +
// the CMS openings) rather than duplicating it — this is a teaser,
// /about/careers stays the source of truth for the full list and the
// application flow.
export function JoinUs({ hero, openings }: { hero: CmsCareersContent["hero"]; openings: CmsJobOpening[] }) {
  const featured = openings.slice(0, 3);

  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">{hero.eyebrow}</p>
            <h2 className="type-display-lg mb-4 text-ink">{hero.heading}</h2>
            <p className="type-body-md mb-6 max-w-[48ch] text-[var(--color-body)]">{hero.body}</p>
            <Link href="/about/careers" className="type-button btn-primary">
              View Openings
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {featured.length === 0 && (
              <div className="flex justify-center">
                <JoinUsGraphic />
              </div>
            )}
            {featured.map((job) => (
              <div key={job.id} className="card-feature flex items-center justify-between gap-4">
                <div>
                  <p className="type-body-strong text-ink">{job.role}</p>
                  <p className="type-caption text-[var(--color-muted)]">
                    {job.department} · {job.type}
                  </p>
                </div>
                <Link
                  href="/about/careers"
                  className="type-button btn-outline shrink-0 !h-9 !px-4"
                >
                  Apply
                </Link>
              </div>
            ))}
            {openings.length > featured.length && (
              <Link
                href="/about/careers"
                className="type-body-sm text-center text-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue-active)]"
              >
                +{openings.length - featured.length} more open roles
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
