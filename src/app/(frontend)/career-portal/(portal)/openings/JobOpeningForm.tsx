"use client";

import { useRef, useState } from "react";
import { DocumentUploadField } from "@/components/portal/DocumentUploadField";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type JobOpeningFormValues = {
  role: string;
  type: string;
  department: string;
  deadline: string;
  jdName?: string;
  jdUrl?: string;
  status?: "draft" | "published";
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

export function JobOpeningForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: JobOpeningFormValues;
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
    const text = (key: keyof JobOpeningFormValues, label: string, original: string) => {
      const after = String(fd.get(key) ?? "").trim();
      if (after !== (original ?? "")) {
        list.push({ id: key, label, detail: `"${truncate(original) || "(empty)"}" → "${truncate(after) || "(empty)"}"`, sectionId: "section-main" });
      }
    };
    text("role", "Role", values.role);
    text("type", "Type", values.type);
    text("department", "Department", values.department);
    text("deadline", "Deadline", values.deadline);
    const jdFile = fd.get("jd") as File | null;
    if (jdFile && jdFile.size > 0) {
      list.push({ id: "jd", label: "Job description PDF", detail: `New file selected (${jdFile.name})`, sectionId: "section-main" });
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

      <section id="section-main" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Role</label>
          <input
            name="role"
            defaultValue={values.role}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Type</label>
            <input
              name="type"
              defaultValue={values.type}
              placeholder="Contract"
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Department</label>
            <input
              name="department"
              defaultValue={values.department}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Deadline</label>
          <input
            type="date"
            name="deadline"
            defaultValue={values.deadline}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Job description <span className="normal-case text-[11px]">(optional — leave blank to hide the Download JD button)</span>
          </label>
          <DocumentUploadField name="jd" currentName={values.jdName} currentUrl={values.jdUrl} />
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
              if (window.confirm("Unpublish this opening? It will disappear from the live site.")) submitWithIntent("unpublish");
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
