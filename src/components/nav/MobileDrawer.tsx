"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "@/lib/content";
import { CloseIcon, ChevronDownIcon } from "./icons";

function MobileGroup({
  title,
  href,
  onNavigate,
  children,
}: {
  title: string;
  /** When set, the title itself navigates there — the chevron is a
   * separate control so it still expands the submenu in place. */
  href?: string;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-hairline py-2">
      {/* The row itself toggles on click — not just the title text or the
          chevron — so tapping the empty space between them (most of the
          row's width) also opens the submenu instead of doing nothing. */}
      <div
        className="flex w-full cursor-pointer items-center justify-between py-2"
        onClick={() => setOpen((v) => !v)}
      >
        {href ? (
          // Its own click stops propagation so tapping the word itself
          // still navigates directly, instead of just toggling the row.
          <a
            href={href}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.();
            }}
            className="type-title-sm text-ink"
          >
            {title}
          </a>
        ) : (
          <span className="type-title-sm text-ink">{title}</span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          aria-expanded={open}
          aria-label={`Toggle ${title} menu`}
          className="flex items-center p-1 text-ink"
        >
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pb-2 pl-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-[70] w-[85%] max-w-[384px] overflow-y-auto bg-canvas p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="type-title-md text-ink">Menu</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <a
              href="/"
              onClick={onClose}
              className="type-title-sm block border-b border-hairline py-3 text-ink"
            >
              Home
            </a>

            <MobileGroup title="About" href="/about" onNavigate={onClose}>
              {nav.about.map((item) => (
                <a key={item.href} href={item.href} onClick={onClose} className="type-body-sm py-1.5 text-ink">
                  {item.label}
                </a>
              ))}
            </MobileGroup>

            <MobileGroup title="Services" href="/services" onNavigate={onClose}>
              {nav.services.map((item) => (
                <a key={item.href} href={item.href} onClick={onClose} className="type-body-sm block py-1.5 text-ink">
                  {item.label}
                </a>
              ))}
            </MobileGroup>

            <MobileGroup title="Notifications">
              <p className="type-caption-uppercase mb-1 text-[var(--color-muted)]">Updates</p>
              {nav.notifications.updates.map((item) => (
                <a key={item.href} href={item.href} onClick={onClose} className="type-body-sm block py-1.5 text-ink">
                  {item.label}
                </a>
              ))}
              <p className="type-caption-uppercase mb-1 mt-2 text-[var(--color-muted)]">Documents</p>
              {nav.notifications.documents.map((item) => (
                <a key={item.href} href={item.href} onClick={onClose} className="type-body-sm block py-1.5 text-ink">
                  {item.label}
                </a>
              ))}
            </MobileGroup>

            <a
              href="/reach-us"
              onClick={onClose}
              className="type-button btn-primary mt-6 w-full shadow-[0_4px_14px_rgba(29,63,143,0.35)]"
            >
              Reach us
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
