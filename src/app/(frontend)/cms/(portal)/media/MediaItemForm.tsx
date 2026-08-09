"use client";

import Image from "next/image";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export type MediaItemFormValues = {
  type: "photo" | "video";
  caption: string;
  altText: string;
  date: string;
  imageUrl?: string;
  status?: "draft" | "published";
};

export function MediaItemForm({
  action,
  values,
  error,
}: {
  action: (formData: FormData) => void;
  values: MediaItemFormValues;
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
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Type</label>
          <select
            name="type"
            defaultValue={values.type}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          >
            <option value="photo">Photo</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Caption</label>
          <input
            name="caption"
            defaultValue={values.caption}
            required
            maxLength={140}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Alt text <span className="normal-case text-[11px]">(accessibility description — falls back to caption)</span>
          </label>
          <input
            name="altText"
            defaultValue={values.altText}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

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
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Photo / thumbnail</label>
          {values.imageUrl ? (
            <div className="relative mb-2 h-32 w-52 overflow-hidden rounded-lg border border-hairline">
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
            confirmMessage="Unpublish this item? It will disappear from the live site."
            className="type-button btn-outline"
          >
            Unpublish
          </ConfirmSubmitButton>
        ) : (
          <ConfirmSubmitButton
            name="intent"
            value="publish"
            confirmMessage="Publish this item? It will go live on the public site immediately."
            className="type-button btn-primary"
          >
            Publish
          </ConfirmSubmitButton>
        )}
      </div>
    </form>
  );
}
