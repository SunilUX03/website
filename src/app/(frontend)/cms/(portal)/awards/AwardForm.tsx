"use client";

import Image from "next/image";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export type AwardFormValues = {
  title: string;
  year: string;
  description: string;
  imageUrl?: string;
  status?: "draft" | "published";
  error?: string;
};

export function AwardForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: AwardFormValues;
}) {
  return (
    <form action={action} className="flex max-w-[560px] flex-col gap-6">
      {values.error ? (
        <p className="type-body-sm rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {values.error}
        </p>
      ) : null}

      <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
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
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
          <textarea
            name="description"
            defaultValue={values.description}
            required
            rows={4}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Image</label>
          {values.imageUrl ? (
            <div className="relative mb-2 h-24 w-32 overflow-hidden rounded-lg border border-hairline">
              <Image src={values.imageUrl} alt="" fill className="object-cover" />
            </div>
          ) : null}
          <input type="file" name="image" accept="image/*" className="type-body-sm block" />
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
            confirmMessage="Unpublish this award? It'll disappear from the live site."
            className="type-button btn-outline"
          >
            Unpublish
          </ConfirmSubmitButton>
        ) : (
          <ConfirmSubmitButton
            name="intent"
            value="publish"
            confirmMessage="Publish this award? It will go live immediately."
            className="type-button btn-primary"
          >
            Publish
          </ConfirmSubmitButton>
        )}
      </div>
    </form>
  );
}
