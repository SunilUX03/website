"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Text link that opens a modal listing `items` — e.g. the About section's
 * "50+ schemes covered" link on the DBT detail page. Same modal shell as
 * WebInfoManagerModal, generic enough to reuse for any other item's list. */
export function SchemesModalLink({ label, title, items }: { label: string; title: string; items: string[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="type-body-md mt-1 inline-flex items-center gap-1.5 font-semibold text-[var(--color-primary-blue)] hover:underline"
      >
        {label}
        <ArrowIcon className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-black/40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="schemes-modal-title"
              className="fixed left-1/2 top-1/2 z-[90] flex max-h-[80vh] w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-hairline bg-surface-card p-6 shadow-[0_24px_64px_rgba(12,10,9,0.28)]"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p id="schemes-modal-title" className="type-title-md text-ink">
                    {title}
                  </p>
                  <p className="type-caption mt-0.5 text-[var(--color-muted)]">{items.length} schemes</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)] hover:text-ink"
                >
                  <CloseIcon />
                </button>
              </div>

              <ol className="flex flex-col gap-1 overflow-y-auto pr-1">
                {items.map((scheme, i) => (
                  <li key={scheme} className="type-body-sm flex gap-3 border-t border-hairline py-2.5 first:border-t-0 first:pt-0 text-[var(--color-body)]">
                    <span className="shrink-0 text-[var(--color-muted)]">{i + 1}.</span>
                    {scheme}
                  </li>
                ))}
              </ol>

              <button type="button" onClick={() => setOpen(false)} className="type-button btn-outline mt-5 w-full shrink-0">
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
