"use client";

export type Change = {
  /** Matches the form field name where possible — used as the React key
   * and as the target for onDiscard. */
  id: string;
  label: string;
  detail: string;
  /** DOM id of the `<section>` this field lives in, for "Edit" to jump to. */
  sectionId: string;
  /** Only simple scalar/checkbox/select fields can be reverted in place —
   * repeatable lists and photo selections are "Edit only" (jump to the
   * section and let the admin fix it there by hand). */
  revert?: () => void;
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Shown when an admin clicks Update/Publish — lists every field that
 * changed since the page loaded, each editable in place (jump back to
 * that section) or discardable (revert just that one change), before the
 * admin confirms and the update actually goes live. Standing rule for
 * this portal: nothing publishes to the public site without an explicit,
 * specific "yes, this is what I meant to change" step. */
export function UpdateReviewModal({
  changes,
  onEdit,
  onDiscard,
  onCancel,
  onConfirm,
}: {
  changes: Change[];
  onEdit: (sectionId: string) => void;
  onDiscard: (id: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/40" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-review-title"
        className="fixed left-1/2 top-1/2 z-[90] flex max-h-[82vh] w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-hairline bg-surface-card p-6 shadow-[0_24px_64px_rgba(12,10,9,0.28)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p id="update-review-title" className="type-title-md text-ink">
              Review changes
            </p>
            <p className="type-caption mt-0.5 text-[var(--color-muted)]">
              {changes.length} field{changes.length === 1 ? "" : "s"} changed — this goes live on the public site once confirmed.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)] hover:text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="flex flex-col gap-1 overflow-y-auto pr-1">
          {changes.map((change) => (
            <li key={change.id} className="flex items-start justify-between gap-3 border-t border-hairline py-3 first:border-t-0 first:pt-0">
              <div className="min-w-0 flex-1">
                <p className="type-body-sm font-semibold text-ink">{change.label}</p>
                <p className="type-caption mt-0.5 break-words text-[var(--color-muted)]">{change.detail}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(change.sectionId)}
                  className="type-caption rounded-md border border-hairline-strong px-2.5 py-1 text-[var(--color-primary-blue)] hover:bg-surface-strong"
                >
                  Edit
                </button>
                {change.revert ? (
                  <button
                    type="button"
                    onClick={() => onDiscard(change.id)}
                    className="type-caption rounded-md border border-hairline-strong px-2.5 py-1 text-[var(--color-muted)] hover:text-[var(--color-error)]"
                  >
                    Discard
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex shrink-0 gap-3">
          <button type="button" onClick={onCancel} className="type-button btn-outline flex-1">
            Back to editing
          </button>
          <button type="button" onClick={onConfirm} className="type-button btn-primary flex-1">
            Confirm & update
          </button>
        </div>
      </div>
    </>
  );
}
