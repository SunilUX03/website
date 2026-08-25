"use client";

import { useState, useTransition } from "react";
import { addAnnouncementsToTicker } from "./actions";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

type Candidate = { id: number; heading: string; date: string };

/** Lets an admin bulk-feature multiple announcements onto the homepage
 * ticker in one step, instead of opening each announcement's own edit
 * page and toggling "Show in ticker" one at a time. */
export function AddToTickerModal({ candidates, onClose }: { candidates: Candidate[]; onClose: () => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isPending, startTransition] = useTransition();

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd() {
    const ids = Array.from(selected);
    startTransition(async () => {
      await addAnnouncementsToTicker(ids);
      onClose();
    });
  }

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-ticker-title"
        className="fixed left-1/2 top-1/2 z-[90] flex max-h-[82vh] w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-hairline bg-surface-card p-6 shadow-[0_24px_64px_rgba(12,10,9,0.28)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p id="add-to-ticker-title" className="type-title-md text-ink">
              Add to homepage
            </p>
            <p className="type-caption mt-0.5 text-[var(--color-muted)]">
              Select one or more announcements to add to the homepage scrolling ticker.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)] hover:text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="flex flex-col gap-1 overflow-y-auto pr-1">
          {candidates.map((c) => (
            <li key={c.id} className="border-t border-hairline py-2 first:border-t-0 first:pt-0">
              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} />
                <span className="flex-1">
                  <span className="type-body-sm block text-ink">{c.heading}</span>
                  <span className="type-caption block text-[var(--color-muted)]">{c.date}</span>
                </span>
              </label>
            </li>
          ))}
          {candidates.length === 0 ? (
            <li className="type-body-sm py-4 text-center text-[var(--color-muted)]">
              Every published announcement is already on the homepage ticker.
            </li>
          ) : null}
        </ul>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="type-button btn-outline">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={selected.size === 0 || isPending}
            className="type-button btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Adding…" : `Add ${selected.size || ""}`.trim()}
          </button>
        </div>
      </div>
    </>
  );
}
