import { getPayloadClient } from "@/lib/payload-client";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateTendersContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function TendersSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "tenders-content", draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Tenders Page Content</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The Tenders page hero and the panel linking out to the Government e-Tendering portal.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <form action={updateTendersContent} className="flex max-w-[680px] flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Hero</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow</label>
            <input name="heroEyebrow" defaultValue={doc.hero.eyebrow} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
            <input name="heroHeading" defaultValue={doc.hero.heading} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
            <textarea name="heroBody" defaultValue={doc.hero.body} required rows={3} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Tender Portal Panel</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
            <input name="portalHeading" defaultValue={doc.tenderPortal.heading} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Subheading</label>
            <input name="portalSub" defaultValue={doc.tenderPortal.sub} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
            <textarea name="portalBody" defaultValue={doc.tenderPortal.body} required rows={3} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Button text</label>
            <input name="portalCtaLabel" defaultValue={doc.tenderPortal.ctaLabel} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Button link (external portal URL)</label>
            <input name="portalCtaHref" defaultValue={doc.tenderPortal.ctaHref} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Redirect note</label>
            <input name="portalRedirectNote" defaultValue={doc.tenderPortal.redirectNote} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? The Tenders page will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish? This changes the Tenders page immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
