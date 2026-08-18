"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type TendersContentFormValues = {
  heroEyebrow: string;
  heroHeading: string;
  heroBody: string;
  portalHeading: string;
  portalSub: string;
  portalBody: string;
  portalCtaLabel: string;
  portalCtaHref: string;
  portalRedirectNote: string;
  status?: "draft" | "published";
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

export function TendersContentForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: TendersContentFormValues;
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
    text("heroEyebrow", "Hero eyebrow", values.heroEyebrow, "section-hero");
    text("heroHeading", "Hero heading", values.heroHeading, "section-hero");
    text("heroBody", "Hero body", values.heroBody, "section-hero");
    text("portalHeading", "Portal panel heading", values.portalHeading, "section-portal");
    text("portalSub", "Portal panel subheading", values.portalSub, "section-portal");
    text("portalBody", "Portal panel body", values.portalBody, "section-portal");
    text("portalCtaLabel", "Portal button text", values.portalCtaLabel, "section-portal");
    text("portalCtaHref", "Portal button link", values.portalCtaHref, "section-portal");
    text("portalRedirectNote", "Redirect note", values.portalRedirectNote, "section-portal");
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

      <section id="section-hero" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Hero</p>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow</label>
          <input name="heroEyebrow" defaultValue={values.heroEyebrow} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
          <input name="heroHeading" defaultValue={values.heroHeading} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
          <textarea name="heroBody" defaultValue={values.heroBody} required rows={3} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
      </section>

      <section id="section-portal" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Tender Portal Panel</p>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
          <input name="portalHeading" defaultValue={values.portalHeading} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Subheading</label>
          <input name="portalSub" defaultValue={values.portalSub} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
          <textarea name="portalBody" defaultValue={values.portalBody} required rows={3} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Button text</label>
          <input name="portalCtaLabel" defaultValue={values.portalCtaLabel} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Button link (external portal URL)</label>
          <input name="portalCtaHref" defaultValue={values.portalCtaHref} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Redirect note</label>
          <input name="portalRedirectNote" defaultValue={values.portalRedirectNote} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
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
              if (window.confirm("Unpublish? The Tenders page will revert to whatever was last published.")) submitWithIntent("unpublish");
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
