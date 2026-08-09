import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { getAnnouncementBySlug, getAnnouncements } from "@/lib/cms/announcements";

/**
 * Individual announcement page.
 *
 * `dynamicParams` (default true) means a slug published after the last
 * build still resolves on demand rather than 404ing until the next
 * deploy — important now that announcements come from the CMS, not a
 * static import fixed at build time.
 *
 * Next 16 passes `params` as a Promise (synchronous access was removed
 * in this major), hence the await in both the page and generateMetadata.
 */

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const announcements = await getAnnouncements();
  return announcements.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);
  if (!announcement) return { title: "Announcement | TNeGA" };

  return {
    title: `${announcement.heading} | TNeGA`,
    description: announcement.description,
  };
}

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4 shrink-0 fill-none stroke-current stroke-[1.5] transition-transform group-hover:-translate-x-0.5"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="11 18 5 12 11 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4 shrink-0 fill-none stroke-current stroke-[1.5] transition-transform group-hover:translate-x-0.5"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

export default async function AnnouncementPage({ params }: Params) {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);
  if (!announcement) notFound();

  const allAnnouncements = await getAnnouncements();
  const related = allAnnouncements.filter((a) => a.slug !== announcement.slug).slice(0, 2);

  return (
    <>
      <TopNav />

      <main className="flex-1" id="main-content">
        <Breadcrumb
          items={[
            { label: "Notifications" },
            { label: "Announcements", href: "/notifications/announcements" },
            { label: announcement.heading },
          ]}
        />

        {/* Header */}
        <section className="relative overflow-hidden border-b border-hairline bg-canvas">
          <div
            aria-hidden
            className="orb-drift-a pointer-events-none absolute -left-24 -top-28 h-[380px] w-[380px] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--color-gradient-lavender) 0%, transparent 70%)",
              opacity: 0.5,
            }}
          />

          <Container className="relative py-xxl md:py-section">
            <Link
              href="/notifications/announcements"
              className="type-body-sm group mb-lg inline-flex items-center gap-xs text-[var(--color-primary-blue)] transition-colors hover:text-[var(--color-primary-blue-active)]"
            >
              <BackIcon />
              All announcements
            </Link>

            <div className="flex flex-wrap items-center gap-sm">
              {announcement.category ? (
                <span className="badge-pill type-caption-uppercase">
                  {announcement.category}
                </span>
              ) : null}
              <span className="type-caption-uppercase text-[var(--color-muted)]">
                {announcement.timestamp}
              </span>
            </div>

            <h1 className="type-display-lg mt-base max-w-[24ch] text-ink">
              {announcement.heading}
            </h1>

            <p className="type-body-md mt-lg max-w-[65ch] text-[var(--color-body)]">
              {announcement.description}
            </p>

            {/* Same optional-image contract as the card/list view — a
                text-only update (no photo) just skips this rather than
                leaving a gap. Was only ever shown on the card before this,
                so opening the full announcement lost the photo entirely. */}
            {announcement.image ? (
              <div className="relative mt-xl max-w-[720px] overflow-hidden rounded-xl border border-hairline">
                <PhotoTile
                  src={announcement.image}
                  alt=""
                  aspect="aspect-[16/9]"
                  sizes="(min-width: 1024px) 720px, 100vw"
                  priority
                />
              </div>
            ) : null}
          </Container>
        </section>

        {/* Body */}
        <section className="py-xxl md:py-section">
          <Container>
            <div className="grid gap-xxl lg:grid-cols-[minmax(0,1fr)_280px]">
              <article className="max-w-[68ch]">
                {announcement.body ? (
                  <div className="type-body-md flex flex-col gap-lg text-[var(--color-body)] [&_p]:mb-0">
                    <RichText data={announcement.body} />
                  </div>
                ) : (
                  <p className="type-body-md text-[var(--color-muted)]">
                    Full details for this announcement will be published here
                    shortly.
                  </p>
                )}
              </article>

              <aside className="flex flex-col gap-lg">
                {announcement.facts?.length ? (
                  <div className="rounded-xl border border-hairline bg-surface-card p-lg">
                    <p className="type-caption-uppercase mb-base text-[var(--color-muted)]">
                      At a glance
                    </p>
                    <dl className="flex flex-col gap-base">
                      {announcement.facts.map((fact) => (
                        <div key={fact.label}>
                          <dt className="type-caption text-[var(--color-muted)]">
                            {fact.label}
                          </dt>
                          <dd className="type-title-sm text-[var(--color-body-strong)]">
                            {fact.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : null}

                {announcement.links?.length ? (
                  <div className="rounded-xl border border-hairline bg-surface-card p-lg">
                    <p className="type-caption-uppercase mb-base text-[var(--color-muted)]">
                      Related
                    </p>
                    <ul role="list" className="flex flex-col gap-sm">
                      {announcement.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="type-body-sm group inline-flex items-center gap-xs text-[var(--color-primary-blue)] transition-colors hover:text-[var(--color-primary-blue-active)]"
                          >
                            {link.label}
                            <ArrowIcon />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </aside>
            </div>
          </Container>
        </section>

        {/* More announcements */}
        {related.length > 0 ? (
          <section className="bg-canvas-soft py-xxl md:py-section">
            <Container>
              <h2 className="type-display-sm mb-xl text-ink">
                More announcements
              </h2>

              <ul role="list" className="grid gap-lg md:grid-cols-2">
                {related.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex h-full flex-col gap-sm rounded-xl border border-hairline bg-surface-card p-lg transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                    >
                      <span className="type-caption-uppercase text-[var(--color-muted)]">
                        {item.timestamp}
                      </span>
                      <h3 className="type-title-sm text-[var(--color-body-strong)]">
                        {item.heading}
                      </h3>
                      <p className="type-body-sm text-[var(--color-body)]">
                        {item.description}
                      </p>
                      <span className="type-body-strong mt-auto inline-flex items-center gap-xs pt-xs text-[var(--color-primary-blue)] transition-colors group-hover:text-[var(--color-primary-blue-active)]">
                        Read more
                        <ArrowIcon />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}
      </main>

      <Footer />
      <ScrollToTop />
    </>
  );
}
