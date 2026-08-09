import { getPayloadClient } from "@/lib/payload-client";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateHeroContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function HeroSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "hero-content", draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Homepage Hero</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">The first thing every visitor sees.</p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <form action={updateHeroContent} className="flex max-w-[680px] flex-col gap-6">
        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
            Agency name (cycles through each line shown)
          </label>
          <RepeatableRows
            name="agencyLabelCycle"
            fields={[{ key: "text", label: "Text" }]}
            initialRows={doc.agencyLabelCycle?.map((r) => ({ text: r.text })) ?? []}
            addLabel="+ Add line"
          />
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Headline <span className="normal-case text-[11px]">(use {"{word}"} exactly once, where the animated word goes)</span>
          </label>
          <input
            name="headlineTemplate"
            defaultValue={doc.headlineTemplate}
            required
            placeholder="Powering Digital {word} in Tamil Nadu"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Words that cycle through {"{word}"}</label>
          <RepeatableRows
            name="headlineCycleWords"
            fields={[{ key: "word", label: "Word" }]}
            initialRows={doc.headlineCycleWords?.map((r) => ({ word: r.word })) ?? []}
            addLabel="+ Add word"
          />
        </section>

        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Tagline</label>
          <textarea
            name="tagline"
            defaultValue={doc.tagline}
            required
            rows={2}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? The homepage Hero will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish? This changes the homepage immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
