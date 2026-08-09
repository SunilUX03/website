import { getPayloadClient } from "@/lib/payload-client";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateCareersContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function CareersSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "careers-content", draft: true, overrideAccess: true });
  const steps = doc.applicationSteps ?? [];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Careers Page Content</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The Careers page hero (also shown as a teaser on the About page), the note under the job listing, and the
        4 &quot;How to Apply&quot; steps. Job openings themselves are edited separately under Job Openings.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <form action={updateCareersContent} className="flex max-w-[680px] flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Hero</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow</label>
            <input
              name="heroEyebrow"
              defaultValue={doc.hero.eyebrow}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
            <input
              name="heroHeading"
              defaultValue={doc.hero.heading}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
            <textarea
              name="heroBody"
              defaultValue={doc.hero.body}
              required
              rows={4}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Button text <span className="normal-case text-[11px]">(links to the openings list on this page)</span>
            </label>
            <input
              name="heroCtaLabel"
              defaultValue={doc.hero.ctaLabel}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Note below the job listing
          </label>
          <textarea
            name="openingsNote"
            defaultValue={doc.openingsNote}
            required
            rows={2}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </section>

        {Array.from({ length: 4 }, (_, i) => steps[i]).map((step, i) => (
          <section key={i} className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
            <p className="type-caption-uppercase text-[var(--color-muted)]">How to Apply — Step {i + 1}</p>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Title</label>
              <input
                name={`step${i}Title`}
                defaultValue={step?.title ?? ""}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
              <textarea
                name={`step${i}Description`}
                defaultValue={step?.description ?? ""}
                required
                rows={2}
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
          </section>
        ))}

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? The Careers page will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish? This changes the Careers and About pages immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
