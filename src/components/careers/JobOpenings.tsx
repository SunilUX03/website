import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import type { CmsJobOpening } from "@/lib/cms/job-openings";

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[15px] w-[15px] shrink-0 fill-none stroke-current stroke-[1.5]"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="12" x2="12" y2="18" />
      <polyline points="9 15 12 18 15 15" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-3.5 w-3.5 shrink-0 fill-none stroke-current stroke-[1.5]"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

export function JobOpenings({ openings, openingsNote }: { openings: CmsJobOpening[]; openingsNote: string }) {
  return (
    <section className="py-xxl md:py-section" id="openings">
      <Container>
        <SectionHead heading="Current Openings" id="openings-heading" />

        {openings.length === 0 ? (
          <div className="flex flex-col items-center gap-sm rounded-xl border border-hairline bg-surface-card px-lg py-xxl text-center">
            <p className="type-title-sm text-[var(--color-body-strong)]">No active job openings currently</p>
            <p className="type-body-sm max-w-[48ch] text-[var(--color-muted)]">
              But you can submit your resume below and we will reach out if any role that fits comes up.
            </p>
            <a href="#apply" className="type-button btn-primary mt-2">
              Submit your resume
            </a>
          </div>
        ) : (
        <ul role="list" className="grid gap-lg md:grid-cols-2">
          {openings.map((job) => (
            <li
              key={job.id}
              className="flex flex-col gap-base rounded-xl border border-hairline bg-surface-card p-lg transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-start justify-between gap-sm">
                <h3 className="type-title-sm text-[var(--color-body-strong)]">
                  {job.role}
                </h3>
                <span className="badge-pill type-caption-uppercase shrink-0 whitespace-nowrap">
                  {job.type}
                </span>
              </div>

              <p className="type-caption-uppercase text-[var(--color-muted)]">
                {job.department}
              </p>

              <p className="flex items-center gap-xs text-[13px] text-[var(--color-body)]">
                <ClockIcon />
                <span>
                  Last Date to Apply:{" "}
                  <span className="font-medium text-[var(--color-body-strong)]">
                    {job.deadline}
                  </span>
                </span>
              </p>

              <div className="mt-auto flex flex-wrap gap-xs pt-xs">
                {job.jdHref ? (
                  <a
                    href={job.jdHref}
                    className="type-button btn-outline"
                    aria-label={`Download job description for ${job.role}`}
                  >
                    <DownloadIcon />
                    Download JD
                  </a>
                ) : null}
                <a
                  href="#apply"
                  className="type-button btn-primary"
                  aria-label={`Apply for ${job.role}`}
                >
                  Apply Now
                </a>
              </div>
            </li>
          ))}
        </ul>
        )}

        <p className="type-body-sm mt-xl text-[var(--color-muted)]">
          {openingsNote}
        </p>
      </Container>
    </section>
  );
}
