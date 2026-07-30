"use client";

import { ReactNode, useState, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "./icons";

interface NavDropdownProps {
  label: string;
  panel: ReactNode;
  panelClassName?: string;
  /** "right" anchors the panel's right edge to the trigger's right edge
   * instead of left-to-left — needed for wide multi-column panels near
   * the right side of the nav so they don't overflow the viewport. */
  align?: "left" | "right";
}

/**
 * Desktop: opens on hover (with a small close-delay so moving from the
 * trigger into the panel doesn't dismiss it). Also opens on click/tap so
 * touch and keyboard users get the same behavior.
 */
export function NavDropdown({ label, panel, panelClassName, align = "left" }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const [closeTimer, setCloseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const scheduleClose = () => {
    const t = setTimeout(() => setOpen(false), 120);
    setCloseTimer(t);
  };
  const cancelClose = () => {
    if (closeTimer) clearTimeout(closeTimer);
    setCloseTimer(null);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="type-nav-link flex items-center gap-1 py-2 text-ink transition-colors hover:text-[var(--color-primary-blue)]"
      >
        {label}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`absolute top-full z-40 mt-1 max-w-[95vw] rounded-xl border border-hairline bg-surface-card shadow-[0_4px_16px_rgba(0,0,0,0.08)] ${
              align === "right" ? "right-0" : "left-0"
            } ${panelClassName ?? "min-w-[220px] p-2"}`}
          >
            {panel}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="type-body-sm block rounded-lg px-3 py-2 text-ink transition-colors hover:bg-[var(--color-surface-strong)]"
    >
      {label}
    </a>
  );
}
