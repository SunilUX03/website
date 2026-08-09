"use client";

import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export type RollOfHonourFormValues = {
  designation: string;
  name: string;
  range: string;
  order: number;
  status?: "draft" | "published";
};

export function RollOfHonourForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: RollOfHonourFormValues;
}) {
  return (
    <form action={action} className="flex max-w-[560px] flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Designation</label>
          <input
            name="designation"
            defaultValue={values.designation}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Name <span className="normal-case text-[11px]">(leave blank if unknown)</span>
          </label>
          <input
            name="name"
            defaultValue={values.name}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Range <span className="normal-case text-[11px]">(e.g. &quot;July 2026 – Present&quot;)</span>
          </label>
          <input
            name="range"
            defaultValue={values.range}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div className="max-w-[160px]">
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Order <span className="normal-case text-[11px]">(0 = shows first/most recent)</span>
          </label>
          <input
            type="number"
            name="order"
            defaultValue={values.order}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
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
            confirmMessage="Unpublish this entry? It'll disappear from the live site."
            className="type-button btn-outline"
          >
            Unpublish
          </ConfirmSubmitButton>
        ) : (
          <ConfirmSubmitButton
            name="intent"
            value="publish"
            confirmMessage="Publish this entry? It will go live immediately."
            className="type-button btn-primary"
          >
            Publish
          </ConfirmSubmitButton>
        )}
      </div>
    </form>
  );
}
