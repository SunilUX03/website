"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

const linkFields = [
  { key: "label", label: "Label" },
  { key: "href", label: "URL" },
  { key: "taLabel", label: "Label (Tamil)" },
];

export type NavContentFormValues = {
  govLabel: string;
  govLabelTa: string;
  about: { label: string; href: string; taLabel: string }[];
  services: { label: string; href: string; taLabel: string }[];
  notificationsUpdates: { label: string; href: string; taLabel: string }[];
  notificationsDocuments: { label: string; href: string; taLabel: string }[];
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

export function NavContentForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: NavContentFormValues;
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
    const rows = (name: string, label: string, original: unknown[], sectionId: string) => {
      const after = reconstructRows(fd, name, ["label", "href", "taLabel"]);
      if (JSON.stringify(after) !== JSON.stringify(original)) {
        list.push({ id: name, label, detail: `${original.length} → ${after.length} link${after.length === 1 ? "" : "s"}`, sectionId });
      }
    };

    text("govLabel", "Government link label", values.govLabel, "section-gov");
    text("govLabelTa", "Government link label (Tamil)", values.govLabelTa, "section-gov");
    rows("about", "About menu", values.about, "section-about");
    rows("services", "Services menu", values.services, "section-services");
    rows("notificationsUpdates", "Notifications — Updates column", values.notificationsUpdates, "section-notif-updates");
    rows("notificationsDocuments", "Notifications — Documents column", values.notificationsDocuments, "section-notif-documents");
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

      <section id="section-gov" className="scroll-mt-6 flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Government link label <span className="normal-case text-[11px]">(top bar, links to tn.gov.in)</span>
          </label>
          <input
            name="govLabel"
            defaultValue={values.govLabel}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Government link label (Tamil)</label>
          <input
            name="govLabelTa"
            defaultValue={values.govLabelTa}
            lang="ta"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-about" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">About menu</label>
        <RepeatableRows name="about" fields={linkFields} initialRows={values.about} addLabel="+ Add link" />
      </section>

      <section id="section-services" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Services menu</label>
        <RepeatableRows name="services" fields={linkFields} initialRows={values.services} addLabel="+ Add link" />
      </section>

      <section id="section-notif-updates" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Notifications menu — Updates column</label>
        <RepeatableRows name="notificationsUpdates" fields={linkFields} initialRows={values.notificationsUpdates} addLabel="+ Add link" />
      </section>

      <section id="section-notif-documents" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Notifications menu — Documents column</label>
        <RepeatableRows name="notificationsDocuments" fields={linkFields} initialRows={values.notificationsDocuments} addLabel="+ Add link" />
      </section>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => submitWithIntent("draft")} className="type-button btn-outline">
          Save draft
        </button>
        {values.status === "published" ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Unpublish? The header nav will revert to whatever was last published.")) submitWithIntent("unpublish");
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
