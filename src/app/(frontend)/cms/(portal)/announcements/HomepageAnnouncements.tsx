"use client";

import { useState, useTransition } from "react";
import { reorderTickerAnnouncements, removeAnnouncementFromTicker } from "./actions";
import { AddToTickerModal } from "./AddToTickerModal";

function DragHandle() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
      <circle cx="5" cy="3" r="1.2" fill="currentColor" />
      <circle cx="11" cy="3" r="1.2" fill="currentColor" />
      <circle cx="5" cy="8" r="1.2" fill="currentColor" />
      <circle cx="11" cy="8" r="1.2" fill="currentColor" />
      <circle cx="5" cy="13" r="1.2" fill="currentColor" />
      <circle cx="11" cy="13" r="1.2" fill="currentColor" />
    </svg>
  );
}

export type FeaturedAnnouncement = { id: number; heading: string; date: string };
export type CandidateAnnouncement = { id: number; heading: string; date: string };

/** The homepage scrolling ticker's curated list — drag to reorder
 * (writes tickerOrder), remove without touching publish status, or pull
 * in more announcements via the bulk checkbox picker. Sits above the
 * main announcements table since it's about the homepage, not this
 * item's own content. */
export function HomepageAnnouncements({
  initialFeatured,
  candidates,
}: {
  initialFeatured: FeaturedAnnouncement[];
  candidates: CandidateAnnouncement[];
}) {
  const [rows, setRows] = useState(initialFeatured);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isPending, startTransition] = useTransition();

  function moveRow(from: number, to: number) {
    if (to < 0 || to >= rows.length) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    startTransition(async () => {
      setRows(next);
      await reorderTickerAnnouncements(next.map((r) => r.id));
    });
  }

  function handleRemove(id: number) {
    startTransition(async () => {
      setRows((prev) => prev.filter((r) => r.id !== id));
      await removeAnnouncementFromTicker(id);
    });
  }

  return (
    <div className="mb-8 rounded-xl border border-hairline bg-surface-card p-5">
      <div className="mb-1 flex items-center justify-between">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Home page announcements</p>
        <button type="button" onClick={() => setShowPicker(true)} className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline">
          + Add announcements to homepage
        </button>
      </div>
      <p className="type-caption mb-4 text-[var(--color-muted)]">
        Shown in the scrolling ticker at the top of the homepage. Drag to reorder.
      </p>

      <div className={`flex flex-col gap-2 transition-opacity ${isPending ? "opacity-70" : ""}`}>
        {rows.map((row, i) => (
          <div
            key={row.id}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragEnter={() => setOverIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null && dragIndex !== i) moveRow(dragIndex, i);
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
              overIndex === i && dragIndex !== null && dragIndex !== i
                ? "border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)]/5"
                : "border-hairline"
            } ${dragIndex === i ? "opacity-50" : ""}`}
          >
            <span className="cursor-grab text-[var(--color-muted)] active:cursor-grabbing" aria-hidden title="Drag to reorder">
              <DragHandle />
            </span>
            <span className="flex-1">
              <span className="type-body-sm block text-ink">{row.heading}</span>
              <span className="type-caption block text-[var(--color-muted)]">{row.date}</span>
            </span>
            <button
              type="button"
              onClick={() => handleRemove(row.id)}
              className="type-caption rounded-md border border-hairline-strong px-2.5 py-1.5 text-[var(--color-muted)] hover:text-ink"
            >
              Remove
            </button>
          </div>
        ))}
        {rows.length === 0 ? (
          <p className="type-body-sm rounded-lg border border-dashed border-hairline-strong p-4 text-center text-[var(--color-muted)]">
            Nothing on the homepage ticker yet — use &quot;+ Add announcements to homepage&quot; above.
          </p>
        ) : null}
      </div>

      {showPicker ? <AddToTickerModal candidates={candidates} onClose={() => setShowPicker(false)} /> : null}
    </div>
  );
}
