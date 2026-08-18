"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type OrgChartBranch = {
  director: string;
  engineer: string;
  manager: string;
  base: string;
};

export type OrgChartFormValues = {
  topPrimary: string;
  topSecondary: string;
  branches: OrgChartBranch[];
  status?: "draft" | "published";
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

export function OrgChartForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: OrgChartFormValues;
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
    text("topPrimary", "Top box", values.topPrimary, "section-top");
    text("topSecondary", "Second box", values.topSecondary, "section-top");
    for (let i = 0; i < 6; i++) {
      const b = values.branches[i];
      const sectionId = `section-branch${i}`;
      text(`branch${i}Director`, `Branch ${i + 1} director-level box`, b?.director ?? "", sectionId);
      text(`branch${i}Engineer`, `Branch ${i + 1} engineer-level box`, b?.engineer ?? "", sectionId);
      text(`branch${i}Manager`, `Branch ${i + 1} manager-level box`, b?.manager ?? "", sectionId);
      text(`branch${i}Base`, `Branch ${i + 1} base-level box`, b?.base ?? "", sectionId);
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

      <section id="section-top" className="grid scroll-mt-6 grid-cols-2 gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Top box (e.g. CEO)</label>
          <input
            name="topPrimary"
            defaultValue={values.topPrimary}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Second box (e.g. JCEO)</label>
          <input
            name="topSecondary"
            defaultValue={values.topSecondary}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      {Array.from({ length: 6 }, (_, i) => values.branches[i]).map((branch, i) => (
        <section key={i} id={`section-branch${i}`} className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Branch {i + 1}</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Director-level box</label>
            <input
              name={`branch${i}Director`}
              defaultValue={branch?.director ?? ""}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Engineer-level box <span className="normal-case text-[11px]">(leave blank to skip this level for this branch)</span>
            </label>
            <input
              name={`branch${i}Engineer`}
              defaultValue={branch?.engineer ?? ""}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Manager-level box</label>
            <input
              name={`branch${i}Manager`}
              defaultValue={branch?.manager ?? ""}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Base-level box</label>
            <input
              name={`branch${i}Base`}
              defaultValue={branch?.base ?? ""}
              required
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
              if (window.confirm("Unpublish? The About page's org chart will revert to whatever was last published.")) submitWithIntent("unpublish");
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
