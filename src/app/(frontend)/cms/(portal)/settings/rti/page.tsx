import { getPayloadClient } from "@/lib/payload-client";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateRtiContent } from "./actions";

export const dynamic = "force-dynamic";

const CONTACT_NAMES = ["Appellate Authority", "Public Information Officer"];

export default async function RtiSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "rti-content", draft: true, overrideAccess: true });
  const contacts = doc.contacts ?? [];
  const disclosures = doc.disclosures ?? [];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">RTI Page Content</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The RTI page hero, the 2 key-contact cards, the Section 4(1)(b) disclosure table, and the How to File panel.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[720px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <form action={updateRtiContent} className="flex max-w-[720px] flex-col gap-6">
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

        {Array.from({ length: 2 }, (_, i) => contacts[i]).map((contact, i) => (
          <section key={i} className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
            <p className="type-caption-uppercase text-[var(--color-muted)]">Contact {i + 1} — {CONTACT_NAMES[i]}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Badge text</label>
                <input name={`contact${i}Badge`} defaultValue={contact?.badge ?? CONTACT_NAMES[i]} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
              </div>
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Badge style</label>
                <select name={`contact${i}Tone`} defaultValue={contact?.tone ?? "light"} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Name</label>
              <input name={`contact${i}Name`} defaultValue={contact?.name ?? ""} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Designation</label>
              <input name={`contact${i}Designation`} defaultValue={contact?.designation ?? ""} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
                Contact details <span className="normal-case text-[11px]">(one per line; add &quot; :: href&quot; to make a line a link, e.g. &quot;044 4016 4900 :: tel:04440164900&quot;)</span>
              </label>
              <textarea name={`contact${i}DetailsText`} defaultValue={contact?.detailsText ?? ""} required rows={4} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
          </section>
        ))}

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
            Section 4(1)(b) disclosures{" "}
            <span className="normal-case text-[11px]">
              (each row&apos;s &quot;Sub-rows&quot; text: one sub-row per line, formatted &quot;Detail :: Info&quot;)
            </span>
          </label>
          <RepeatableRows
            name="disclosures"
            fields={[
              { key: "sno", label: "S.No" },
              { key: "item", label: "Item", textarea: true },
              { key: "rowsText", label: "Sub-rows (one per line, Detail :: Info)", textarea: true },
            ]}
            initialRows={disclosures.map((d) => ({ sno: d.sno, item: d.item, rowsText: d.rowsText }))}
            addLabel="+ Add disclosure row"
          />
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">How to File</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
            <input name="fileHeading" defaultValue={doc.howToFile.heading} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Subheading</label>
            <input name="fileSub" defaultValue={doc.howToFile.sub} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
            <textarea name="fileBody" defaultValue={doc.howToFile.body} required rows={3} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Button text</label>
              <input name="fileCtaLabel" defaultValue={doc.howToFile.ctaLabel} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Button link</label>
              <input name="fileCtaHref" defaultValue={doc.howToFile.ctaHref} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Redirect note</label>
            <input name="fileRedirectNote" defaultValue={doc.howToFile.redirectNote} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Email</label>
              <input name="fileEmail" defaultValue={doc.howToFile.email} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Phone (display)</label>
              <input name="filePhone" defaultValue={doc.howToFile.phone} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Phone (tel: link)</label>
              <input name="filePhoneHref" defaultValue={doc.howToFile.phoneHref} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? The RTI page will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish? This changes the RTI page immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
