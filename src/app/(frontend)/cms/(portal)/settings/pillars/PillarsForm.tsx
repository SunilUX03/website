"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";
import { ImageUploadField } from "@/components/portal/ImageUploadField";

const PILLAR_NAMES = ["Citizen Services", "Services to Government", "Initiatives & Projects"];

export type PillarValues = {
  id?: string;
  title: string;
  linkLabel: string;
  bannerImageUrl?: string;
};

export type PillarsFormValues = {
  eyebrow: string;
  heading: string;
  pillars: PillarValues[];
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

export function PillarsForm({
  action,
  values,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: PillarsFormValues;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads. */
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
    const photo = (key: string, label: string, sectionId: string) => {
      const file = fd.get(key) as File | null;
      if (file && file.size > 0) {
        list.push({ id: key, label, detail: `New image selected (${file.name})`, sectionId });
      }
    };
    text("eyebrow", "Section eyebrow", values.eyebrow, "section-heading");
    text("heading", "Section heading", values.heading, "section-heading");
    for (let i = 0; i < 3; i++) {
      const p = values.pillars[i];
      const sectionId = `section-pillar${i}`;
      text(`pillar${i}Title`, `Card ${i + 1} title`, p?.title ?? "", sectionId);
      text(`pillar${i}LinkLabel`, `Card ${i + 1} link label`, p?.linkLabel ?? "", sectionId);
      photo(`pillar${i}BannerImage`, `Card ${i + 1} banner image`, sectionId);
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

      <section id="section-heading" className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Eyebrow <span className="normal-case text-[11px]">(e.g. &quot;Enabling Digital Governance&quot;)</span>
          </label>
          <input
            name="eyebrow"
            defaultValue={values.eyebrow}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Heading <span className="normal-case text-[11px]">(e.g. &quot;How TNeGA powers governance across Tamil Nadu&quot;)</span>
          </label>
          <input
            name="heading"
            defaultValue={values.heading}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      {Array.from({ length: 3 }, (_, i) => values.pillars[i]).map((pillar, i) => (
        <section key={i} id={`section-pillar${i}`} className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">
            Card {i + 1} {PILLAR_NAMES[i] ? `— ${PILLAR_NAMES[i]}` : ""}
          </p>
          {pillar?.id ? <input type="hidden" name={`pillar${i}Id`} value={pillar.id} /> : null}
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Title</label>
            <input
              name={`pillar${i}Title`}
              defaultValue={pillar?.title ?? PILLAR_NAMES[i] ?? ""}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Link label <span className="normal-case text-[11px]">(e.g. &quot;View all Citizen Services&quot;)</span>
            </label>
            <input
              name={`pillar${i}LinkLabel`}
              defaultValue={pillar?.linkLabel ?? ""}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Banner image</label>
            <ImageUploadField name={`pillar${i}BannerImage`} currentUrl={pillar?.bannerImageUrl} aspect="h-24 w-40" />
          </div>
        </section>
      ))}

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
