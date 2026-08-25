"use client";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** A popup for validation/save errors — every message that's wrong is
 * shown together in one place, rather than a single banner at the top of
 * a long form the admin has already scrolled past. */
export function ErrorPopupModal({ errors, onClose }: { errors: string[]; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/40" onClick={onClose} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="error-popup-title"
        className="fixed left-1/2 top-1/2 z-[90] flex max-h-[82vh] w-[92vw] max-w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-[var(--color-error)] bg-surface-card p-6 shadow-[0_24px_64px_rgba(12,10,9,0.28)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <p id="error-popup-title" className="type-title-md text-[var(--color-error)]">
            {errors.length === 1 ? "Can't save yet" : `Can't save yet — ${errors.length} issues`}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)] hover:text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="flex flex-col gap-2 overflow-y-auto pr-1">
          {errors.map((message) => (
            <li key={message} className="type-body-sm flex items-start gap-2 text-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-error)]" aria-hidden />
              {message}
            </li>
          ))}
        </ul>

        <button type="button" onClick={onClose} className="type-button btn-primary mt-5 self-end">
          OK
        </button>
      </div>
    </>
  );
}
