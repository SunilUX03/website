"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";
import { ImageUploadField } from "@/components/portal/ImageUploadField";
import { DocumentUploadField } from "@/components/portal/DocumentUploadField";

export type AnnouncementDocumentValue = { id?: string; label: string; fileId?: number; fileName?: string; fileUrl?: string };

export type AnnouncementFormValues = {
  heading: string;
  date: string;
  description: string;
  category: string;
  body: string;
  imageUrl?: string;
  facts: { id?: string; label: string; value: string }[];
  links: { id?: string; label: string; href: string }[];
  documents: AnnouncementDocumentValue[];
  tickerFeatured: boolean;
  tickerOrder: number;
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

export function AnnouncementForm({
  action,
  values,
  error,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: AnnouncementFormValues;
  error?: string;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads. See
   * ServiceForm.tsx for the full explanation of this pattern. */
  locale?: "en" | "ta";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const intentRef = useRef<HTMLInputElement>(null);
  const [changes, setChanges] = useState<Change[] | null>(null);
  const [documentRows, setDocumentRows] = useState<AnnouncementDocumentValue[]>(values.documents);

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
    const checkbox = (key: string, label: string, original: boolean) => {
      const after = fd.get(key) === "on";
      if (after !== original) {
        list.push({ id: key, label, detail: after ? "Turned on" : "Turned off", sectionId: "section-main" });
      }
    };
    const rows = (name: string, keys: string[], label: string, original: unknown[]) => {
      const after = reconstructRows(fd, name, keys);
      if (JSON.stringify(after) !== JSON.stringify(original)) {
        list.push({ id: name, label, detail: `${original.length} → ${after.length} item${after.length === 1 ? "" : "s"}`, sectionId: "section-main" });
      }
    };

    text("heading", "Heading", values.heading);
    text("date", "Date", values.date);
    text("category", "Category", values.category);
    text("description", "Short description", values.description);
    text("body", "Full body", values.body);
    const imageFile = fd.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      list.push({ id: "image", label: "Photo", detail: `New photo selected (${imageFile.name})`, sectionId: "section-main" });
    }
    rows("facts", ["label", "value"], "Facts", values.facts.map((r) => ({ label: r.label, value: r.value })));
    rows("links", ["label", "href"], "Related links", values.links.map((r) => ({ label: r.label, href: r.href })));
    const docLabelsAfter = documentRows.map((_, i) => String(fd.get(`documents.${i}.label`) ?? "").trim());
    const docLabelsBefore = values.documents.map((d) => d.label);
    const anyNewDocFile = documentRows.some((_, i) => {
      const f = fd.get(`documents.${i}.file`) as File | null;
      return f && f.size > 0;
    });
    if (anyNewDocFile || JSON.stringify(docLabelsAfter) !== JSON.stringify(docLabelsBefore)) {
      list.push({
        id: "documents",
        label: "Documents",
        detail: `${values.documents.length} → ${documentRows.length} item${documentRows.length === 1 ? "" : "s"}`,
        sectionId: "section-main",
      });
    }
    checkbox("tickerFeatured", "Show in homepage ticker", values.tickerFeatured);
    text("tickerOrder", "Ticker priority", String(values.tickerOrder));

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
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="_loadedUpdatedAt" value={values.updatedAt ?? ""} />

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <section id="section-main" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
          <input
            name="heading"
            defaultValue={values.heading}
            required
            maxLength={140}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Date</label>
            <input
              type="date"
              name="date"
              defaultValue={values.date}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Category</label>
            <input
              name="category"
              defaultValue={values.category}
              placeholder="e.g. Service Launch"
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Short description <span className="normal-case text-[11px]">(shown on the card — max 200 characters)</span>
          </label>
          <textarea
            name="description"
            defaultValue={values.description}
            required
            maxLength={200}
            rows={3}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Photo (optional)</label>
          <ImageUploadField name="image" currentUrl={values.imageUrl} />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Full body <span className="normal-case text-[11px]">(shown on the announcement&apos;s own page — leave blank to show only the short description; separate paragraphs with a blank line)</span>
          </label>
          <textarea
            name="body"
            defaultValue={values.body}
            rows={8}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-facts" className="rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Facts <span className="normal-case text-[11px]">(optional &quot;at a glance&quot; figures)</span>
        </label>
        <RepeatableRows
          name="facts"
          fields={[{ key: "label", label: "Label" }, { key: "value", label: "Value" }]}
          initialRows={values.facts}
          addLabel="+ Add fact"
        />
      </section>

      <section id="section-links" className="rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Related links <span className="normal-case text-[11px]">(optional)</span>
        </label>
        <RepeatableRows
          name="links"
          fields={[{ key: "label", label: "Label" }, { key: "href", label: "URL" }]}
          initialRows={values.links}
          addLabel="+ Add link"
        />
      </section>

      <section id="section-documents" className="rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Documents <span className="normal-case text-[11px]">(optional — PDFs shown in a &quot;Documents&quot; box on the page)</span>
        </label>
        <div className="flex flex-col gap-4">
          {documentRows.map((row, i) => (
            <div key={row.id ?? `new-${i}`} className="flex items-end gap-3 rounded-lg border border-hairline p-3">
              <input type="hidden" name={`documents.${i}.id`} value={row.id ?? ""} />
              <div className="flex-1">
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Label</label>
                <input
                  name={`documents.${i}.label`}
                  defaultValue={row.label}
                  placeholder="e.g. Notification PDF"
                  className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
                />
              </div>
              <div className="w-56">
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">File</label>
                <DocumentUploadField name={`documents.${i}.file`} currentName={row.fileName} currentUrl={row.fileUrl} />
              </div>
              <button
                type="button"
                onClick={() => setDocumentRows((prev) => prev.filter((_, idx) => idx !== i))}
                className="type-button btn-outline h-9 shrink-0 px-3 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDocumentRows((prev) => [...prev, { label: "" }])}
          className="type-button btn-outline mt-3 h-9 px-3 text-xs"
        >
          + Add document
        </button>
      </section>

      <section className="rounded-xl border border-hairline bg-surface-card p-5">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="tickerFeatured" defaultChecked={values.tickerFeatured} />
          <span className="type-body-sm text-ink">Show in the homepage ticker</span>
        </label>
        <div className="mt-3 max-w-[200px]">
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Ticker priority <span className="normal-case text-[11px]">(lower shows first)</span>
          </label>
          <input
            type="number"
            name="tickerOrder"
            defaultValue={values.tickerOrder}
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
            submitWithIntent("publish");
          }}
        />
      ) : null}
    </form>
  );
}
