"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type LeadershipBandFormValues = {
  description: string;
  leader1Name: string;
  leader1Title: string;
  leader1PhotoUrl?: string;
  leader1PhotoPosition: string;
  leader2Name: string;
  leader2Title: string;
  leader2PhotoUrl?: string;
  leader2PhotoPosition: string;
  status?: "draft" | "published";
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

export function LeadershipBandForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: LeadershipBandFormValues;
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
        list.push({ id: key, label, detail: `New photo selected (${file.name})`, sectionId });
      }
    };

    text("description", "Description", values.description, "section-description");
    text("leader1Name", "Leader 1 name", values.leader1Name, "section-leader1");
    text("leader1Title", "Leader 1 title", values.leader1Title, "section-leader1");
    photo("leader1Photo", "Leader 1 photo", "section-leader1");
    text("leader1PhotoPosition", "Leader 1 photo position", values.leader1PhotoPosition, "section-leader1");
    text("leader2Name", "Leader 2 name", values.leader2Name, "section-leader2");
    text("leader2Title", "Leader 2 title", values.leader2Title, "section-leader2");
    photo("leader2Photo", "Leader 2 photo", "section-leader2");
    text("leader2PhotoPosition", "Leader 2 photo position", values.leader2PhotoPosition, "section-leader2");
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

      <section id="section-description" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
        <textarea
          name="description"
          defaultValue={values.description}
          required
          rows={3}
          className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
        />
      </section>

      {[
        { index: 1, name: values.leader1Name, title: values.leader1Title, photoUrl: values.leader1PhotoUrl, photoPosition: values.leader1PhotoPosition, heading: "Leader 1 (larger signature)" },
        { index: 2, name: values.leader2Name, title: values.leader2Title, photoUrl: values.leader2PhotoUrl, photoPosition: values.leader2PhotoPosition, heading: "Leader 2 (smaller signature)" },
      ].map(({ index, name, title, photoUrl, photoPosition, heading }) => (
        <section key={index} id={`section-leader${index}`} className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">{heading}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Name</label>
              <input
                name={`leader${index}Name`}
                defaultValue={name}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Title</label>
              <input
                name={`leader${index}Title`}
                defaultValue={title}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Photo</label>
            {photoUrl ? (
              <div className="relative mb-2 h-24 w-24 overflow-hidden rounded-full border border-hairline">
                <Image src={photoUrl} alt="" fill className="object-cover" />
              </div>
            ) : null}
            <input type="file" name={`leader${index}Photo`} accept="image/*" className="type-body-sm block" />
          </div>
          <div className="max-w-[200px]">
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Photo position <span className="normal-case text-[11px]">(e.g. &quot;50% 20%&quot;)</span>
            </label>
            <input
              name={`leader${index}PhotoPosition`}
              defaultValue={photoPosition}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
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
              if (window.confirm("Unpublish? This band will revert to whatever was last published.")) submitWithIntent("unpublish");
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
