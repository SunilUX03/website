"use client";

import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export type PolicyFormValues = {
  title: string;
  year: string;
  category: string;
  fileUrl?: string;
  status?: "draft" | "published";
};

export function PolicyForm({
  action,
  values,
  error,
}: {
  action: (formData: FormData) => void;
  values: PolicyFormValues;
  error?: string;
}) {
  return (
    <form action={action} className="flex max-w-[560px] flex-col gap-6">
      {error ? (
        <p className="type-body-sm rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Title</label>
          <input
            name="title"
            defaultValue={values.title}
            required
            placeholder="e.g. Cyber Security Policy 2020"
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
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Category</label>
            <input
              name="category"
              defaultValue={values.category}
              required
              placeholder="Cyber Security"
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
        <button type="submit" name="intent" value="draft" className="type-button btn-outline">
          Save draft
        </button>
        {values.status === "published" ? (
          <ConfirmSubmitButton
            name="intent"
            value="unpublish"
            confirmMessage="Hide this from the public site?"
            className="type-button btn-outline"
          >
            Hide from public
          </ConfirmSubmitButton>
        ) : (
          <ConfirmSubmitButton
            name="intent"
            value="publish"
            confirmMessage="Publish this? It will appear on the public site immediately."
            className="type-button btn-primary"
          >
            Publish
          </ConfirmSubmitButton>
        )}
      </div>
    </form>
  );
}
