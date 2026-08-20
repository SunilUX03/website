"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { obfuscateEmail } from "@/lib/format";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function WebInfoManagerModal({
  open,
  onClose,
  phone,
  email,
}: {
  open: boolean;
  onClose: () => void;
  phone: string;
  email: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="web-info-manager-title"
            className="fixed left-1/2 top-1/2 z-[90] w-[92vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-hairline bg-surface-card p-6 shadow-[0_24px_64px_rgba(12,10,9,0.28)]"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p id="web-info-manager-title" className="type-title-md text-ink">
                  Web Information Manager
                </p>
                <p className="type-caption mt-0.5 text-[var(--color-muted)]">Tamil Nadu e-Governance Agency</p>
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

            <p className="type-body-sm mb-4 text-[var(--color-body)]">
              For queries related to this website&apos;s content or technical issues, please contact:
            </p>

            <div className="flex flex-col gap-2">
              <p className="type-body-sm text-ink">
                Helpline:{" "}
                <a href={`tel:${phone.replace(/\s|-/g, "")}`} className="font-medium text-[var(--color-primary-blue)] hover:underline">
                  {phone}
                </a>
              </p>
              <p className="type-body-sm text-ink">
                Email:{" "}
                <a href={`mailto:${email}`} className="font-medium text-[var(--color-primary-blue)] hover:underline">
                  {obfuscateEmail(email)}
                </a>
              </p>
            </div>

            <button type="button" onClick={onClose} className="type-button btn-outline mt-6 w-full">
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
