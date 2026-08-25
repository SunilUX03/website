"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Service } from "@/payload-types";
import { reorderServices } from "./actions";

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

type Row = Pick<Service, "id" | "name" | "real" | "accessPortalHref" | "_status">;

// Drag-to-reorder for a table of separate Payload documents (unlike
// RepeatableRows, which reorders sub-rows inside one document's array
// field) — dragging updates local order optimistically, then persists via
// reorderServices, which writes every doc's `order` to its new index.
export function ServicesTable({ docs }: { docs: Row[] }) {
  const [rows, setRows] = useState(docs);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function moveRow(from: number, to: number) {
    if (to < 0 || to >= rows.length) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    // Both the optimistic state update and the Server Action call must
    // live inside the same startTransition — splitting them (setRows
    // outside, action inside) is what triggered "Cannot update a
    // component (Router) while rendering a different component": the
    // action's revalidatePath-driven Router update landed mid-render of
    // the synchronous setRows commit.
    startTransition(async () => {
      setRows(next);
      await reorderServices(next.map((row) => row.id));
    });
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-hairline bg-surface-card transition-opacity ${isPending ? "opacity-70" : ""}`}>
      <table className="w-full text-left">
        <thead>
          <tr className="type-caption-uppercase border-b border-hairline text-[var(--color-muted)]">
            <th className="px-4 py-3" />
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((doc, i) => (
            <tr
              key={doc.id}
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
              className={`type-body-sm border-b border-hairline transition-colors last:border-0 ${
                overIndex === i && dragIndex !== null && dragIndex !== i
                  ? "bg-[var(--color-primary-blue)]/5"
                  : ""
              } ${dragIndex === i ? "opacity-50" : ""}`}
            >
              <td className="px-4 py-3">
                <span
                  className="flex h-7 w-7 cursor-grab items-center justify-center text-[var(--color-muted)] active:cursor-grabbing"
                  aria-hidden
                  title="Drag to reorder"
                >
                  <DragHandle />
                </span>
              </td>
              <td className="px-4 py-3 text-ink">{doc.name}</td>
              <td className="px-4 py-3 text-[var(--color-muted)]">{doc.real?.typeLabel ?? (doc.accessPortalHref ? "Project" : "Initiative")}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    doc._status === "published"
                      ? "badge-pill type-caption-uppercase !bg-[rgba(16,138,74,0.1)] !text-[#108a4a]"
                      : "badge-pill type-caption-uppercase"
                  }
                >
                  {doc._status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/cms/services/${doc.id}/edit`} className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">
                Nothing yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
