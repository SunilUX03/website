"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

const SOCIAL_PLATFORMS = ["Facebook", "X", "YouTube", "Instagram", "LinkedIn"] as const;
const linkFields = [
  { key: "label", label: "Label" },
  { key: "href", label: "URL" },
  { key: "taLabel", label: "Label (Tamil)" },
];

export type FooterContentFormValues = {
  description: string;
  descriptionTa: string;
  address: string;
  addressTa: string;
  phone: string;
  email: string;
  socialLinks: { label: string; href: string }[];
  quickLinks: { label: string; href: string; taLabel: string }[];
  citizenServices: { label: string; href: string; taLabel: string }[];
  helpSupport: { label: string; href: string; taLabel: string }[];
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

export function FooterContentForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: FooterContentFormValues;
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
    const rows = (name: string, label: string, original: unknown[], sectionId: string, keys: string[] = ["label", "href"]) => {
      const after = reconstructRows(fd, name, keys);
      if (JSON.stringify(after) !== JSON.stringify(original)) {
        list.push({ id: name, label, detail: `${original.length} → ${after.length} item${after.length === 1 ? "" : "s"}`, sectionId });
      }
    };

    text("description", "Description", values.description, "section-basics");
    text("descriptionTa", "Description (Tamil)", values.descriptionTa, "section-basics");
    text("address", "Address", values.address, "section-basics");
    text("addressTa", "Address (Tamil)", values.addressTa, "section-basics");
    text("phone", "Phone", values.phone, "section-basics");
    text("email", "Email", values.email, "section-basics");
    rows("socialLinks", "Social links", values.socialLinks, "section-social");
    rows("quickLinks", "Quick Links column", values.quickLinks, "section-quick", ["label", "href", "taLabel"]);
    rows("citizenServices", "Citizen Services column", values.citizenServices, "section-citizen", ["label", "href", "taLabel"]);
    rows("helpSupport", "Help & Support column", values.helpSupport, "section-help", ["label", "href", "taLabel"]);
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

      <section id="section-basics" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
          <input name="description" defaultValue={values.description} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description (Tamil)</label>
          <input name="descriptionTa" defaultValue={values.descriptionTa} lang="ta" className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Address</label>
          <textarea name="address" defaultValue={values.address} required rows={2} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Address (Tamil)</label>
          <textarea name="addressTa" defaultValue={values.addressTa} lang="ta" rows={2} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Phone</label>
            <input name="phone" defaultValue={values.phone} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Email</label>
            <input name="email" defaultValue={values.email} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
        </div>
      </section>

      <section id="section-social" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Social links</p>
        <div className="flex flex-col gap-2">
          {SOCIAL_PLATFORMS.map((platform, i) => {
            const existing = values.socialLinks.find((l) => l.label === platform);
            return (
              <div key={platform} className="flex items-center gap-2">
                <input type="hidden" name={`socialLinks.${i}.label`} value={platform} />
                <span className="type-body-sm w-24 shrink-0 text-ink">{platform}</span>
                <input
                  name={`socialLinks.${i}.href`}
                  defaultValue={existing?.href ?? ""}
                  placeholder="https://..."
                  className="flex-1 rounded-lg border border-hairline-strong bg-canvas px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-blue)]"
                />
              </div>
            );
          })}
        </div>
      </section>

      <section id="section-quick" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Quick Links column</label>
        <RepeatableRows name="quickLinks" fields={linkFields} initialRows={values.quickLinks} addLabel="+ Add link" />
      </section>

      <section id="section-citizen" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Citizen Services column</label>
        <RepeatableRows name="citizenServices" fields={linkFields} initialRows={values.citizenServices} addLabel="+ Add link" />
      </section>

      <section id="section-help" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Help & Support column</label>
        <RepeatableRows name="helpSupport" fields={linkFields} initialRows={values.helpSupport} addLabel="+ Add link" />
      </section>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => submitWithIntent("draft")} className="type-button btn-outline">
          Save draft
        </button>
        {values.status === "published" ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Unpublish? The footer will revert to whatever was last published.")) submitWithIntent("unpublish");
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
