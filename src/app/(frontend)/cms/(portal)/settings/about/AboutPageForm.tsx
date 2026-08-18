"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type AboutPageFormValues = {
  heroEyebrow: string;
  heroHeadline: string;
  heroDescription: string;
  whoWeAreHeading: string;
  whoWeAreParagraph: string;
  hierarchy: { label: string; emphasized: string }[];
  visionMission: { label: string; title: string; description: string }[];
  connectEmail: string;
  connectSocial: { label: string; href: string }[];
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

export function AboutPageForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: AboutPageFormValues;
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
      if (JSON.stringify(after) !== JSON.stringify(original)) {
        list.push({ id: name, label, detail: `${original.length} → ${after.length} item${after.length === 1 ? "" : "s"}`, sectionId });
      }
    };

    text("heroEyebrow", "Hero eyebrow", values.heroEyebrow, "section-hero");
    text("heroHeadline", "Hero headline", values.heroHeadline, "section-hero");
    text("heroDescription", "Hero description", values.heroDescription, "section-hero");
    text("whoWeAreHeading", "Who We Are heading", values.whoWeAreHeading, "section-who");
    text("whoWeAreParagraph", "Who We Are paragraph", values.whoWeAreParagraph, "section-who");
    rows("hierarchy", ["label", "emphasized"], "Reporting-line boxes", values.hierarchy, "section-hierarchy");
    rows("visionMission", ["label", "title", "description"], "Vision & Mission", values.visionMission, "section-vision");
    text("connectEmail", "Connect email", values.connectEmail, "section-connect");
    rows("connectSocial", ["label", "href"], "Social links", values.connectSocial, "section-connect");
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
          <input
            name="heroEyebrow"
            defaultValue={values.heroEyebrow}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Headline</label>
          <input
            name="heroHeadline"
            defaultValue={values.heroHeadline}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
          <textarea
            name="heroDescription"
            defaultValue={values.heroDescription}
            required
            rows={4}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-who" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Who We Are</p>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
          <input
            name="whoWeAreHeading"
            defaultValue={values.whoWeAreHeading}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Paragraph</label>
          <textarea
            name="whoWeAreParagraph"
            defaultValue={values.whoWeAreParagraph}
            required
            rows={4}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-hierarchy" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Reporting-line boxes <span className="normal-case text-[11px]">(top to bottom; check &quot;Emphasized&quot; to highlight TNeGA itself)</span>
        </label>
        <RepeatableRows
          name="hierarchy"
          fields={[
            { key: "label", label: "Label" },
            { key: "emphasized", label: "Emphasized", checkbox: true },
          ]}
          initialRows={values.hierarchy}
          addLabel="+ Add box"
        />
      </section>

      <section id="section-vision" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Vision &amp; Mission <span className="normal-case text-[11px]">(normally exactly two cards)</span>
        </label>
        <RepeatableRows
          name="visionMission"
          fields={[
            { key: "label", label: "Label (e.g. Vision)" },
            { key: "title", label: "Title" },
            { key: "description", label: "Description", textarea: true },
          ]}
          initialRows={values.visionMission}
          addLabel="+ Add card"
        />
      </section>

      <section id="section-connect" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Connect With Us</p>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Email</label>
          <input
            name="connectEmail"
            type="email"
            defaultValue={values.connectEmail}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Social links</label>
          <RepeatableRows
            name="connectSocial"
            fields={[
              { key: "label", label: "Label (e.g. Facebook)" },
              { key: "href", label: "URL" },
            ]}
            initialRows={values.connectSocial}
            addLabel="+ Add social link"
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
              if (window.confirm("Unpublish? The About page will revert to whatever was last published.")) submitWithIntent("unpublish");
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
