import { getPayloadClient } from "@/lib/payload-client";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateFooterContent } from "./actions";

export const dynamic = "force-dynamic";

const SOCIAL_PLATFORMS = ["Facebook", "X", "YouTube", "Instagram", "LinkedIn"] as const;

export default async function FooterSettingsPage() {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "footer-content", draft: true, overrideAccess: true });
  const linkFields = [{ key: "label", label: "Label" }, { key: "href", label: "URL" }];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Footer</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">Shown at the bottom of every page.</p>

      <form action={updateFooterContent} className="flex max-w-[680px] flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
            <input name="description" defaultValue={doc.description} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Address</label>
            <textarea name="address" defaultValue={doc.address} required rows={2} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Phone</label>
              <input name="phone" defaultValue={doc.phone} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Email</label>
              <input name="email" defaultValue={doc.email} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Social links</p>
          <div className="flex flex-col gap-2">
            {SOCIAL_PLATFORMS.map((platform, i) => {
              const existing = doc.socialLinks?.find((l) => l.label === platform);
              return (
                <div key={platform} className="flex items-center gap-2">
                  <input type="hidden" name={`socialLinks.${i}.label`} value={platform} />
                  <span className="type-body-sm w-24 shrink-0 text-ink">{platform}</span>
                  <input
                    name={`socialLinks.${i}.href`}
                    defaultValue={existing?.href ?? ""}
                    placeholder="https://..."
                    className="flex-1 rounded-lg border border-hairline-strong bg-canvas px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-blue)]"
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Quick Links column</label>
          <RepeatableRows name="quickLinks" fields={linkFields} initialRows={doc.quickLinks ?? []} addLabel="+ Add link" />
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Citizen Services column</label>
          <RepeatableRows name="citizenServices" fields={linkFields} initialRows={doc.citizenServices ?? []} addLabel="+ Add link" />
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Help & Support column</label>
          <RepeatableRows name="helpSupport" fields={linkFields} initialRows={doc.helpSupport ?? []} addLabel="+ Add link" />
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? The footer will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish? This changes the footer on every page immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
