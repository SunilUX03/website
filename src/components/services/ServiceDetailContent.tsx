import Link from "next/link";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { Container } from "@/components/ui/Container";
import { FaqAccordion } from "./FaqAccordion";
import { ScreenshotCarousel } from "./ScreenshotCarousel";
import {
  allServiceItems,
  ServiceItemDetail,
  statsToBullets,
} from "@/lib/services-content";
import {
  generateAboutSecondParagraph,
  generatePullQuote,
  generateFeatures,
  generateEligibility,
  generateHowToAccessSteps,
  generateFaqs,
  generateScreenshotImages,
} from "@/lib/service-detail-generator";
import { footer } from "@/lib/content";

const SECTION_LABEL: Record<ServiceItemDetail["section"], string> = {
  "citizen-services": "Citizen Services",
  "govt-digital-services": "Govt Digital Services",
};

function FeatureIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3.5 14.5 9l6 .9-4.3 4.2 1 6-5.2-2.8-5.2 2.8 1-6-4.3-4.2 6-.9z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6 2h9l5 5v15H6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 2v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ServiceDetailContent({ item }: { item: ServiceItemDetail }) {
  const bullets = statsToBullets(item.stats);
  const isProject = item.type === "project";
  const secondParagraph = generateAboutSecondParagraph(item);
  const pullQuote = generatePullQuote(item);
  const features = generateFeatures(item);
  const eligibility = generateEligibility(item);
  const steps = generateHowToAccessSteps(item);
  const faqs = generateFaqs(item);
  const screenshotImages = generateScreenshotImages(item);
  const related = allServiceItems.filter((sibling) => sibling.section === item.section && sibling.slug !== item.slug).slice(0, 4);

  return (
    <>
      {/* ---------- Breadcrumb ---------- */}
      <div className="bg-canvas">
        <Container className="py-md">
          <nav className="type-body-sm flex items-center gap-1.5 text-[var(--color-muted)]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href={`/services#${item.section}`} className="hover:text-ink">
              {SECTION_LABEL[item.section]}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink">{item.name}</span>
          </nav>
        </Container>
      </div>

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-canvas" id="main-content">
        <div
          aria-hidden
          className="orb-drift-a pointer-events-none absolute -left-32 -top-20 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)",
            opacity: 0.4,
          }}
        />

        <Container className="relative py-xl md:py-xxl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="badge-pill type-caption">{SECTION_LABEL[item.section]}</span>
            <span className="badge-pill type-caption">{isProject ? "Project" : "Service"}</span>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[55%_45%] lg:gap-12">
            <div>
              <h1 className="type-display-xl mb-4 text-ink">{item.name}</h1>
              <p className="type-body-md mb-6 max-w-[56ch] text-[var(--color-body)]">{item.description}</p>

              {bullets.length > 0 && (
                <div className="mb-6 flex divide-x divide-hairline border-y border-hairline">
                  {bullets.map((stat) => (
                    <div key={stat} className="flex flex-1 flex-col gap-1 px-4 py-5 first:pl-0">
                      <p className="type-title-sm text-[var(--color-primary-blue)]">{stat.split(" ")[0]}</p>
                      <p className="type-caption text-[var(--color-muted)]">
                        {stat.split(" ").slice(1).join(" ")}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {isProject ? (
                  <a href={item.accessPortalHref} className="type-button btn-primary">
                    Access Portal
                  </a>
                ) : (
                  <a href="/reach-us" className="type-button btn-primary">
                    Avail Service
                  </a>
                )}
                <Link href={`/services#${item.section}`} className="type-button btn-outline">
                  View All {SECTION_LABEL[item.section]}
                </Link>
              </div>
            </div>

            <PhotoTile
              src={item.image}
              alt={item.name}
              aspect="aspect-[3/2]"
              className="rounded-xl"
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority
            />
          </div>
        </Container>
      </section>

      {/* ---------- About ---------- */}
      <section className="bg-canvas-soft">
        <Container className="py-xxl">
          <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">About the {isProject ? "project" : "service"}</p>
          <h2 className="type-display-md mb-10 text-ink">What {item.name} does</h2>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-4">
              <p className="type-body-md text-[var(--color-body)]">{item.description}</p>
              <p className="type-body-md text-[var(--color-body)]">{secondParagraph}</p>
            </div>
            <div className="card-feature border-l-4 border-l-[var(--color-primary-blue)] !p-6">
              <p className="type-display-sm mb-2 text-[var(--color-primary-blue)]">&ldquo;</p>
              <p className="type-body-md text-ink">{pullQuote.quote}</p>
              <p className="type-caption mt-4 text-[var(--color-muted)]">— {pullQuote.source}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Features ---------- */}
      <section className="bg-canvas">
        <Container className="py-xxl">
          <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Capabilities</p>
          <h2 className="type-display-md mb-10 text-ink">Key Features</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card-feature">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-surface-strong)] text-[var(--color-primary-blue)]">
                  <FeatureIcon className="h-4.5 w-4.5" />
                </div>
                <h3 className="type-title-sm mb-1.5 text-ink">{feature.title}</h3>
                <p className="type-body-sm text-[var(--color-muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- Product tour (illustrative) ---------- */}
      <section className="bg-canvas-soft">
        <Container className="py-xxl">
          <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Product tour</p>
          <h2 className="type-display-md mb-10 text-ink">A look at {item.name}</h2>

          <ScreenshotCarousel images={screenshotImages} />
          <p className="type-caption mt-3 text-center text-[var(--color-muted)]">
            Illustrative — production screenshots to be added.
          </p>
        </Container>
      </section>

      {/* ---------- Eligibility ---------- */}
      <section className="bg-canvas">
        <Container className="py-xxl">
          <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Eligibility</p>
          <h2 className="type-display-md mb-10 text-ink">Who can use this</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="card-feature">
              <h3 className="type-title-sm mb-4 text-ink">You can use this if</h3>
              <ul className="flex flex-col gap-3">
                {eligibility.who.map((line) => (
                  <li key={line} className="type-body-sm flex items-start gap-2.5 text-[var(--color-body)]">
                    <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-feature">
              <h3 className="type-title-sm mb-4 text-ink">What you&apos;ll need</h3>
              <ul className="flex flex-col gap-3">
                {eligibility.docs.map((line) => (
                  <li key={line} className="type-body-sm flex items-start gap-2.5 text-[var(--color-body)]">
                    <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-strong)] text-[var(--color-primary-blue)]">
                      <DocIcon className="h-3 w-3" />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- How to Access ---------- */}
      <section className="bg-canvas-soft">
        <Container className="py-xxl">
          <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Get started</p>
          <h2 className="type-display-md mb-10 text-ink">How to access {item.name}</h2>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr]">
            <ol className="flex flex-col">
              {steps.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[40px_1fr] gap-4 border-t border-hairline py-5 first:border-t-0 first:pt-0">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-blue)] text-white">
                    <span className="type-caption font-semibold">{i + 1}</span>
                  </span>
                  <div>
                    <p className="type-body-strong text-ink">{step.title}</p>
                    <p className="type-body-sm mt-1 text-[var(--color-muted)]">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="card-feature h-fit">
              {isProject ? (
                <>
                  <h3 className="type-title-sm mb-3 text-ink">Direct link</h3>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-hairline-strong bg-canvas px-4 py-3">
                    <span className="type-body-sm font-semibold text-[var(--color-primary-blue)]">{item.name} Portal</span>
                    <a href={item.accessPortalHref} className="type-button btn-primary !h-9 !px-4">
                      Open
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="type-title-sm mb-3 text-ink">Availability</h3>
                  <p className="type-body-sm mb-4 text-[var(--color-body)]">
                    {`${item.name} is a department-facing service coordinated through TNeGA — there's no direct self-service portal for it.`}
                  </p>
                  <a href="/reach-us" className="type-button btn-primary">
                    Avail Service
                  </a>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Success Stories (placeholder — see service-detail-generator.ts
          header comment for why this is a "coming soon" placeholder rather
          than generated copy) ---------- */}
      <section className="bg-canvas-soft">
        <Container className="py-xxl">
          <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">In the field</p>
          <h2 className="type-display-md mb-10 text-ink">Success stories &amp; coverage</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[0, 1, 2].map((n) => (
              <div key={n} className="card-feature">
                <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-hairline-strong bg-[var(--color-surface-strong)]">
                  <span className="type-caption text-[var(--color-muted)]">Coming soon</span>
                </div>
                <p className="type-caption-uppercase mb-1.5 text-[var(--color-primary-blue)]">Placeholder</p>
                <h3 className="type-title-sm mb-1.5 text-ink">Real-world impact, coming soon</h3>
                <p className="type-body-sm text-[var(--color-muted)]">
                  Success stories and media coverage for {item.name} will be added here as they&apos;re published.
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="bg-canvas">
        <Container className="max-w-[840px] py-xxl">
          <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Questions</p>
          <h2 className="type-display-md mb-10 text-ink">Frequently asked questions</h2>
          <FaqAccordion faqs={faqs} />
        </Container>
      </section>

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="bg-canvas-soft">
          <Container className="py-xxl">
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Explore more</p>
            <h2 className="type-display-md mb-10 text-ink">Related {SECTION_LABEL[item.section]}</h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((sibling) => (
                <Link key={sibling.slug} href={`/services/${sibling.slug}`} className="card-feature hover:border-[var(--color-primary-blue)]">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-surface-strong)] text-[var(--color-primary-blue)]">
                    <span className="type-caption font-bold">{sibling.name.slice(0, 2)}</span>
                  </div>
                  <h3 className="type-title-sm mb-1 text-ink">{sibling.name}</h3>
                  <p className="type-caption text-[var(--color-muted)]">{sibling.type === "project" ? "Project" : "Service"}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ---------- Contact ---------- */}
      <section className="bg-canvas">
        <Container className="py-xxl">
          <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Support</p>
          <h2 className="type-display-md mb-10 text-ink">Contact &amp; support</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="card-feature">
              <h3 className="type-caption-uppercase mb-2 text-[var(--color-muted)]">Helpline</h3>
              <a href={`tel:${footer.phone.replace(/\s|-/g, "")}`} className="type-body-strong text-ink hover:text-[var(--color-primary-blue)]">
                {footer.phone}
              </a>
            </div>
            <div className="card-feature">
              <h3 className="type-caption-uppercase mb-2 text-[var(--color-muted)]">Email</h3>
              <a href={`mailto:${footer.email}`} className="type-body-strong text-ink hover:text-[var(--color-primary-blue)]">
                {footer.email}
              </a>
            </div>
            <div className="card-feature">
              <h3 className="type-caption-uppercase mb-2 text-[var(--color-muted)]">Office</h3>
              <p className="type-body-sm text-[var(--color-body)]">{footer.address}</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
