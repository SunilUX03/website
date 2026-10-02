import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ServicesToGovernmentGraphic } from "@/components/heroes/ServicesToGovernmentGraphic";
import type { CmsServicesToGovernmentContent } from "@/lib/cms/services-to-government";
import type { Locale } from "@/lib/locale";

const heroOrbs = [
  { color: "sky", className: "-left-20 -top-24 h-[420px] w-[420px]" },
  { color: "peach", className: "-bottom-16 right-[60px] h-[360px] w-[360px]" },
] as const;

// Fixed anchor slugs for the first 4 service cards, by position — not
// sourced from the CMS array's own (random) row ids. The Home page's
// "Services to Government" pillar card deep-links straight to these
// anchors (see lib/content.ts), so they need to stay stable even if an
// editor renames a service's copy in the CMS; only reordering these rows
// would move them. `services` is now a growable CMS array (no more fixed
// 4-row cap), so any 5th+ row falls back to a per-row anchor derived from
// its own id instead of one of these hardcoded slugs.
const SERVICE_ANCHOR_IDS = [
  "software-development-procurement",
  "security-audit",
  "sms-whatsapp-gateway",
  "aadhaar-services",
] as const;

/** The full Services to Government page content (hero, services,
 * department contacts) — shared between the standalone /services-to-government
 * page and the "Services to Government" tab on /services, so the two
 * never drift apart. `heroId` defaults to "services-to-government" (the
 * tab-embedded case); the standalone page overrides it to "main-content"
 * to keep the skip-to-content link's target on the page's own hero.
 * `content` (hero, services, tableIntro, raiseTicket*, departmentContacts)
 * comes entirely from the services-to-government-content CMS global —
 * departmentContacts used to be a separate "department-contacts"
 * collection fetched independently; it's now one array field on this same
 * global, so there's a single CMS screen for the whole page. */
export function ServicesToGovernmentContent({
  heroId = "services-to-government",
  content,
  locale = "en",
}: {
  heroId?: string;
  content: CmsServicesToGovernmentContent;
  locale?: Locale;
}) {
  const {
    hero,
    hideServicesSection,
    services,
    hideTableIntroSection,
    tableIntro,
    tableColumnHeaders,
    raiseTicketLabel,
    raiseTicketHref,
    hideDepartmentContactsSection,
    departmentContacts,
  } = content;
  return (
    <>
      <PageHero
        id={heroId}
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        body={hero.body}
        cta={{ label: raiseTicketLabel, href: raiseTicketHref, external: true }}
        orbs={heroOrbs}
        graphic={<ServicesToGovernmentGraphic />}
      />

      {/* The 4 services */}
      {hideServicesSection ? null : (
        <section className="bg-canvas-soft">
          <Container className="py-xxl md:py-section">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {services.map((service, i) => (
                <div key={service.id} id={SERVICE_ANCHOR_IDS[i] ?? `service-${service.id}`} className="card-feature scroll-mt-28">
                  <p className="type-title-sm mb-2 text-ink">{service.name}</p>
                  <p className="type-body-sm text-[var(--color-body)]">{service.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Department contacts: intro copy and the table itself are each
          independently toggleable — skip the whole section only if both
          are hidden, so turning off just one still shows the other. */}
      {hideTableIntroSection && hideDepartmentContactsSection ? null : (
        <section className="bg-canvas">
          <Container className="py-xxl md:py-section">
            {hideTableIntroSection ? null : (
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">{tableIntro.eyebrow}</p>
                  <h2 className="type-display-sm mb-2 text-ink">{tableIntro.heading}</h2>
                  <p className="type-body-sm max-w-[64ch] text-[var(--color-muted)]">{tableIntro.body}</p>
                </div>
                <a href={raiseTicketHref} target="_blank" rel="noopener noreferrer" className="type-button btn-primary shrink-0">
                  {raiseTicketLabel}
                </a>
              </div>
            )}

            {hideDepartmentContactsSection ? null : (
              <>
                {/* Desktop/tablet: a real table. Mobile: a horizontally-
                    scrolling 4-column table is awkward to use on a phone —
                    below md, this becomes a stacked list of cards instead,
                    one per department, so everything reads top-to-bottom
                    with no sideways scrolling. */}
                <div className="hidden overflow-x-auto rounded-xl border border-hairline md:block">
                  <table className="w-full min-w-[720px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-hairline bg-canvas-soft">
                        <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">{tableColumnHeaders.serialNumber}</th>
                        <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">{tableColumnHeaders.department}</th>
                        <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">{tableColumnHeaders.contact}</th>
                        <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">{tableColumnHeaders.email}</th>
                        <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">{tableColumnHeaders.phone}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentContacts.map((row, i) => (
                        <tr key={row.id} className="border-b border-hairline last:border-0 hover:bg-canvas-soft">
                          <td className="type-body-sm px-5 py-3 text-[var(--color-muted)]">{i + 1}</td>
                          <td className="type-body-sm px-5 py-3 text-ink">{row.department}</td>
                          <td className="type-body-sm px-5 py-3 text-[var(--color-body)]">{row.contact}</td>
                          <td className="px-5 py-3">
                            <a href={`mailto:${row.email}`} className="type-body-sm text-[var(--color-primary-blue)] hover:underline">
                              {row.email}
                            </a>
                          </td>
                          <td className="px-5 py-3">
                            <a href={`tel:${row.phone.replace(/\s/g, "")}`} className="type-body-sm text-[var(--color-primary-blue)] hover:underline">
                              {row.phone}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 md:hidden">
                  {departmentContacts.map((row, i) => (
                    <div key={row.id} className="rounded-xl border border-hairline p-4">
                      <p className="type-body-strong mb-2 text-ink">{i + 1}. {row.department}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="type-caption text-[var(--color-muted)]">{row.contact}</span>
                        <a href={`mailto:${row.email}`} className="type-caption text-[var(--color-primary-blue)] hover:underline">
                          {row.email}
                        </a>
                        <a href={`tel:${row.phone.replace(/\s/g, "")}`} className="type-caption text-[var(--color-primary-blue)] hover:underline">
                          {row.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Container>
        </section>
      )}
    </>
  );
}
