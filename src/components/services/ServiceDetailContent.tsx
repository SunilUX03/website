import Link from "next/link";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FaqAccordion } from "./FaqAccordion";
import { ScreenshotCarousel } from "./ScreenshotCarousel";
import { ServiceItemCard } from "./ServiceItemCard";
import { CardCarousel } from "@/components/ui/CardCarousel";
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

// 5 placeholder slots (not a real count) so the Success Stories carousel
// has more than one screen's worth to scroll through even before any
// stories are published — see service-detail-generator.ts for why this
// stays "coming soon" rather than generated copy.
const STORY_PLACEHOLDER_TAGS = ["Milestone", "Update", "Feature", "Community", "Recognition"];

// Same icon across every Key Features card by design (per earlier
// feedback: "features will have the same icon") — a layered-stack glyph
// reads as "capability" more clearly than the star it replaced.
function FeatureIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 3 3 8l9 5 9-5-9-5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Distinct from FeatureIcon on purpose — this one only ever appears once,
// on the About section's highlight card, so it reads as a "spotlight" on
// that specific stat rather than reusing the Key Features glyph.
function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  const related = allServiceItems.filter((sibling) => sibling.section === item.section && sibling.slug !== item.slug).slice(0, 8);

  return (
    <>
      <Breadcrumb
        items={[
          { label: SECTION_LABEL[item.section], href: `/services#${item.section}` },
          { label: item.name },
        ]}
      />

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

            {/* A visible tinted frame plus a soft ambient glow behind it —
                the frame guarantees the "floating" effect reads regardless
                of the photo's own colors, the glow behind adds depth. */}
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-10 rounded-[2.5rem] opacity-90 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, var(--color-gradient-sky) 0%, transparent 60%), radial-gradient(circle at 70% 75%, var(--color-gradient-lavender) 0%, transparent 60%)",
                }}
              />
              <div
                className="relative rounded-2xl p-3"
                style={{
                  background: "linear-gradient(135deg, var(--color-surface-strong) 0%, var(--color-canvas-soft) 100%)",
                }}
              >
                <PhotoTile
                  src={item.image}
                  alt={item.name}
                  aspect="aspect-[3/2]"
                  className="rounded-xl shadow-[0_16px_40px_rgba(12,10,9,0.16)]"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  priority
                />
              </div>
            </div>
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
            {/* Always-on tinted highlight rather than a hover-revealed
                effect — the earlier hover glow washed out the text right
                when a reader was trying to read it. Static gradient fill +
                an icon badge instead of a giant quotation glyph. */}
            <div
              className="relative overflow-hidden rounded-xl border border-hairline p-6"
              style={{
                background: "linear-gradient(135deg, var(--color-surface-strong) 0%, var(--color-canvas-soft) 100%)",
              }}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-blue)] text-white">
                <TrendingUpIcon className="h-5 w-5" />
              </div>
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
              <div
                key={feature.title}
                className="card-feature transition-all duration-300 hover:-translate-y-1 hover:border-hairline-strong hover:shadow-[0_10px_30px_rgba(29,63,143,0.10)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-blue)] text-white">
                  <FeatureIcon className="h-6 w-6" />
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
                  <li key={line} className="type-body-sm flex items-start gap-3 text-[var(--color-body)]">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
                      <CheckIcon className="h-4 w-4" />
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
                  <li key={line} className="type-body-sm flex items-start gap-3 text-[var(--color-body)]">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-strong)] text-[var(--color-primary-blue)]">
                      <DocIcon className="h-4 w-4" />
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

          {/* A carousel rather than a fixed grid — this section is meant
              to grow past 3 cards as real stories get published, without
              a layout change. */}
          <CardCarousel>
            {STORY_PLACEHOLDER_TAGS.map((tag) => (
              <div key={tag} data-carousel-item className="card-feature w-[280px] shrink-0 snap-start sm:w-[320px]">
                <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-hairline-strong bg-[var(--color-surface-strong)]">
                  <span className="type-caption text-[var(--color-muted)]">Coming soon</span>
                </div>
                <p className="type-caption-uppercase mb-1.5 text-[var(--color-primary-blue)]">{tag}</p>
                <h3 className="type-title-sm mb-1.5 text-ink">Real-world impact, coming soon</h3>
                <p className="type-body-sm text-[var(--color-muted)]">
                  {`Success stories and media coverage for ${item.name} will be added here as they're published.`}
                </p>
              </div>
            ))}
          </CardCarousel>
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

            <CardCarousel>
              {related.map((sibling) => (
                <div key={sibling.slug} data-carousel-item className="w-[300px] shrink-0 snap-start sm:w-[340px]">
                  <ServiceItemCard item={sibling} />
                </div>
              ))}
            </CardCarousel>
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
