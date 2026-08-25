"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";
import { ImageUploadField } from "@/components/portal/ImageUploadField";

const MAX_DESCRIPTION_WORDS = 35;

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export type AwardFormValues = {
  title: string;
  year: string;
  description: string;
  imageUrl?: string;
  status?: "draft" | "published";
  error?: string;
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

export function AwardForm({
  action,
  values,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: AwardFormValues;
  locale?: "en" | "ta";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const intentRef = useRef<HTMLInputElement>(null);
  const [changes, setChanges] = useState<Change[] | null>(null);
  const [descriptionWords, setDescriptionWords] = useState(() => countWords(values.description));

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
    text("title", "Title", values.title);
    text("year", "Year", values.year);
    text("description", "Description", values.description);
    const imageFile = fd.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      list.push({ id: "image", label: "Image", detail: `New image selected (${imageFile.name})`, sectionId: "section-main" });
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
    <form ref={formRef} action={action} className="flex max-w-[560px] flex-col gap-6">
      <input ref={intentRef} type="hidden" name="intent" defaultValue="draft" />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="_loadedUpdatedAt" value={values.updatedAt ?? ""} />

      {values.error ? (
        <p className="type-body-sm rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {values.error}
        </p>
      ) : null}

      <section id="section-main" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Title</label>
          <input
            name="title"
            defaultValue={values.title}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div className="max-w-[160px]">
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Year</label>
          <input
            name="year"
            defaultValue={values.year}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label className="type-caption-uppercase block text-[var(--color-muted)]">Description</label>
            <span className={`type-caption ${descriptionWords > MAX_DESCRIPTION_WORDS ? "text-[var(--color-error)]" : "text-[var(--color-muted)]"}`}>
              {descriptionWords}/{MAX_DESCRIPTION_WORDS} words
            </span>
          </div>
          <textarea
            name="description"
            defaultValue={values.description}
            onChange={(e) => setDescriptionWords(countWords(e.target.value))}
            required
            rows={4}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Image</label>
          <ImageUploadField name="image" currentUrl={values.imageUrl} aspect="h-24 w-32" idealSize="800 × 600px (4:3)" />
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
