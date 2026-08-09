"use client";

import Image from "next/image";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export type AnnouncementFormValues = {
  heading: string;
  date: string;
  description: string;
  category: string;
  body: string;
  imageUrl?: string;
  facts: { label: string; value: string }[];
  links: { label: string; href: string }[];
  tickerFeatured: boolean;
  tickerOrder: number;
  status?: "draft" | "published";
};

export function AnnouncementForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: AnnouncementFormValues;
}) {
  return (
    <form action={action} className="flex max-w-[720px] flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
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
          {values.imageUrl ? (
            <div className="relative mb-2 h-32 w-52 overflow-hidden rounded-lg border border-hairline">
              <Image src={values.imageUrl} alt="" fill className="object-cover" />
            </div>
          ) : null}
          <input type="file" name="image" accept="image/*" className="type-body-sm block" />
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

      <section className="rounded-xl border border-hairline bg-surface-card p-5">
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

      <section className="rounded-xl border border-hairline bg-surface-card p-5">
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

      <div className="flex items-center gap-3">
        <button type="submit" name="intent" value="draft" className="type-button btn-outline">
          Save draft
        </button>
        {values.status === "published" ? (
          <ConfirmSubmitButton
            name="intent"
            value="unpublish"
            confirmMessage="Unpublish this announcement? It will disappear from the live site."
            className="type-button btn-outline"
          >
            Unpublish
          </ConfirmSubmitButton>
        ) : (
          <ConfirmSubmitButton
            name="intent"
            value="publish"
            confirmMessage="Publish this announcement? It will go live on the public site immediately."
            className="type-button btn-primary"
          >
            Publish
          </ConfirmSubmitButton>
        )}
      </div>
    </form>
  );
}
