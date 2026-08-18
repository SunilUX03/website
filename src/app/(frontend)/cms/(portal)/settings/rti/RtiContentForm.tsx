"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

const CONTACT_NAMES = ["Appellate Authority", "Public Information Officer"];

export type RtiContact = {
  badge: string;
  tone: string;
  name: string;
  designation: string;
  detailsText: string;
};

export type RtiContentFormValues = {
  heroEyebrow: string;
  heroHeading: string;
  heroBody: string;
  contacts: RtiContact[];
  disclosures: { sno: string; item: string; rowsText: string }[];
  fileHeading: string;
  fileSub: string;
  fileBody: string;
  fileCtaLabel: string;
  fileCtaHref: string;
  fileRedirectNote: string;
  fileEmail: string;
  filePhone: string;
  filePhoneHref: string;
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

export function RtiContentForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: RtiContentFormValues;
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

    for (let i = 0; i < 2; i++) {
      const c = values.contacts[i];
      const sectionId = `section-contact${i}`;
      text(`contact${i}Badge`, `Contact ${i + 1} badge text`, c?.badge ?? "", sectionId);
      text(`contact${i}Tone`, `Contact ${i + 1} badge style`, c?.tone ?? "", sectionId);
      text(`contact${i}Name`, `Contact ${i + 1} name`, c?.name ?? "", sectionId);
      text(`contact${i}Designation`, `Contact ${i + 1} designation`, c?.designation ?? "", sectionId);
      text(`contact${i}DetailsText`, `Contact ${i + 1} details`, c?.detailsText ?? "", sectionId);
    }

    const afterDisclosures = reconstructRows(fd, "disclosures", ["sno", "item", "rowsText"]);
    if (JSON.stringify(afterDisclosures) !== JSON.stringify(values.disclosures)) {
      list.push({ id: "disclosures", label: "Section 4(1)(b) disclosures", detail: `${values.disclosures.length} → ${afterDisclosures.length} row${afterDisclosures.length === 1 ? "" : "s"}`, sectionId: "section-disclosures" });
    }

    text("fileHeading", "How to File heading", values.fileHeading, "section-file");
    text("fileSub", "How to File subheading", values.fileSub, "section-file");
    text("fileBody", "How to File body", values.fileBody, "section-file");
    text("fileCtaLabel", "How to File button text", values.fileCtaLabel, "section-file");
    text("fileCtaHref", "How to File button link", values.fileCtaHref, "section-file");
    text("fileRedirectNote", "Redirect note", values.fileRedirectNote, "section-file");
    text("fileEmail", "Email", values.fileEmail, "section-file");
    text("filePhone", "Phone (display)", values.filePhone, "section-file");
    text("filePhoneHref", "Phone (tel: link)", values.filePhoneHref, "section-file");

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

      {Array.from({ length: 2 }, (_, i) => values.contacts[i]).map((contact, i) => (
        <section key={i} id={`section-contact${i}`} className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Contact {i + 1} — {CONTACT_NAMES[i]}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Badge text</label>
              <input name={`contact${i}Badge`} defaultValue={contact?.badge ?? CONTACT_NAMES[i]} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Badge style</label>
              <select name={`contact${i}Tone`} defaultValue={contact?.tone ?? "light"} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Name</label>
            <input name={`contact${i}Name`} defaultValue={contact?.name ?? ""} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Designation</label>
            <input name={`contact${i}Designation`} defaultValue={contact?.designation ?? ""} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Contact details <span className="normal-case text-[11px]">(one per line; add &quot; :: href&quot; to make a line a link, e.g. &quot;044 4016 4900 :: tel:04440164900&quot;)</span>
            </label>
            <textarea name={`contact${i}DetailsText`} defaultValue={contact?.detailsText ?? ""} required rows={4} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
        </section>
      ))}

      <section id="section-disclosures" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Section 4(1)(b) disclosures{" "}
          <span className="normal-case text-[11px]">
            (each row&apos;s &quot;Sub-rows&quot; text: one sub-row per line, formatted &quot;Detail :: Info&quot;)
          </span>
        </label>
        <RepeatableRows
          name="disclosures"
          fields={[
            { key: "sno", label: "S.No" },
            { key: "item", label: "Item", textarea: true },
            { key: "rowsText", label: "Sub-rows (one per line, Detail :: Info)", textarea: true },
          ]}
          initialRows={values.disclosures}
          addLabel="+ Add disclosure row"
        />
      </section>

      <section id="section-file" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">How to File</p>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
          <input name="fileHeading" defaultValue={values.fileHeading} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Subheading</label>
          <input name="fileSub" defaultValue={values.fileSub} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
          <textarea name="fileBody" defaultValue={values.fileBody} required rows={3} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Button text</label>
            <input name="fileCtaLabel" defaultValue={values.fileCtaLabel} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Button link</label>
            <input name="fileCtaHref" defaultValue={values.fileCtaHref} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Redirect note</label>
          <input name="fileRedirectNote" defaultValue={values.fileRedirectNote} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Email</label>
            <input name="fileEmail" defaultValue={values.fileEmail} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Phone (display)</label>
            <input name="filePhone" defaultValue={values.filePhone} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Phone (tel: link)</label>
            <input name="filePhoneHref" defaultValue={values.filePhoneHref} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          </div>
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
              if (window.confirm("Unpublish? The RTI page will revert to whatever was last published.")) submitWithIntent("unpublish");
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
