import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { contacts, disclosures, howToFile } from "@/lib/rti-content";

export function KeyContacts() {
  return (
    <section className="bg-canvas-soft py-xxl md:py-section">
      <Container>
        <SectionHead heading="Key Contacts" id="contacts-heading" />

        <div className="grid gap-lg md:grid-cols-2">
          {contacts.map((contact) => (
            <div
              key={contact.badge}
              role="region"
              aria-label={`${contact.badge} contact`}
              className="flex flex-col gap-base rounded-xl border border-hairline bg-surface-card p-lg"
            >
              <span
                className={clsx(
                  "type-caption-uppercase self-start rounded-pill px-3 py-1",
                  contact.tone === "dark"
                    ? "bg-[var(--color-primary-blue)] text-[var(--color-on-primary)]"
                    : "bg-surface-strong text-ink"
                )}
              >
                {contact.badge}
              </span>

              <div>
                <p className="type-title-md text-[var(--color-body-strong)]">
                  {contact.name}
                </p>
                <p className="type-body-md text-[var(--color-muted)]">
                  {contact.designation}
                </p>
              </div>

              <hr className="border-t border-hairline" />

              <div className="flex flex-col gap-xxs">
                {contact.details.map((detail) => (
                  <p
                    key={detail.text}
                    className="type-body-sm text-[var(--color-muted)]"
                  >
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="font-medium text-ink hover:underline"
                      >
                        {detail.text}
                      </a>
                    ) : (
                      detail.text
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function DisclosureTable() {
  return (
    <section className="py-xxl md:py-section">
      <Container>
        <SectionHead
          heading="RTI Act 2005 — Disclosures under Section 4(1)(b)"
          sub="Mandatory proactive disclosures as required under the Right to Information Act, 2005."
          id="disclosure-heading"
        />

        <div className="overflow-hidden rounded-md border border-hairline bg-surface-card">
          <div className="overflow-x-auto">
            <table
              className="w-full min-w-[740px] border-collapse text-sm"
              aria-label="RTI Act 2005 Section 4(1)(b) disclosures"
            >
              <thead className="border-b border-hairline bg-canvas">
                <tr>
                  {["S.No", "Item", "Details of Disclosure", "Information"].map(
                    (h) => (
                      <th
                        key={h}
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.72px] text-[var(--color-muted)]"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {disclosures.map((group) =>
                  group.rows.map((row, i) => (
                    <tr key={`${group.sno}-${i}`} className="align-top">
                      {i === 0 ? (
                        <>
                          <td
                            rowSpan={group.rows.length}
                            className="border-t border-hairline-soft px-4 py-4 text-sm font-medium text-[var(--color-body-strong)]"
                          >
                            {group.sno}
                          </td>
                          <td
                            rowSpan={group.rows.length}
                            className="max-w-[260px] border-t border-hairline-soft px-4 py-4 text-sm font-medium text-[var(--color-body-strong)]"
                          >
                            {group.item}
                          </td>
                        </>
                      ) : null}
                      <td className="max-w-[260px] border-t border-hairline-soft px-4 py-4 text-sm text-[var(--color-body)]">
                        {row.detail}
                      </td>
                      <td
                        className={clsx(
                          "border-t border-hairline-soft px-4 py-4 text-sm",
                          row.info === "—"
                            ? "text-[var(--color-muted-soft)]"
                            : "text-[var(--color-body)]"
                        )}
                      >
                        {row.info}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-3.5 w-3.5 fill-none stroke-current stroke-2"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function HowToFileRti() {
  return (
    <section className="bg-canvas-soft py-xxl md:py-section">
      <Container>
        <SectionHead
          heading={howToFile.heading}
          sub={howToFile.sub}
          id="file-heading"
          align="center"
        />

        <div className="mx-auto w-full max-w-[640px]">
          <div className="flex flex-col items-center gap-base rounded-xl border border-hairline bg-surface-card p-lg text-center md:p-xl">
            <p className="type-body-md text-[var(--color-body)]">
              {howToFile.body}
            </p>

            <a
              href={howToFile.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="type-button btn-primary"
              aria-label={`${howToFile.ctaLabel} at rtionline.gov.in (opens in new tab)`}
            >
              {howToFile.ctaLabel}
              <ExternalIcon />
            </a>

            <p className="type-caption text-[var(--color-muted)]">
              {howToFile.redirectNote}
            </p>

            <hr className="w-full border-t border-hairline" />

            <p className="type-body-sm text-[var(--color-muted)]">
              For queries regarding RTI, contact the Public Information Officer
              at{" "}
              <a
                href={`mailto:${howToFile.email}`}
                className="font-medium text-ink hover:underline"
              >
                {howToFile.email}
              </a>{" "}
              or call{" "}
              <a
                href={howToFile.phoneHref}
                className="font-medium text-ink hover:underline"
              >
                {howToFile.phone}
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
