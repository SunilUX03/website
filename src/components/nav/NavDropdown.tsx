"use client";

import { ReactNode, useLayoutEffect, useRef, useState, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "./icons";

const VIEWPORT_MARGIN = 12;

interface NavDropdownProps {
  label: string;
  /** When set, the label itself navigates there on click — the chevron
   * stays a separate control so opening the submenu doesn't require
   * leaving the page first. */
  href?: string;
  panel: ReactNode;
  panelClassName?: string;
  /** Replaces the default text-label + chevron trigger with a single
   * icon-only button (the Notifications kebab) — no separate nav-to-href
   * affordance, since there's no overview page for it to link to. */
  iconTrigger?: ReactNode;
}

/**
 * Desktop: opens on hover (with a small close-delay so moving from the
 * trigger into the panel doesn't dismiss it). Also opens on click/tap so
 * touch and keyboard users get the same behavior.
 *
 * The panel is centered under the trigger label (not left/right-anchored)
 * — its position is measured after mount and clamped to the viewport so
 * wide panels never overflow, while still centering whenever there's room.
 */
export function NavDropdown({ label, href, panel, panelClassName, iconTrigger }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const [closeTimer, setCloseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [leftPx, setLeftPx] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const id = useId();

  const scheduleClose = () => {
    const t = setTimeout(() => setOpen(false), 120);
    setCloseTimer(t);
  };
  const cancelClose = () => {
    if (closeTimer) clearTimeout(closeTimer);
    setCloseTimer(null);
  };

  useLayoutEffect(() => {
    if (!open) return;

    const reposition = () => {
      const wrapper = wrapperRef.current;
      const panelEl = panelRef.current;
      if (!wrapper || !panelEl) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      const panelWidth = panelEl.offsetWidth;

      const idealAbsoluteLeft = wrapperRect.left + wrapperRect.width / 2 - panelWidth / 2;
      const clampedAbsoluteLeft = Math.max(
        VIEWPORT_MARGIN,
        Math.min(idealAbsoluteLeft, window.innerWidth - panelWidth - VIEWPORT_MARGIN)
      );

      setLeftPx(clampedAbsoluteLeft - wrapperRect.left);
    };

    reposition();
    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <div className="flex items-center">
        {iconTrigger ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            aria-label={label}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center p-2 text-ink transition-colors hover:text-[var(--color-primary-blue)]"
          >
            {iconTrigger}
          </button>
        ) : (
          <>
            {href ? (
              <a
                href={href}
                className="type-nav-link py-2 text-ink transition-colors hover:text-[var(--color-primary-blue)]"
              >
                {label}
              </a>
            ) : (
              <span className="type-nav-link py-2 text-ink">{label}</span>
            )}
            <button
              type="button"
              aria-expanded={open}
              aria-controls={id}
              aria-label={`Toggle ${label} menu`}
              onClick={() => setOpen((v) => !v)}
              className="flex items-center py-2 pl-1 pr-0.5 text-ink transition-colors hover:text-[var(--color-primary-blue)]"
            >
              <ChevronDownIcon
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          </>
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id={id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`absolute top-full z-40 mt-1 max-w-[95vw] rounded-xl border border-hairline bg-surface-card shadow-[0_4px_16px_rgba(0,0,0,0.08)] ${
              panelClassName ?? "min-w-[220px] p-2"
            }`}
            style={{
              // Falls back to centered-via-transform for the one frame
              // before measurement lands, so it never flashes at left:0.
              left: leftPx !== null ? `${leftPx}px` : "50%",
              transform: leftPx !== null ? undefined : "translateX(-50%)",
            }}
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
