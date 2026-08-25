"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";
import { ErrorPopupModal } from "@/components/portal/ErrorPopupModal";

const SOCIAL_PLATFORMS = ["Facebook", "X", "YouTube", "Instagram", "LinkedIn"] as const;
const linkFields = [
  { key: "label", label: "Label" },
  { key: "href", label: "URL" },
];

export type FooterLinkRow = { id?: string; label: string; href: string };

export type FooterContentFormValues = {
  description: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: { label: string; href: string }[];
  quickLinks: FooterLinkRow[];
  citizenServices: FooterLinkRow[];
  initiativesProjects: FooterLinkRow[];
  helpSupport: FooterLinkRow[];
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

export function FooterContentForm({
  action,
  values,
  locale = "en",
  error,
}: {
  action: (formData: FormData) => void;
  values: FooterContentFormValues;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads.
   * English and Tamil are edited as two independent passes over the same
   * form (via LocaleTabs), not side-by-side fields. */
  locale?: "en" | "ta";
  error?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const intentRef = useRef<HTMLInputElement>(null);
  const [changes, setChanges] = useState<Change[] | null>(null);
  const [popupErrors, setPopupErrors] = useState<string[] | null>(error ? [error] : null);

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
    const rows = (name: string, label: string, original: FooterLinkRow[] | { label: string; href: string }[], sectionId: string) => {
      const after = reconstructRows(fd, name, ["label", "href"]);
      const before = original.map((r) => ({ label: r.label, href: r.href }));
      if (JSON.stringify(after) !== JSON.stringify(before)) {
        list.push({ id: name, label, detail: `${original.length} → ${after.length} item${after.length === 1 ? "" : "s"}`, sectionId });
      }
    };

    text("description", "Description", values.description, "section-basics");
    text("address", "Address", values.address, "section-basics");
    text("phone", "Phone", values.phone, "section-basics");
    text("email", "Email", values.email, "section-basics");
    rows("socialLinks", "Social links", values.socialLinks, "section-social");
    rows("quickLinks", "Quick Links column", values.quickLinks, "section-quick");
    rows("citizenServices", "Citizen Services column", values.citizenServices, "section-citizen");
    rows("initiativesProjects", "Initiatives & Projects column", values.initiativesProjects, "section-initiatives");
    rows("helpSupport", "Help & Support column", values.helpSupport, "section-help");
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

      <section id="section-basics" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
          <input
            name="description"
            defaultValue={values.description}
            required
            lang={locale === "ta" ? "ta" : undefined}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Address</label>
          <textarea
            name="address"
            defaultValue={values.address}
            required
            rows={2}
            lang={locale === "ta" ? "ta" : undefined}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
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

      <section id="section-initiatives" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Initiatives & Projects column</label>
        <RepeatableRows name="initiativesProjects" fields={linkFields} initialRows={values.initiativesProjects} addLabel="+ Add link" />
      </section>

      <section id="section-help" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Help & Support column</label>
        <RepeatableRows name="helpSupport" fields={linkFields} initialRows={values.helpSupport} addLabel="+ Add link" />
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

      {popupErrors ? <ErrorPopupModal errors={popupErrors} onClose={() => setPopupErrors(null)} /> : null}
    </form>
  );
}
