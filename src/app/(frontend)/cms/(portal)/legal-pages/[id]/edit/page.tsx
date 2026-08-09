import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateLegalPage } from "../../actions";

export default async function EditLegalPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "legal-pages", id: Number(id), draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateLegalPage.bind(null, doc.id);

  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">Edit: {doc.title}</h1>

      <form action={boundUpdate} className="flex max-w-[720px] flex-col gap-6">
        <input type="hidden" name="slug" value={doc.slug} />

        <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Page title</label>
            <input
              name="title"
              defaultValue={doc.title}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow label</label>
            <input
              name="eyebrow"
              defaultValue={doc.eyebrow ?? "Legal"}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Intro paragraph (optional)</label>
            <textarea
              name="intro"
              defaultValue={doc.intro ?? ""}
              rows={2}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
            Sections <span className="normal-case text-[11px]">(separate paragraphs with a blank line; a paragraph where every line starts with &quot;- &quot; becomes a bullet list)</span>
          </label>
          <RepeatableRows
            name="sections"
            fields={[
              { key: "heading", label: "Heading" },
              { key: "body", label: "Body", textarea: true },
            ]}
            initialRows={doc.sections?.map((s) => ({ heading: s.heading, body: s.body })) ?? []}
            addLabel="+ Add section"
          />
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish this page? It will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish this page? It goes live immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
