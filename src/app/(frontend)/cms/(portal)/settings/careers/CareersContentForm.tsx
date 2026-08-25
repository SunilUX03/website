"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type CareersContentFormValues = {
  heroEyebrow: string;
  heroHeading: string;
  heroBody: string;
  heroCtaLabel: string;
  openingsNote: string;
  steps: { id?: string; title: string; description: string }[];
  howToApplyHeading: string;
  howToApplySub: string;
  openingsHeading: string;
  applyHeading: string;
  applySub: string;
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

export function CareersContentForm({
  action,
  values,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: CareersContentFormValues;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads. */
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
    text("howToApplyHeading", "How to Apply heading", values.howToApplyHeading, "section-headings");
    text("howToApplySub", "How to Apply sub-heading", values.howToApplySub, "section-headings");
    text("openingsHeading", "Current Openings heading", values.openingsHeading, "section-headings");
    text("applyHeading", "Apply Now heading", values.applyHeading, "section-headings");
    text("applySub", "Apply Now sub-heading", values.applySub, "section-headings");
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
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="_loadedUpdatedAt" value={values.updatedAt ?? ""} />

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
          {step?.id ? <input type="hidden" name={`step${i}Id`} value={step.id} /> : null}
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

      <section id="section-headings" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">
          Other section headings <span className="normal-case text-[11px]">(the content in each section is edited elsewhere — see above)</span>
        </p>

        <div className="border-t border-hairline pt-4">
          <p className="type-caption mb-3 font-semibold text-ink">How to Apply</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
              <input
                name="howToApplyHeading"
                defaultValue={values.howToApplyHeading}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Sub-heading</label>
              <input
                name="howToApplySub"
                defaultValue={values.howToApplySub}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-hairline pt-4">
          <p className="type-caption mb-3 font-semibold text-ink">Current Openings</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
            <input
              name="openingsHeading"
              defaultValue={values.openingsHeading}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </div>

        <div className="border-t border-hairline pt-4">
          <p className="type-caption mb-3 font-semibold text-ink">Apply Now</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
              <input
                name="applyHeading"
                defaultValue={values.applyHeading}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Sub-heading</label>
              <input
                name="applySub"
                defaultValue={values.applySub}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
          </div>
        </div>
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
