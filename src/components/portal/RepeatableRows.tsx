"use client";

import { useState } from "react";

type FieldSpec = { key: string; label: string; placeholder?: string; textarea?: boolean };

/** Add/remove/edit a list of small structured rows (facts, links, FAQs)
 * inside a plain <form> — inputs are named `${name}.${index}.${key}` so
 * the Server Action can reconstruct the array from FormData without any
 * client/server round trip per row. */
export function RepeatableRows({
  name,
  fields,
  initialRows,
  addLabel,
}: {
  name: string;
  fields: FieldSpec[];
  initialRows: Record<string, string>[];
  addLabel: string;
}) {
  const [rows, setRows] = useState<Record<string, string>[]>(
    initialRows.length > 0 ? initialRows : []
  );

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, i) => (
        <div key={i} className="flex items-start gap-2 rounded-lg border border-hairline p-3">
          <div className="grid flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)` }}>
            {fields.map((f) =>
              f.textarea ? (
                <textarea
                  key={f.key}
                  name={`${name}.${i}.${f.key}`}
                  defaultValue={row[f.key] ?? ""}
                  placeholder={f.placeholder ?? f.label}
                  rows={2}
                  className="rounded-md border border-hairline-strong bg-canvas px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-primary-blue)]"
                />
              ) : (
                <input
                  key={f.key}
                  name={`${name}.${i}.${f.key}`}
                  defaultValue={row[f.key] ?? ""}
                  placeholder={f.placeholder ?? f.label}
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
