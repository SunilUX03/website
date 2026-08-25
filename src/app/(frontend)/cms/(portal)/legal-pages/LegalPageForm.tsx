"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type LegalPageFormValues = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  sections: { id?: string; heading: string; body: string }[];
  status?: "draft" | "published";
  /** The document's `updatedAt` as of this page load — round-tripped
   * through a hidden field so the server action can detect a save based
   * on stale data (e.g. a locale tab left open since before someone
   * else's edit) and refuse it instead of silently overwriting. */
  updatedAt?: string;
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

export function LegalPageForm({
  action,
  values,
  error,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: LegalPageFormValues;
  error?: string;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads. See
   * ServiceForm.tsx for the full explanation of this pattern. */
  locale?: "en" | "ta";
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
    const text = (key: string, label: string, original: string) => {
      const after = String(fd.get(key) ?? "").trim();
      if (after !== (original ?? "")) {
        list.push({ id: key, label, detail: `"${truncate(original) || "(empty)"}" → "${truncate(after) || "(empty)"}"`, sectionId: "section-main" });
      }
    };
    text("title", "Page title", values.title);
    text("eyebrow", "Eyebrow label", values.eyebrow);
    text("intro", "Intro paragraph", values.intro);
    const after = reconstructRows(fd, "sections", ["heading", "body"]);
    const before = values.sections.map((s) => ({ heading: s.heading, body: s.body }));
    if (JSON.stringify(after) !== JSON.stringify(before)) {
      list.push({ id: "sections", label: "Sections", detail: `${values.sections.length} → ${after.length} section${after.length === 1 ? "" : "s"}`, sectionId: "section-sections" });
    }
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
    <form ref={formRef} action={action} className="flex max-w-[720px] flex-col gap-6">
      <input ref={intentRef} type="hidden" name="intent" defaultValue="draft" />
      <input type="hidden" name="slug" value={values.slug} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="_loadedUpdatedAt" value={values.updatedAt ?? ""} />

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <section id="section-main" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Page title</label>
          <input
            name="title"
            defaultValue={values.title}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow label</label>
          <input
            name="eyebrow"
            defaultValue={values.eyebrow}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Intro paragraph (optional)</label>
          <textarea
            name="intro"
            defaultValue={values.intro}
            rows={2}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-sections" className="rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Sections <span className="normal-case text-[11px]">(separate paragraphs with a blank line; a paragraph where every line starts with &quot;- &quot; becomes a bullet list)</span>
        </label>
        <RepeatableRows
          name="sections"
          fields={[
            { key: "heading", label: "Heading" },
            { key: "body", label: "Body", textarea: true },
          ]}
          initialRows={values.sections}
          addLabel="+ Add section"
        />
      </section>

      <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
        <button
          type="button"
          onClick={handleUpdateClick}
          className="type-button btn-primary !h-12 !px-6 shadow-[0_8px_24px_rgba(15,23,42,0.28)]"
        >
          Update
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
