"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

const HEROES = [
  { key: "announcementsHero", label: "Announcements page hero" },
  { key: "governmentOrdersHero", label: "Government Orders page hero" },
  { key: "policiesHero", label: "Policies & Guidelines page hero" },
  { key: "mediaHero", label: "Media & Press page hero" },
  { key: "servicesHero", label: "Services page hero" },
] as const;

const PANEL_NAMES = ["Reach Us panel", "Current Openings panel"];

export type HeroCopy = { eyebrow: string; heading: string; body: string };
export type PanelCopy = { eyebrow: string; title: string; description: string; ctaLabel: string };

export type SiteCopyFormValues = {
  announcementsHero: HeroCopy;
  governmentOrdersHero: HeroCopy;
  policiesHero: HeroCopy;
  mediaHero: HeroCopy;
  servicesHero: HeroCopy;
  reachUsPanels: PanelCopy[];
  status?: "draft" | "published";
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

export function SiteCopyForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: SiteCopyFormValues;
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

    for (const { key, label } of HEROES) {
      const hero = values[key];
      text(`${key}Eyebrow`, `${label} — eyebrow`, hero.eyebrow, `section-${key}`);
      text(`${key}Heading`, `${label} — heading`, hero.heading, `section-${key}`);
      text(`${key}Body`, `${label} — body`, hero.body, `section-${key}`);
    }

    for (let i = 0; i < 2; i++) {
      const p = values.reachUsPanels[i];
      const sectionId = `section-panel${i}`;
      text(`panel${i}Eyebrow`, `${PANEL_NAMES[i]} — eyebrow`, p?.eyebrow ?? "", sectionId);
      text(`panel${i}Title`, `${PANEL_NAMES[i]} — title`, p?.title ?? "", sectionId);
      text(`panel${i}Description`, `${PANEL_NAMES[i]} — description`, p?.description ?? "", sectionId);
      text(`panel${i}CtaLabel`, `${PANEL_NAMES[i]} — button text`, p?.ctaLabel ?? "", sectionId);
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

      {HEROES.map(({ key, label }) => {
        const hero = values[key];
        return (
          <section key={key} id={`section-${key}`} className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
            <p className="type-caption-uppercase text-[var(--color-muted)]">{label}</p>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow</label>
              <input name={`${key}Eyebrow`} defaultValue={hero.eyebrow} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
              <input name={`${key}Heading`} defaultValue={hero.heading} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
              <textarea name={`${key}Body`} defaultValue={hero.body} required rows={2} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
          </section>
        );
      })}

      {Array.from({ length: 2 }, (_, i) => values.reachUsPanels[i]).map((panel, i) => (
        <section key={i} id={`section-panel${i}`} className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Homepage — {PANEL_NAMES[i]}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow</label>
              <input name={`panel${i}Eyebrow`} defaultValue={panel?.eyebrow ?? ""} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Title</label>
              <input name={`panel${i}Title`} defaultValue={panel?.title ?? ""} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
            <textarea name={`panel${i}Description`} defaultValue={panel?.description ?? ""} required rows={2} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div className="max-w-[240px]">
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Button text</label>
            <input name={`panel${i}CtaLabel`} defaultValue={panel?.ctaLabel ?? ""} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
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
              if (window.confirm("Unpublish? These pages will revert to whatever was last published.")) submitWithIntent("unpublish");
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
