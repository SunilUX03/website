"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type ProjectSpotlightFormValues = {
  serviceName: string;
  serviceDescription: string;
  serviceImageUrl?: string;
  badge: string;
  order: number;
  stats: { id?: string; value: string; suffix: string; label: string }[];
  status?: "draft" | "published";
  error?: string;
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

export function ProjectSpotlightForm({
  action,
  values,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: ProjectSpotlightFormValues;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads. See
   * ServiceForm.tsx for the full explanation of this pattern. */
  locale?: "en" | "ta";
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
    const rows = (name: string, keys: string[], label: string, original: unknown[]) => {
      const after = reconstructRows(fd, name, keys);
      if (JSON.stringify(after) !== JSON.stringify(original)) {
        list.push({ id: name, label, detail: `${original.length} → ${after.length} item${after.length === 1 ? "" : "s"}`, sectionId: "section-main" });
      }
    };

    text("badge", "Badge", values.badge);
    text("order", "Order", String(values.order));
    rows("stats", ["value", "suffix", "label"], "Stats", values.stats.map((r) => ({ value: r.value, suffix: r.suffix, label: r.label })));
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
    <form ref={formRef} action={action} className="flex max-w-[640px] flex-col gap-6">
      <input ref={intentRef} type="hidden" name="intent" defaultValue="draft" />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="_loadedUpdatedAt" value={values.updatedAt ?? ""} />

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

      <section id="section-main" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
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

      <section id="section-stats" className="rounded-xl border border-hairline bg-surface-card p-5">
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

      <section id="section-ctas" className="rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">Buttons</p>
        <p className="type-body-sm text-[var(--color-body)]">
          The buttons on this card are the same ones shown on the Initiatives &amp; Projects page for this service
          (Access Portal / Avail Service / Coming Soon, and Know More). To change them, edit the service itself.
        </p>
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
