"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";
import { ImageUploadField } from "@/components/portal/ImageUploadField";

export type CitizenServiceFormValues = {
  name: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  externalLink: boolean;
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

export function CitizenServiceForm({
  action,
  values,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: CitizenServiceFormValues;
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
    text("name", "Name", values.name);
    text("description", "Description", values.description);
    text("buttonLabel", "Button text", values.buttonLabel);
    text("buttonHref", "Button link", values.buttonHref);
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
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Name <span className="normal-case text-[11px]">(shown as the card heading)</span>
          </label>
          <input
            name="name"
            defaultValue={values.name}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
          <textarea
            name="description"
            defaultValue={values.description}
            required
            rows={3}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Image</label>
          <ImageUploadField name="image" currentUrl={values.imageUrl} aspect="h-24 w-40" idealSize="1200 × 675px (16:9)" />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Button text <span className="normal-case text-[11px]">(leave blank to use the automatic &quot;Open {"{name}"}&quot;)</span>
          </label>
          <input
            name="buttonLabel"
            defaultValue={values.buttonLabel}
            placeholder={`Open ${values.name || "..."}`}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Button link <span className="normal-case text-[11px]">(where the button goes, e.g. the portal's URL)</span>
          </label>
          <input
            name="buttonHref"
            defaultValue={values.buttonHref}
            required
            placeholder="https://..."
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="externalLink" defaultChecked={values.externalLink} />
          Opens in a new tab (leave checked for an external portal — the button also gets a small redirection arrow)
        </label>
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
