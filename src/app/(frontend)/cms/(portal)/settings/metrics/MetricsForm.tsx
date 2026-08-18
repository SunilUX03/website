"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type MetricValues = {
  label: string;
  value: number | string;
  decimals: number | string;
  prefix: string;
  suffix: string;
};

export type MetricsFormValues = {
  metrics: MetricValues[];
  status?: "draft" | "published";
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

export function MetricsForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: MetricsFormValues;
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
    const text = (key: string, label: string, original: string, sectionId: string) => {
      const after = String(fd.get(key) ?? "").trim();
      if (after !== (original ?? "")) {
        list.push({ id: key, label, detail: `"${truncate(original) || "(empty)"}" → "${truncate(after) || "(empty)"}"`, sectionId });
      }
    };
    for (let i = 0; i < 6; i++) {
      const m = values.metrics[i];
      const sectionId = `section-metric${i}`;
      text(`metric${i}Label`, `Metric ${i + 1} label`, m?.label ?? "", sectionId);
      text(`metric${i}Value`, `Metric ${i + 1} value`, String(m?.value ?? ""), sectionId);
      text(`metric${i}Decimals`, `Metric ${i + 1} decimals`, String(m?.decimals ?? ""), sectionId);
      text(`metric${i}Prefix`, `Metric ${i + 1} prefix`, m?.prefix ?? "", sectionId);
      text(`metric${i}Suffix`, `Metric ${i + 1} suffix`, m?.suffix ?? "", sectionId);
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
    <form ref={formRef} action={action} className="flex max-w-[680px] flex-col gap-6">
      <input ref={intentRef} type="hidden" name="intent" defaultValue="draft" />

      {Array.from({ length: 6 }, (_, i) => values.metrics[i]).map((metric, i) => (
        <section key={i} id={`section-metric${i}`} className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Metric {i + 1}</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Label</label>
            <input
              name={`metric${i}Label`}
              defaultValue={metric?.label ?? ""}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Value</label>
              <input
                type="number"
                step="any"
                name={`metric${i}Value`}
                defaultValue={metric?.value}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Decimals</label>
              <input
                type="number"
                name={`metric${i}Decimals`}
                defaultValue={metric?.decimals ?? ""}
                placeholder="0"
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Prefix</label>
              <input
                name={`metric${i}Prefix`}
                defaultValue={metric?.prefix ?? ""}
                placeholder="₹"
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Suffix</label>
              <input
                name={`metric${i}Suffix`}
                defaultValue={metric?.suffix ?? ""}
                placeholder="+ Cr"
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => submitWithIntent("draft")} className="type-button btn-outline">
          Save draft
        </button>
        {values.status === "published" ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Unpublish? These metrics will revert to whatever was last published.")) submitWithIntent("unpublish");
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
