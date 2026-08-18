"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

const PILLAR_NAMES = ["Citizen Services", "Services to Government", "Initiatives & Projects"];

export type PillarValues = {
  title: string;
  description: string;
  linkLabel: string;
  bannerImageUrl?: string;
};

export type PillarsFormValues = {
  pillars: PillarValues[];
  status?: "draft" | "published";
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

export function PillarsForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: PillarsFormValues;
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
    for (let i = 0; i < 3; i++) {
      const p = values.pillars[i];
      const sectionId = `section-pillar${i}`;
      text(`pillar${i}Title`, `Card ${i + 1} title`, p?.title ?? "", sectionId);
      text(`pillar${i}Description`, `Card ${i + 1} description`, p?.description ?? "", sectionId);
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

      {Array.from({ length: 3 }, (_, i) => values.pillars[i]).map((pillar, i) => (
        <section key={i} id={`section-pillar${i}`} className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">
            Card {i + 1} {PILLAR_NAMES[i] ? `— ${PILLAR_NAMES[i]}` : ""}
          </p>
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
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
            <textarea
              name={`pillar${i}Description`}
              defaultValue={pillar?.description ?? ""}
              required
              rows={3}
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
            {pillar?.bannerImageUrl ? (
              <div className="relative mb-2 h-24 w-40 overflow-hidden rounded-lg border border-hairline">
                <Image src={pillar.bannerImageUrl} alt="" fill className="object-cover" />
              </div>
            ) : null}
            <input type="file" name={`pillar${i}BannerImage`} accept="image/*" className="type-body-sm block" />
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
              if (window.confirm("Unpublish? These cards will revert to whatever was last published.")) submitWithIntent("unpublish");
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
