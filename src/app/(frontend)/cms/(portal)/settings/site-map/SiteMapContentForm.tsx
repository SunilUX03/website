"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

const linkFields = [
  { key: "groupHeading", label: "Group heading", width: 1 },
  { key: "label", label: "Label", width: 1 },
  { key: "href", label: "URL", width: 1.4 },
];

export type SiteMapLinkRow = { id?: string; groupHeading: string; label: string; href: string };

export type SiteMapContentFormValues = {
  links: SiteMapLinkRow[];
  /** The document's `updatedAt` as of this page load — round-tripped
   * through a hidden field so the server action can detect a save based
   * on stale data (e.g. a locale tab left open since before someone
   * else's edit) and refuse it instead of silently overwriting. */
  updatedAt?: string;
};

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

export function SiteMapContentForm({
  action,
  values,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: SiteMapContentFormValues;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads.
   * English and Tamil are edited as two independent passes over the same
   * form (via LocaleTabs), not side-by-side fields. */
  locale?: "en" | "ta";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [changes, setChanges] = useState<Change[] | null>(null);

  function computeChanges(fd: FormData): Change[] {
    const after = reconstructRows(fd, "links", ["groupHeading", "label", "href"]);
    const before = values.links.map(({ id: _id, ...rest }) => rest);
    if (JSON.stringify(after) !== JSON.stringify(before)) {
      return [{ id: "links", label: "Links", detail: `${before.length} → ${after.length} row${after.length === 1 ? "" : "s"}`, sectionId: "section-links" }];
    }
    return [];
  }

  function handleUpdateClick() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const detected = computeChanges(fd);
    if (detected.length === 0) {
      formRef.current.requestSubmit();
      return;
    }
    setChanges(detected);
  }

  return (
    <form ref={formRef} action={action} className="flex max-w-[900px] flex-col gap-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="_loadedUpdatedAt" value={values.updatedAt ?? ""} />

      <section id="section-links" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Links <span className="normal-case text-[11px]">(rows with the same group heading are shown together)</span>
        </label>
        <RepeatableRows name="links" fields={linkFields} initialRows={values.links} addLabel="+ Add link" />
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
            formRef.current?.requestSubmit();
          }}
        />
      ) : null}
    </form>
  );
}
