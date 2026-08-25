"use client";

import { useRef, useState } from "react";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type OrgChartNode = { id?: string; label: string; sublabel: string; muted: boolean };
export type OrgChartBranch = { title: string; subtitle: string; nodes: OrgChartNode[] };

export type OrgChartFormValues = {
  topLabel: string;
  jceoLabel: string;
  branches: OrgChartBranch[];
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

/** One node per line: "Label :: Sublabel" renders a boxed card; a bare
 * line with no " :: " renders as a plain grey row (an individual-
 * contributor role between the numbered/lettered boxes). Same
 * plain-text-one-item-per-line convention used elsewhere in this admin
 * (RTI contacts, legal-page bullet lists) — a fully dynamic add/remove-row
 * UI isn't worth building for a list that can run to 18 rows per branch. */
function nodesToText(nodes: OrgChartNode[]): string {
  return nodes.map((n) => (n.muted ? n.label : `${n.label} :: ${n.sublabel}`)).join("\n");
}

export function OrgChartForm({
  action,
  values,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: OrgChartFormValues;
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
    text("topLabel", "Top box", values.topLabel, "section-top");
    text("jceoLabel", "Second box", values.jceoLabel, "section-top");
    for (let i = 0; i < 7; i++) {
      const b = values.branches[i];
      const sectionId = `section-branch${i}`;
      text(`branch${i}Title`, `Branch ${i + 1} title`, b?.title ?? "", sectionId);
      text(`branch${i}Subtitle`, `Branch ${i + 1} subtitle`, b?.subtitle ?? "", sectionId);
      text(`branch${i}Nodes`, `Branch ${i + 1} staff list`, nodesToText(b?.nodes ?? []), sectionId);
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

      <section id="section-top" className="grid scroll-mt-6 grid-cols-2 gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Top box (e.g. Chief Executive Officer)</label>
          <input
            name="topLabel"
            defaultValue={values.topLabel}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Second box (e.g. JCEO)</label>
          <input
            name="jceoLabel"
            defaultValue={values.jceoLabel}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      {Array.from({ length: 7 }, (_, i) => values.branches[i]).map((branch, i) => (
        <section key={i} id={`section-branch${i}`} className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Branch {i + 1}</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Title (e.g. Software Product Engineering)</label>
            <input
              name={`branch${i}Title`}
              defaultValue={branch?.title ?? ""}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Subtitle (e.g. GM – Technical)</label>
            <input
              name={`branch${i}Subtitle`}
              defaultValue={branch?.subtitle ?? ""}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Staff list <span className="normal-case text-[11px]">— one role per line. Write "Short code :: Role title" for a boxed card (e.g. "Proc 1 :: Sr. Consultant"), or just the role name alone for a plain grey row (e.g. "Asst. System Engineer").</span>
            </label>
            <textarea
              name={`branch${i}Nodes`}
              defaultValue={nodesToText(branch?.nodes ?? [])}
              rows={8}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 font-mono text-[13px] outline-none focus:border-[var(--color-primary-blue)]"
            />
            {/* Row ids in the same top-to-bottom order as the textarea's
                lines above, so an unchanged line keeps its existing
                Payload row id on save (see actions.ts's parseNodes) —
                without this, every save would treat every line as a
                brand-new row and silently wipe that row's other-locale
                translation, the same bug already found and fixed
                elsewhere in this CMS. */}
            <input type="hidden" name={`branch${i}NodeIds`} value={(branch?.nodes ?? []).map((n) => n.id ?? "").join("\n")} />
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
