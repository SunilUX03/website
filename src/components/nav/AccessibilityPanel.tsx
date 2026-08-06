"use client";

import { useEffect, useRef } from "react";
import { useAccessibilityPrefs } from "@/lib/accessibility";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ToggleRow({
  label,
  description,
  pressed,
  onToggle,
}: {
  label: string;
  description: string;
  pressed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={pressed}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-hairline px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-strong)]"
    >
      <span>
        <span className="type-body-strong block text-ink">{label}</span>
        <span className="type-caption block text-[var(--color-muted)]">{description}</span>
      </span>
      <span
        aria-hidden
        className={`flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
          pressed ? "border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)]" : "border-hairline-strong bg-[var(--color-surface-strong)]"
        }`}
      >
        <span
          className={`h-4.5 w-4.5 rounded-full bg-white shadow transition-transform ${pressed ? "translate-x-[22px]" : "translate-x-0.5"}`}
        />
      </span>
    </button>
  );
}

/**
 * Replaces the third-party UX4G accessibility widget with a panel this
 * codebase owns end to end. Focus moves into the panel on open and back to
 * whichever button opened it on close, and Escape closes it too, so it
 * behaves like any other accessible disclosure rather than a bolted-on
 * script. Mounted once (see layout.tsx) and driven entirely by
 * AccessibilityProvider's context — any trigger anywhere on the site (nav
 * bar, footer) just calls `openPanel(event.currentTarget)` and this shows
 * up already wired to it.
 */
export function AccessibilityPanel() {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const prefs = useAccessibilityPrefs();
  const { panelOpen: open, closePanel, panelTrigger } = prefs;

  const close = () => {
    closePanel();
    panelTrigger?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const fontPct = Math.round(prefs.fontScale * 100);

  return (
    <>
      <div aria-hidden className="fixed inset-0 z-[65] bg-black/10" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Accessibility options"
        className="fixed right-4 top-16 z-[70] w-[min(340px,calc(100vw-2rem))] rounded-2xl border border-hairline bg-surface-card p-4 shadow-[0_16px_40px_rgba(12,10,9,0.18)]"
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="type-title-sm text-ink">Accessibility options</p>
          <button
            type="button"
            onClick={close}
            aria-label="Close accessibility options"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)] hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-hairline px-3 py-2.5">
            <span>
              <span className="type-body-strong block text-ink">Text size</span>
              <span className="type-caption block text-[var(--color-muted)]">{fontPct}%</span>
            </span>
            <span className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prefs.decreaseFontScale}
                aria-label="Decrease text size"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline-strong text-ink hover:bg-[var(--color-surface-strong)]"
              >
                −
              </button>
              <button
                type="button"
                onClick={prefs.increaseFontScale}
                aria-label="Increase text size"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline-strong text-ink hover:bg-[var(--color-surface-strong)]"
              >
                +
              </button>
            </span>
          </div>

          <ToggleRow
            label="High contrast"
            description="Maximum contrast text and borders"
            pressed={prefs.highContrast}
            onToggle={prefs.toggleHighContrast}
          />
          <ToggleRow
            label="Reduce motion"
            description="Turn off animations and auto-scrolling"
            pressed={prefs.reduceMotion}
            onToggle={prefs.toggleReduceMotion}
          />
          <ToggleRow
            label="Dyslexia-friendly font"
            description="Switch to a font with wider letter spacing"
            pressed={prefs.dyslexiaFont}
            onToggle={prefs.toggleDyslexiaFont}
          />
        </div>

        <button
          type="button"
          onClick={prefs.reset}
          className="type-caption mt-3 w-full rounded-lg border border-hairline-strong py-2 text-center font-semibold text-ink hover:bg-[var(--color-surface-strong)]"
        >
          Reset all settings
        </button>
      </div>
    </>
  );
}
