"use client";

import Image from "next/image";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export type ProjectSpotlightFormValues = {
  serviceName: string;
  serviceDescription: string;
  serviceImageUrl?: string;
  badge: string;
  order: number;
  stats: { value: string; suffix: string; label: string }[];
  ctas: { label: string; href: string }[];
  status?: "draft" | "published";
  error?: string;
};

export function ProjectSpotlightForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: ProjectSpotlightFormValues;
}) {
  return (
    <form action={action} className="flex max-w-[640px] flex-col gap-6">
      {values.error ? (
        <p className="type-body-sm rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {values.error}
        </p>
      ) : null}

      <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">
          Linked service <span className="normal-case text-[11px]">(from the Services collection — delete this entry and re-add to change it)</span>
        </p>
        <div className="flex items-center gap-4">
          {values.serviceImageUrl ? (
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-hairline">
              <Image src={values.serviceImageUrl} alt="" fill className="object-cover" />
            </div>
          ) : null}
          <div>
            <p className="type-body-strong text-ink">{values.serviceName}</p>
            <p className="type-caption line-clamp-2 text-[var(--color-muted)]">{values.serviceDescription}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Badge <span className="normal-case text-[11px]">(optional, e.g. &quot;MeitY Approved&quot;)</span>
          </label>
          <input
            name="badge"
            defaultValue={values.badge}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div className="max-w-[160px]">
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Order <span className="normal-case text-[11px]">(0 = shows first)</span>
          </label>
          <input
            type="number"
            name="order"
            defaultValue={values.order}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section className="rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Stats <span className="normal-case text-[11px]">(the numbers shown on the card, e.g. &quot;410 Services&quot;)</span>
        </label>
        <RepeatableRows
          name="stats"
          fields={[
            { key: "value", label: "Value" },
            { key: "suffix", label: "Suffix (e.g. Crore+)" },
            { key: "label", label: "Label" },
          ]}
          initialRows={values.stats}
          addLabel="+ Add stat"
        />
      </section>

      <section className="rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Buttons <span className="normal-case text-[11px]">(e.g. &quot;Login to Portal&quot; / &quot;Know more&quot;)</span>
        </label>
        <RepeatableRows
          name="ctas"
          fields={[
            { key: "label", label: "Button text" },
            { key: "href", label: "Link" },
          ]}
          initialRows={values.ctas}
          addLabel="+ Add button"
        />
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" name="intent" value="draft" className="type-button btn-outline">
          Save draft
        </button>
        {values.status === "published" ? (
          <ConfirmSubmitButton
            name="intent"
            value="unpublish"
            confirmMessage="Unpublish this project? It'll disappear from the homepage carousel."
            className="type-button btn-outline"
          >
            Unpublish
          </ConfirmSubmitButton>
        ) : (
          <ConfirmSubmitButton
            name="intent"
            value="publish"
            confirmMessage="Publish this project? It will go live immediately."
            className="type-button btn-primary"
          >
            Publish
          </ConfirmSubmitButton>
        )}
      </div>
    </form>
  );
}
