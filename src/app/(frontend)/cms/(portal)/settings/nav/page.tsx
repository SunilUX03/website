import { getPayloadClient } from "@/lib/payload-client";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateNavContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function NavSettingsPage() {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "nav-content", draft: true, overrideAccess: true });

  const linkFields = [{ key: "label", label: "Label" }, { key: "href", label: "URL" }];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Header Navigation</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">Shown at the top of every page.</p>

      <form action={updateNavContent} className="flex max-w-[680px] flex-col gap-6">
        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Government link label <span className="normal-case text-[11px]">(top bar, links to tn.gov.in)</span>
          </label>
          <input
            name="govLabel"
            defaultValue={doc.govLabel}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">About menu</label>
          <RepeatableRows name="about" fields={linkFields} initialRows={doc.about ?? []} addLabel="+ Add link" />
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Services menu</label>
          <RepeatableRows name="services" fields={linkFields} initialRows={doc.services ?? []} addLabel="+ Add link" />
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Notifications menu — Updates column</label>
          <RepeatableRows name="notificationsUpdates" fields={linkFields} initialRows={doc.notificationsUpdates ?? []} addLabel="+ Add link" />
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Notifications menu — Documents column</label>
          <RepeatableRows name="notificationsDocuments" fields={linkFields} initialRows={doc.notificationsDocuments ?? []} addLabel="+ Add link" />
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton
              name="intent"
              value="unpublish"
              confirmMessage="Unpublish? The header nav will revert to whatever was last published."
              className="type-button btn-outline"
            >
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton
            name="intent"
            value="publish"
            confirmMessage="Publish? This changes the navigation on every page immediately."
            className="type-button btn-primary"
          >
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
