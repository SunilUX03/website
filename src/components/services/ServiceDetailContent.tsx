import Link from "next/link";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { ServiceItemDetail, statsToBullets } from "@/lib/services-content";

const SECTION_LABEL: Record<ServiceItemDetail["section"], string> = {
  "citizen-services": "Citizen Services",
  "govt-digital-services": "Govt Digital Services",
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ServiceDetailContent({ item }: { item: ServiceItemDetail }) {
  const bullets = statsToBullets(item.stats);
  const isProject = item.type === "project";

  return (
    <>
      <section className="relative overflow-hidden bg-canvas" id="main-content">
        <div
          aria-hidden
          className="orb-drift-a pointer-events-none absolute -left-32 -top-20 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)",
            opacity: 0.4,
          }}
        />

        <div className="mx-auto w-full max-w-[1200px] px-6 py-xl md:px-10">
          <Link
            href={`/services#${item.section}`}
            className="type-body-sm inline-flex items-center gap-1.5 text-[var(--color-muted)] hover:text-ink"
          >
            ← Back to {SECTION_LABEL[item.section]}
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[1200px] px-6 pb-xxl md:px-10 md:pb-section">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[52%_48%] lg:gap-12">
            <div>
              <p className="type-caption-uppercase mb-4 text-[var(--color-muted)]">
                {SECTION_LABEL[item.section]} · {isProject ? "Project" : "Service"}
              </p>
              <h1 className="type-display-xl mb-lg text-ink">{item.name}</h1>
              <p className="type-body-md max-w-[520px] text-[var(--color-body)]">{item.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {bullets.map((stat) => (
                  <span key={stat} className="badge-pill type-caption">
                    {stat}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
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
              sizes="(min-width: 1024px) 48vw, 100vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-canvas-soft">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-xxl md:px-10 md:py-section">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {isProject ? (
              <>
                <div>
                  <h2 className="type-title-lg mb-4 text-ink">Key Features</h2>
                  <ul className="flex flex-col gap-3">
                    {bullets.map((stat) => (
                      <li key={stat} className="type-body-sm flex items-start gap-2.5 text-[var(--color-body)]">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary-blue)]" />
                        {stat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="type-title-lg mb-4 text-ink">How to Access</h2>
                  <p className="type-body-sm mb-5 text-[var(--color-body)]">
                    {item.accessPortalHref
                      ? `Visit the ${item.name} portal and sign in with your verified credentials to get started.`
                      : `${item.name} is being rolled out — the self-service portal will be linked here once it's live.`}
                  </p>
                  {item.accessPortalHref && (
                    <a href={item.accessPortalHref} className="type-button btn-primary">
                      Access Portal
                    </a>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="type-title-lg mb-4 text-ink">What is {item.name}?</h2>
                  <p className="type-body-sm text-[var(--color-body)]">{item.description}</p>
                </div>
                <div>
                  <h2 className="type-title-lg mb-4 text-ink">How It Helps the Department</h2>
                  <ul className="flex flex-col gap-3">
                    {bullets.map((stat) => (
                      <li key={stat} className="type-body-sm flex items-start gap-2.5 text-[var(--color-body)]">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary-blue)]" />
                        {stat}
                      </li>
                    ))}
                  </ul>
                  <a href="/reach-us" className="type-button btn-primary mt-5 inline-flex">
                    Avail Service
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
