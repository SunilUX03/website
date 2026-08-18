"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type GovernmentOrderFormValues = {
  title: string;
  year: string;
  department: string;
  fileUrl?: string;
  status?: "draft" | "published";
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

export function GovernmentOrderForm({
  action,
  values,
  error,
}: {
  action: (formData: FormData) => void;
  values: GovernmentOrderFormValues;
  error?: string;
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
    text("title", "Title / G.O. number", values.title);
    text("year", "Year", values.year);
    text("department", "Department", values.department);
    const fileInput = fd.get("file") as File | null;
    if (fileInput && fileInput.size > 0) {
      list.push({ id: "file", label: "PDF file", detail: `New file selected (${fileInput.name})`, sectionId: "section-main" });
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

      {error ? (
        <p className="type-body-sm rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <section id="section-main" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Title / G.O. number
          </label>
          <input
            name="title"
            defaultValue={values.title}
            required
            placeholder="e.g. G.O. (Ms).No. 2"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Year</label>
            <input
              name="year"
              defaultValue={values.year}
              required
              placeholder="2026"
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Department</label>
            <input
              name="department"
              defaultValue={values.department}
              required
              placeholder="IT&DS Department"
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">PDF file</label>
          {values.fileUrl ? (
            <a href={values.fileUrl} target="_blank" rel="noopener noreferrer" className="type-body-sm mb-2 block text-[var(--color-primary-blue)] underline">
              Current file
            </a>
          ) : null}
          <input type="file" name="file" accept="application/pdf" className="type-body-sm block" />
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
              if (window.confirm("Hide this from the public site?")) submitWithIntent("unpublish");
            }}
            className="type-button btn-outline"
          >
            Hide from public
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
