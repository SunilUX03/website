"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "@/lib/content";
import { CloseIcon, ChevronDownIcon } from "./icons";

function MobileGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-hairline py-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="type-title-sm flex w-full items-center justify-between py-2 text-ink"
      >
        {title}
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
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
            className="fixed inset-0 z-[60] bg-black/30 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-[70] w-[85%] max-w-[384px] overflow-y-auto bg-canvas p-6 shadow-2xl lg:hidden"
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

            <MobileGroup title="About">
              {nav.about.map((item) => (
                <a key={item.href} href={item.href} onClick={onClose} className="type-body-sm py-1.5 text-ink">
                  {item.label}
                </a>
              ))}
            </MobileGroup>

            <MobileGroup title="Services">
              {nav.services.map((group) => (
                <div key={group.category} className="mb-2">
                  <p className="type-caption-uppercase mb-1 text-[var(--color-muted)]">
                    {group.category}
                  </p>
                  {group.items.map((item) => (
                    <a key={item.href} href={item.href} onClick={onClose} className="type-body-sm block py-1.5 text-ink">
                      {item.label}
                    </a>
                  ))}
                </div>
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

            <a href="/reach-us" onClick={onClose} className="type-button btn-primary mt-6 w-full">
              Reach us
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
