"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type CareersContentFormValues = {
  heroEyebrow: string;
  heroHeading: string;
  heroBody: string;
  heroCtaLabel: string;
  openingsNote: string;
  steps: { title: string; description: string }[];
  status?: "draft" | "published";
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

export function CareersContentForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: CareersContentFormValues;
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
    text("heroEyebrow", "Hero eyebrow", values.heroEyebrow, "section-hero");
    text("heroHeading", "Hero heading", values.heroHeading, "section-hero");
    text("heroBody", "Hero body", values.heroBody, "section-hero");
    text("heroCtaLabel", "Hero button text", values.heroCtaLabel, "section-hero");
    text("openingsNote", "Note below job listing", values.openingsNote, "section-note");
    for (let i = 0; i < 4; i++) {
      const s = values.steps[i];
      const sectionId = `section-step${i}`;
      text(`step${i}Title`, `Step ${i + 1} title`, s?.title ?? "", sectionId);
      text(`step${i}Description`, `Step ${i + 1} description`, s?.description ?? "", sectionId);
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
    <form ref={formRef} action={action} className="flex max-w-[680px] flex-col gap-6">
      <input ref={intentRef} type="hidden" name="intent" defaultValue="draft" />

      <section id="section-hero" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Hero</p>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow</label>
          <input
            name="heroEyebrow"
            defaultValue={values.heroEyebrow}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
          <input
            name="heroHeading"
            defaultValue={values.heroHeading}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
          <textarea
            name="heroBody"
            defaultValue={values.heroBody}
            required
            rows={4}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Button text <span className="normal-case text-[11px]">(links to the openings list on this page)</span>
          </label>
          <input
            name="heroCtaLabel"
            defaultValue={values.heroCtaLabel}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-note" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
          Note below the job listing
        </label>
        <textarea
          name="openingsNote"
          defaultValue={values.openingsNote}
          required
          rows={2}
          className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
        />
      </section>

      {Array.from({ length: 4 }, (_, i) => values.steps[i]).map((step, i) => (
        <section key={i} id={`section-step${i}`} className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">How to Apply — Step {i + 1}</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Title</label>
            <input
              name={`step${i}Title`}
              defaultValue={step?.title ?? ""}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
            <textarea
              name={`step${i}Description`}
              defaultValue={step?.description ?? ""}
              required
              rows={2}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => submitWithIntent("draft")} className="type-button btn-outline">
          Save draft
        </button>
        {values.status === "published" ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Unpublish? The Careers page will revert to whatever was last published.")) submitWithIntent("unpublish");
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
