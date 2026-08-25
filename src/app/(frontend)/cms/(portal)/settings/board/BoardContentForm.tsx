"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type BoardContentFormValues = {
  chairmanRole: string;
  chairmanName: string;
  chairmanTitle: string;
  memberSecretaryRole: string;
  memberSecretaryName: string;
  memberSecretaryTitle: string;
  members: { id?: string; name: string; title: string; isPlaceholder: string }[];
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

export function BoardContentForm({
  action,
  values,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: BoardContentFormValues;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads. */
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
    text("chairmanRole", "Chairman role", values.chairmanRole, "section-chairman");
    text("chairmanName", "Chairman name", values.chairmanName, "section-chairman");
    text("chairmanTitle", "Chairman title", values.chairmanTitle, "section-chairman");
    text("memberSecretaryRole", "Member Secretary role", values.memberSecretaryRole, "section-secretary");
    text("memberSecretaryName", "Member Secretary name", values.memberSecretaryName, "section-secretary");
    text("memberSecretaryTitle", "Member Secretary title", values.memberSecretaryTitle, "section-secretary");
    const after = reconstructRows(fd, "members", ["name", "title", "isPlaceholder"]);
    const before = values.members.map((m) => ({ name: m.name, title: m.title, isPlaceholder: m.isPlaceholder }));
    if (JSON.stringify(after) !== JSON.stringify(before)) {
      list.push({ id: "members", label: "Members", detail: `${values.members.length} → ${after.length} member${after.length === 1 ? "" : "s"}`, sectionId: "section-members" });
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

      <section id="section-chairman" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Chairman</p>
        <div className="grid grid-cols-3 gap-3">
          <input name="chairmanRole" defaultValue={values.chairmanRole} placeholder="Role" className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          <input name="chairmanName" defaultValue={values.chairmanName} placeholder="Name" required className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          <input name="chairmanTitle" defaultValue={values.chairmanTitle} placeholder="Title" required className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
      </section>

      <section id="section-secretary" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Member Secretary</p>
        <div className="grid grid-cols-3 gap-3">
          <input name="memberSecretaryRole" defaultValue={values.memberSecretaryRole} placeholder="Role" className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          <input name="memberSecretaryName" defaultValue={values.memberSecretaryName} placeholder="Name" required className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
          <input name="memberSecretaryTitle" defaultValue={values.memberSecretaryTitle} placeholder="Title" required className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
        </div>
      </section>

      <section id="section-members" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase mb-1 text-[var(--color-muted)]">Members</p>
        <p className="type-caption mb-2 text-[var(--color-muted)]">Drag the handle to reorder.</p>
        <RepeatableRows
          name="members"
          fields={[
            { key: "name", label: "Name" },
            { key: "title", label: "Title" },
            { key: "isPlaceholder", label: "Placeholder (not yet confirmed)", checkbox: true },
          ]}
          initialRows={values.members}
          addLabel="+ Add member"
          reorderable
        />
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
    </form>
  );
}
