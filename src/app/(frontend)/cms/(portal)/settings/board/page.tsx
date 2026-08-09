import { getPayloadClient } from "@/lib/payload-client";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateBoardContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function BoardSettingsPage() {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "board-content", draft: true, overrideAccess: true });

  const memberRows = (doc.members ?? []).map((m) => ({
    name: m.name,
    title: m.title,
    isPlaceholder: m.isPlaceholder ? "true" : "false",
  }));

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Governing Board</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">Shown on the About page.</p>

      <form action={updateBoardContent} className="flex max-w-[680px] flex-col gap-6">
        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Chairman</p>
          <div className="grid grid-cols-3 gap-3">
            <input name="chairmanRole" defaultValue={doc.chairman?.role ?? "Chairman"} placeholder="Role" className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            <input name="chairmanName" defaultValue={doc.chairman?.name ?? ""} placeholder="Name" required className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            <input name="chairmanTitle" defaultValue={doc.chairman?.title ?? ""} placeholder="Title" required className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Member Secretary</p>
          <div className="grid grid-cols-3 gap-3">
            <input name="memberSecretaryRole" defaultValue={doc.memberSecretary?.role ?? "Member Secretary"} placeholder="Role" className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            <input name="memberSecretaryName" defaultValue={doc.memberSecretary?.name ?? ""} placeholder="Name" required className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            <input name="memberSecretaryTitle" defaultValue={doc.memberSecretary?.title ?? ""} placeholder="Title" required className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">Members</p>
          <RepeatableRows
            name="members"
            fields={[
              { key: "name", label: "Name" },
              { key: "title", label: "Title" },
              { key: "isPlaceholder", label: "Placeholder (not yet confirmed)", checkbox: true },
            ]}
            initialRows={memberRows}
            addLabel="+ Add member"
          />
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? The Board section will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish these changes to the Governing Board?" className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
