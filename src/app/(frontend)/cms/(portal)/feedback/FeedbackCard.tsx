"use client";

import { useState, useTransition } from "react";
import { markFeedbackRead, deleteFeedback } from "./actions";

export type FeedbackRow = {
  id: number;
  name: string;
  email: string;
  subject: string;
  comments: string;
  locale?: string;
  submittedAt: string;
  read: boolean;
};

export function FeedbackCard({ row, canDelete }: { row: FeedbackRow; canDelete: boolean }) {
  const [read, setRead] = useState(row.read);
  const [removed, setRemoved] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (removed) return null;

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-5 transition-opacity ${
        read ? "border-hairline bg-surface-card" : "border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)]/5"
      } ${isPending ? "opacity-60" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {!read ? <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary-blue)]" aria-hidden /> : null}
            <p className="type-body-strong text-ink">{row.name}</p>
          </div>
          <a href={`mailto:${row.email}`} className="type-caption text-[var(--color-primary-blue)] hover:underline">
            {row.email}
          </a>
        </div>
        <div className="text-right">
          <span className="badge-pill type-caption-uppercase">{row.subject}</span>
          <p className="type-caption mt-1 text-[var(--color-muted)]">
            {new Date(row.submittedAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            {row.locale ? ` · ${row.locale === "ta" ? "தமிழ்" : "English"}` : ""}
          </p>
        </div>
      </div>

      <p className="type-body-sm whitespace-pre-line text-[var(--color-body)]">{row.comments}</p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            const next = !read;
            setRead(next);
            startTransition(async () => {
              await markFeedbackRead(row.id, next);
            });
          }}
          className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline"
        >
          {read ? "Mark as unread" : "Mark as read"}
        </button>
        {canDelete ? (
          <button
            type="button"
            onClick={() => {
              if (!window.confirm("Delete this feedback submission? This can't be undone.")) return;
              setRemoved(true);
              startTransition(async () => {
                await deleteFeedback(row.id);
              });
            }}
            className="type-caption font-semibold text-[var(--color-error)] hover:underline"
          >
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}
