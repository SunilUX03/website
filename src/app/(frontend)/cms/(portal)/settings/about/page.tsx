import { getPayloadClient } from "@/lib/payload-client";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateAboutPageContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function AboutPageSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "about-page-content", draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">About Page Content</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        Hero, Who We Are, the reporting-line strip, Vision &amp; Mission, and Connect With Us.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <form action={updateAboutPageContent} className="flex max-w-[680px] flex-col gap-6">
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
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Headline</label>
            <input
              name="heroHeadline"
              defaultValue={doc.hero.headline}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
            <textarea
              name="heroDescription"
              defaultValue={doc.hero.description}
              required
              rows={4}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Who We Are</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
            <input
              name="whoWeAreHeading"
              defaultValue={doc.whoWeAre.heading}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Paragraph</label>
            <textarea
              name="whoWeAreParagraph"
              defaultValue={doc.whoWeAre.paragraph}
              required
              rows={4}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
            Reporting-line boxes <span className="normal-case text-[11px]">(top to bottom; check &quot;Emphasized&quot; to highlight TNeGA itself)</span>
          </label>
          <RepeatableRows
            name="hierarchy"
            fields={[
              { key: "label", label: "Label" },
              { key: "emphasized", label: "Emphasized", checkbox: true },
            ]}
            initialRows={doc.hierarchy?.map((r) => ({ label: r.label, emphasized: r.emphasized ? "true" : "false" })) ?? []}
            addLabel="+ Add box"
          />
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
            Vision &amp; Mission <span className="normal-case text-[11px]">(normally exactly two cards)</span>
          </label>
          <RepeatableRows
            name="visionMission"
            fields={[
              { key: "label", label: "Label (e.g. Vision)" },
              { key: "title", label: "Title" },
              { key: "description", label: "Description", textarea: true },
            ]}
            initialRows={doc.visionMission?.map((r) => ({ label: r.label, title: r.title, description: r.description })) ?? []}
            addLabel="+ Add card"
          />
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Connect With Us</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Email</label>
            <input
              name="connectEmail"
              type="email"
              defaultValue={doc.connectWithUs.email}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Social links</label>
            <RepeatableRows
              name="connectSocial"
              fields={[
                { key: "label", label: "Label (e.g. Facebook)" },
                { key: "href", label: "URL" },
              ]}
              initialRows={doc.connectWithUs.social?.map((r) => ({ label: r.label, href: r.href })) ?? []}
              addLabel="+ Add social link"
            />
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? The About page will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish? This changes the About page immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
