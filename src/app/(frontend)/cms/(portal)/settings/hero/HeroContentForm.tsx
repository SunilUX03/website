"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type HeroContentFormValues = {
  // Deliberately not offered in Tamil here — it already cycles between
  // the English and Tamil agency names as two array entries regardless
  // of site locale, a design choice from before localization existed.
  agencyLabelCycle: { text: string }[];
  headlineTemplate: string;
  headlineTemplateTa: string;
  headlineCycleWords: { word: string; taWord: string }[];
  tagline: string;
  taglineTa: string;
  status?: "draft" | "published";
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

function reconstructRows(fd: FormData, name: string, keys: string[]): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  for (let i = 0; ; i++) {
    const first = `${name}.${i}.${keys[0]}`;
    if (!fd.has(first)) break;
    const row: Record<string, string> = {};
    for (const k of keys) row[k] = String(fd.get(`${name}.${i}.${k}`) ?? "").trim();
    if (Object.values(row).some(Boolean)) rows.push(row);
  }
  return rows;
}

export function HeroContentForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: HeroContentFormValues;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const intentRef = useRef<HTMLInputElement>(null);
  const [changes, setChanges] = useState<Change[] | null>(null);

  function submitWithIntent(intent: "draft" | "publish" | "unpublish") {
    if (intentRef.current) intentRef.current.value = intent;
    formRef.current?.requestSubmit();
  }

  function computeChanges(fd: FormData): Change[] {
    const list: Change[] = [];
    const text = (key: string, label: string, original: string, sectionId: string) => {
      const after = String(fd.get(key) ?? "").trim();
      if (after !== (original ?? "")) {
        list.push({ id: key, label, detail: `"${truncate(original) || "(empty)"}" → "${truncate(after) || "(empty)"}"`, sectionId });
      }
    };
    const rows = (name: string, keys: string[], label: string, original: unknown[], sectionId: string) => {
      const after = reconstructRows(fd, name, keys);
      if (JSON.stringify(after) !== JSON.stringify(original)) {
        list.push({ id: name, label, detail: `${original.length} → ${after.length} item${after.length === 1 ? "" : "s"}`, sectionId });
      }
    };

    rows("agencyLabelCycle", ["text"], "Agency name cycle", values.agencyLabelCycle, "section-agency");
    text("headlineTemplate", "Headline", values.headlineTemplate, "section-headline");
    text("headlineTemplateTa", "Headline (Tamil)", values.headlineTemplateTa, "section-headline");
    rows("headlineCycleWords", ["word", "taWord"], "Headline cycle words", values.headlineCycleWords, "section-words");
    text("tagline", "Tagline", values.tagline, "section-tagline");
    text("taglineTa", "Tagline (Tamil)", values.taglineTa, "section-tagline");
    return list;
  }

  function handleUpdateClick() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const detected = computeChanges(fd);
    if (detected.length === 0) {
      submitWithIntent("publish");
      return;
    }
    setChanges(detected);
  }

  return (
    <form ref={formRef} action={action} className="flex max-w-[680px] flex-col gap-6">
      <input ref={intentRef} type="hidden" name="intent" defaultValue="draft" />

      <section id="section-agency" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Agency name (cycles through each line shown)
        </label>
        <RepeatableRows
          name="agencyLabelCycle"
          fields={[{ key: "text", label: "Text" }]}
          initialRows={values.agencyLabelCycle}
          addLabel="+ Add line"
        />
      </section>

      <section id="section-headline" className="scroll-mt-6 flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Headline <span className="normal-case text-[11px]">(use {"{word}"} exactly once, where the animated word goes)</span>
          </label>
          <input
            name="headlineTemplate"
            defaultValue={values.headlineTemplate}
            required
            placeholder="Powering Digital {word} in Tamil Nadu"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Headline (Tamil) <span className="normal-case text-[11px]">(use {"{word}"} exactly once — Tamil doesn&apos;t case-mark it, so pick a phrasing that reads naturally as a bare noun)</span>
          </label>
          <input
            name="headlineTemplateTa"
            defaultValue={values.headlineTemplateTa}
            lang="ta"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-words" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Words that cycle through {"{word}"}</label>
        <RepeatableRows
          name="headlineCycleWords"
          fields={[{ key: "word", label: "Word" }, { key: "taWord", label: "Word (Tamil)" }]}
          initialRows={values.headlineCycleWords}
          addLabel="+ Add word"
        />
      </section>

      <section id="section-tagline" className="scroll-mt-6 flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Tagline</label>
          <textarea
            name="tagline"
            defaultValue={values.tagline}
            required
            rows={2}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Tagline (Tamil)</label>
          <textarea
            name="taglineTa"
            defaultValue={values.taglineTa}
            lang="ta"
            rows={2}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => submitWithIntent("draft")} className="type-button btn-outline">
          Save draft
        </button>
        {values.status === "published" ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Unpublish? The homepage Hero will revert to whatever was last published.")) submitWithIntent("unpublish");
            }}
            className="type-button btn-outline"
          >
            Unpublish
          </button>
        ) : null}
        <button type="button" onClick={handleUpdateClick} className="type-button btn-primary">
          {values.status === "published" ? "Update" : "Publish"}
        </button>
      </div>

      {changes ? (
        <UpdateReviewModal
          changes={changes}
          onEdit={() => setChanges(null)}
          onDiscard={(id) => setChanges((prev) => prev?.filter((c) => c.id !== id) ?? null)}
          onCancel={() => setChanges(null)}
          onConfirm={() => {
            setChanges(null);
            submitWithIntent("publish");
          }}
        />
      ) : null}
    </form>
  );
}
