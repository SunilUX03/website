"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

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

export function AnnouncementForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: AnnouncementFormValues;
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
    const checkbox = (key: string, label: string, original: boolean) => {
      const after = fd.get(key) === "on";
      if (after !== original) {
        list.push({ id: key, label, detail: after ? "Turned on" : "Turned off", sectionId: "section-main" });
      }
    };
    const rows = (name: string, keys: string[], label: string, original: unknown[]) => {
      const after = reconstructRows(fd, name, keys);
      if (JSON.stringify(after) !== JSON.stringify(original)) {
        list.push({ id: name, label, detail: `${original.length} → ${after.length} item${after.length === 1 ? "" : "s"}`, sectionId: "section-main" });
      }
    };

    text("heading", "Heading", values.heading);
    text("date", "Date", values.date);
    text("category", "Category", values.category);
    text("description", "Short description", values.description);
    text("body", "Full body", values.body);
    const imageFile = fd.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      list.push({ id: "image", label: "Photo", detail: `New photo selected (${imageFile.name})`, sectionId: "section-main" });
    }
    rows("facts", ["label", "value"], "Facts", values.facts);
    rows("links", ["label", "href"], "Related links", values.links);
    checkbox("tickerFeatured", "Show in homepage ticker", values.tickerFeatured);
    text("tickerOrder", "Ticker priority", String(values.tickerOrder));

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
    <form ref={formRef} action={action} className="flex max-w-[720px] flex-col gap-6">
      <input ref={intentRef} type="hidden" name="intent" defaultValue="draft" />

      <section id="section-main" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
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

      <section id="section-facts" className="rounded-xl border border-hairline bg-surface-card p-5">
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

      <section id="section-links" className="rounded-xl border border-hairline bg-surface-card p-5">
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
        <button type="button" onClick={() => submitWithIntent("draft")} className="type-button btn-outline">
          Save draft
        </button>
        {values.status === "published" ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Unpublish this announcement? It will disappear from the live site.")) submitWithIntent("unpublish");
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
