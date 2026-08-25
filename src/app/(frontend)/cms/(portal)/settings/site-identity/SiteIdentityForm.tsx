"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";
import { ImageUploadField } from "@/components/portal/ImageUploadField";

export type SiteIdentityFormValues = {
  emblemImageUrl?: string;
  markImageUrl?: string;
  faviconImageUrl?: string;
  nameTamil: string;
  nameEnglish: string;
  /** The document's `updatedAt` as of this page load — round-tripped
   * through a hidden field so the server action can detect a save based
   * on stale data and refuse it instead of silently overwriting. */
  updatedAt?: string;
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

export function SiteIdentityForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: SiteIdentityFormValues;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [changes, setChanges] = useState<Change[] | null>(null);

  function computeChanges(fd: FormData): Change[] {
    const list: Change[] = [];
    const text = (key: string, label: string, original: string) => {
      const after = String(fd.get(key) ?? "").trim();
      if (after !== (original ?? "")) {
        list.push({ id: key, label, detail: `"${truncate(original) || "(empty)"}" → "${truncate(after) || "(empty)"}"`, sectionId: "section-main" });
      }
    };
    text("nameTamil", "Tamil name", values.nameTamil);
    text("nameEnglish", "English name", values.nameEnglish);
    const emblemFile = fd.get("emblemImage") as File | null;
    if (emblemFile && emblemFile.size > 0) {
      list.push({ id: "emblemImage", label: "Emblem", detail: `New image selected (${emblemFile.name})`, sectionId: "section-main" });
    }
    const markFile = fd.get("markImage") as File | null;
    if (markFile && markFile.size > 0) {
      list.push({ id: "markImage", label: "Mark", detail: `New image selected (${markFile.name})`, sectionId: "section-main" });
    }
    const faviconFile = fd.get("faviconImage") as File | null;
    if (faviconFile && faviconFile.size > 0) {
      list.push({ id: "faviconImage", label: "Favicon", detail: `New image selected (${faviconFile.name})`, sectionId: "section-main" });
    }
    return list;
  }

  function handleUpdateClick() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const detected = computeChanges(fd);
    if (detected.length === 0) {
      formRef.current.requestSubmit();
      return;
    }
    setChanges(detected);
  }

  return (
    <form ref={formRef} action={action} className="flex max-w-[560px] flex-col gap-6">
      <input type="hidden" name="_loadedUpdatedAt" value={values.updatedAt ?? ""} />

      <section id="section-main" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div className="flex gap-6">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Government emblem</label>
            <ImageUploadField name="emblemImage" currentUrl={values.emblemImageUrl} aspect="h-24 w-24" idealSize="Square, at least 200 × 200px" required />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">TNeGA mark</label>
            <ImageUploadField name="markImage" currentUrl={values.markImageUrl} aspect="h-24 w-24" idealSize="Square, at least 200 × 200px" required />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Favicon <span className="normal-case text-[11px]">(browser tab icon)</span>
            </label>
            <ImageUploadField name="faviconImage" currentUrl={values.faviconImageUrl} aspect="h-24 w-24" idealSize="Square, at least 64 × 64px" />
            <p className="type-caption mt-1.5 max-w-[150px] text-[var(--color-muted)]">Falls back to the TNeGA mark if left empty.</p>
          </div>
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Tamil name <span className="normal-case text-[11px]">(always shown alongside the English name)</span>
          </label>
          <input
            name="nameTamil"
            defaultValue={values.nameTamil}
            required
            lang="ta"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            English name <span className="normal-case text-[11px]">(always shown alongside the Tamil name)</span>
          </label>
          <input
            name="nameEnglish"
            defaultValue={values.nameEnglish}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
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
            formRef.current?.requestSubmit();
          }}
        />
      ) : null}
    </form>
  );
}
