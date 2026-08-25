"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ImageUploadField } from "@/components/portal/ImageUploadField";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type HeroContentFormValues = {
  agencyLabelCycle: { id?: string; text: string }[];
  headlineTemplate: string;
  headlineCycleWords: { id?: string; word: string }[];
  tagline: string;
  mapImageUrl?: string;
  backgroundImageUrl?: string;
  status?: "draft" | "published";
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

export function HeroContentForm({
  action,
  values,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: HeroContentFormValues;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads.
   * English and Tamil are edited as two independent passes over the same
   * form (via LocaleTabs), not side-by-side fields. */
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
    const text = (key: string, label: string, original: string, sectionId: string) => {
      const after = String(fd.get(key) ?? "").trim();
      if (after !== (original ?? "")) {
        list.push({ id: key, label, detail: `"${truncate(original) || "(empty)"}" → "${truncate(after) || "(empty)"}"`, sectionId });
      }
    };
    const rows = (name: string, keys: string[], label: string, original: unknown[], sectionId: string) => {
      const after = reconstructRows(fd, name, keys);
      if (JSON.stringify(after) !== JSON.stringify(original.map((r) => { const { id: _id, ...rest } = r as Record<string, unknown>; return rest; }))) {
        list.push({ id: name, label, detail: `${original.length} → ${after.length} item${after.length === 1 ? "" : "s"}`, sectionId });
      }
    };

    rows("agencyLabelCycle", ["text"], "Agency name cycle", values.agencyLabelCycle, "section-agency");
    text("headlineTemplate", "Headline", values.headlineTemplate, "section-headline");
    rows("headlineCycleWords", ["word"], "Headline cycle words", values.headlineCycleWords, "section-words");
    text("tagline", "Tagline", values.tagline, "section-tagline");
    const mapImageFile = fd.get("mapImage") as File | null;
    if (mapImageFile && mapImageFile.size > 0) {
      list.push({ id: "mapImage", label: "Map image", detail: `New image selected (${mapImageFile.name})`, sectionId: "section-images" });
    }
    const backgroundImageFile = fd.get("backgroundImage") as File | null;
    if (backgroundImageFile && backgroundImageFile.size > 0) {
      list.push({ id: "backgroundImage", label: "Background image", detail: `New image selected (${backgroundImageFile.name})`, sectionId: "section-images" });
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
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="_loadedUpdatedAt" value={values.updatedAt ?? ""} />

      <section id="section-agency" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Agency name (cycles through each line shown)
        </label>
        <RepeatableRows
          name="agencyLabelCycle"
          fields={[{ key: "text", label: "Text" }]}
          initialRows={values.agencyLabelCycle}
          addLabel="+ Add line"
        />
      </section>

      <section id="section-headline" className="scroll-mt-6 flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Headline <span className="normal-case text-[11px]">(use {"{word}"} exactly once, where the animated word goes)</span>
          </label>
          <input
            name="headlineTemplate"
            defaultValue={values.headlineTemplate}
            required
            lang={locale === "ta" ? "ta" : undefined}
            placeholder="Powering Digital {word} in Tamil Nadu"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-words" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Words that cycle through {"{word}"}</label>
        <RepeatableRows
          name="headlineCycleWords"
          fields={[{ key: "word", label: "Word" }]}
          initialRows={values.headlineCycleWords}
          addLabel="+ Add word"
        />
      </section>

      <section id="section-tagline" className="scroll-mt-6 flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Tagline</label>
          <textarea
            name="tagline"
            defaultValue={values.tagline}
            required
            rows={2}
            lang={locale === "ta" ? "ta" : undefined}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-images" className="scroll-mt-6 flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div className="flex gap-6">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Map image <span className="normal-case text-[11px]">(the citizens-over-map collage beside the headline)</span>
            </label>
            <ImageUploadField name="mapImage" currentUrl={values.mapImageUrl} aspect="h-32 w-32" idealSize="Square-ish, at least 700 × 700px" required />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Background image <span className="normal-case text-[11px]">(optional — replaces the default colour wash)</span>
            </label>
            <ImageUploadField name="backgroundImage" currentUrl={values.backgroundImageUrl} aspect="h-32 w-56" idealSize="Wide, at least 1600 × 900px" />
          </div>
        </div>
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
