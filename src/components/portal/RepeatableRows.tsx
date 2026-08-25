"use client";

import { useState } from "react";

type FieldSpec = {
  key: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  checkbox?: boolean;
  /** Renders as a plain hidden input instead of a visible field — for a
   * second id this row needs to carry (e.g. Services' combined key-
   * feature+description row maps to two separate underlying Payload
   * arrays, each with its own row id to preserve). Doesn't consume a
   * column in the visible-fields grid. */
  hidden?: boolean;
  maxLength?: number;
  /** Relative column width within the row's grid (default 1). A field
   * expected to hold much longer text than its siblings (e.g. a
   * department name next to a short contact code) should get a higher
   * weight so it doesn't get clipped to the same width as the others. */
  width?: number;
};

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

/** Add/remove/edit a list of small structured rows (facts, links, FAQs)
 * inside a plain <form> — inputs are named `${name}.${index}.${key}` so
 * the Server Action can reconstruct the array from FormData without any
 * client/server round trip per row.
 *
 * Each existing row's own `id` (from `initialRows`, if present) round-
 * trips through a hidden input alongside its fields. This matters more
 * than it looks: Payload's localized array fields store each locale's
 * text keyed off that row's id — a submitted row with no id is treated
 * as brand new, and Payload replaces the whole array wholesale, so a
 * plain English-only edit that dropped every row's id would silently
 * delete every row's Tamil translation on save. A newly *added* row here
 * legitimately has no id yet (that's correct — it's genuinely new).
 *
 * `reorderable` (opt-in, default off) adds a drag handle that lets an
 * admin drag rows into a new order — reordering the `rows` state array
 * is enough on its own: each row keeps its React key (`row.id ?? i`) so
 * its uncontrolled inputs' values move with it, while its `name={...}`
 * index updates to the new position, so the plain index-based field
 * names the server action already parses just reflect the new order on
 * submit — no server-side changes needed to support this. */
export function RepeatableRows({
  name,
  fields,
  initialRows,
  addLabel,
  reorderable = false,
}: {
  name: string;
  fields: FieldSpec[];
  initialRows: (Record<string, string | null | undefined> & { id?: string })[];
  addLabel: string;
  reorderable?: boolean;
}) {
  const [rows, setRows] = useState<(Record<string, string | null | undefined> & { id?: string })[]>(
    initialRows.length > 0 ? initialRows : []
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function moveRow(from: number, to: number) {
    setRows((r) => {
      if (to < 0 || to >= r.length) return r;
      const next = [...r];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, i) => (
        <div
          key={row.id ?? i}
          draggable={reorderable}
          onDragStart={reorderable ? () => setDragIndex(i) : undefined}
          onDragEnter={reorderable ? () => setOverIndex(i) : undefined}
          onDragOver={reorderable ? (e) => e.preventDefault() : undefined}
          onDrop={
            reorderable
              ? (e) => {
                  e.preventDefault();
                  if (dragIndex !== null && dragIndex !== i) moveRow(dragIndex, i);
                  setDragIndex(null);
                  setOverIndex(null);
                }
              : undefined
          }
          onDragEnd={reorderable ? () => { setDragIndex(null); setOverIndex(null); } : undefined}
          className={`flex items-start gap-2 rounded-lg border p-3 transition-colors ${
            overIndex === i && dragIndex !== null && dragIndex !== i
              ? "border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)]/5"
              : "border-hairline"
          } ${dragIndex === i ? "opacity-50" : ""}`}
        >
          {reorderable ? (
            <span
              className="mt-1.5 shrink-0 cursor-grab text-[var(--color-muted)] active:cursor-grabbing"
              aria-hidden
              title="Drag to reorder"
            >
              <DragHandle />
            </span>
          ) : null}
          {row.id ? <input type="hidden" name={`${name}.${i}.id`} value={row.id} /> : null}
          {fields
            .filter((f) => f.hidden)
            .map((f) => (
              <input key={f.key} type="hidden" name={`${name}.${i}.${f.key}`} value={row[f.key] ?? ""} />
            ))}
          <div
            className="grid min-w-0 flex-1 gap-2"
            style={{
              gridTemplateColumns: fields
                .filter((f) => !f.hidden)
                .map((f) => `minmax(0, ${f.width ?? 1}fr)`)
                .join(" "),
            }}
          >
            {fields
              .filter((f) => !f.hidden)
              .map((f) =>
              f.checkbox ? (
                <label key={f.key} className="flex items-center gap-1.5 text-sm text-ink">
                  <input type="checkbox" name={`${name}.${i}.${f.key}`} defaultChecked={row[f.key] === "true"} />
                  {f.label}
                </label>
              ) : f.textarea ? (
                <textarea
                  key={f.key}
                  name={`${name}.${i}.${f.key}`}
                  defaultValue={row[f.key] ?? ""}
                  placeholder={f.placeholder ?? f.label}
                  maxLength={f.maxLength}
                  rows={2}
                  className="rounded-md border border-hairline-strong bg-canvas px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-primary-blue)]"
                />
              ) : (
                <input
                  key={f.key}
                  name={`${name}.${i}.${f.key}`}
                  defaultValue={row[f.key] ?? ""}
                  placeholder={f.placeholder ?? f.label}
                  maxLength={f.maxLength}
                  className="rounded-md border border-hairline-strong bg-canvas px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-primary-blue)]"
                />
              )
            )}
          </div>
          <button
            type="button"
            onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
            aria-label="Remove row"
            className="type-caption shrink-0 rounded-md border border-hairline-strong px-2 py-1.5 text-[var(--color-muted)] hover:text-ink"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows((r) => [...r, Object.fromEntries(fields.map((f) => [f.key, ""]))])}
        className="type-caption self-start rounded-md border border-hairline-strong px-3 py-1.5 text-[var(--color-primary-blue)] hover:bg-surface-strong"
      >
        {addLabel}
      </button>
    </div>
  );
}
