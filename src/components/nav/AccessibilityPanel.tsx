"use client";

import { useEffect, useRef } from "react";
import { useAccessibilityPrefs } from "@/lib/accessibility";
import { CloseIcon } from "./icons";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      {children}
    </svg>
  );
}
const strokeProps = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const ICONS: Record<string, React.ReactNode> = {
  textUp: <Icon><path d="M4 18 9 6l5 12M5.5 14h7" {...strokeProps} /><path d="M15 10h5m-2.5-2.5v5" {...strokeProps} /></Icon>,
  textDown: <Icon><path d="M4 18 9 6l5 12M5.5 14h7" {...strokeProps} /><path d="M15 12h5" {...strokeProps} /></Icon>,
  spacing: <Icon><path d="M4 12h16M4 12l3-3m-3 3 3 3M20 12l-3-3m3 3-3 3" {...strokeProps} /></Icon>,
  lineHeight: <Icon><path d="M8 5v14m0-14 3-3m-3 3-3-3m3 17 3-3m-3 3-3-3M13 7h7M13 12h7M13 17h7" {...strokeProps} /></Icon>,
  dyslexia: <Icon><path d="M6 18V6h4a3 3 0 0 1 0 6H6m8-6 4 12m0-12-4 12" {...strokeProps} /></Icon>,
  adhd: <Icon><circle cx="12" cy="12" r="8" {...strokeProps} /><path d="M4 12h4m8 0h4" {...strokeProps} /></Icon>,
  saturation: <Icon><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z" {...strokeProps} /></Icon>,
  moon: <Icon><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" {...strokeProps} /></Icon>,
  invert: <Icon><circle cx="12" cy="12" r="8.5" {...strokeProps} /><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" /></Icon>,
  link: <Icon><path d="M9 15l6-6M9 8H6a3 3 0 0 0 0 6h1m8-6h1a3 3 0 0 1 0 6h-3" {...strokeProps} /></Icon>,
  speak: <Icon><path d="M4 9v6h4l5 4V5L8 9H4Z" {...strokeProps} /><path d="M17 9a4 4 0 0 1 0 6" {...strokeProps} /></Icon>,
  cursor: <Icon><path d="M6 3v15l4-3.6L12 20l2.4-1L11.2 13H17L6 3Z" {...strokeProps} /></Icon>,
  pause: <Icon><rect x="6" y="5" width="4" height="14" rx="1" {...strokeProps} /><rect x="14" y="5" width="4" height="14" rx="1" {...strokeProps} /></Icon>,
  hideImages: <Icon><rect x="3.5" y="4.5" width="17" height="15" rx="2" {...strokeProps} /><path d="m3.5 16 4.5-4.5 3 3 4-4 4.5 4.5M3 3l18 18" {...strokeProps} /></Icon>,
};

function Row({
  icon,
  label,
  detail,
  control,
}: {
  icon: React.ReactNode;
  label: string;
  detail?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-strong)] text-ink">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="type-body-strong block truncate text-ink">{label}</span>
        {detail && <span className="type-caption block truncate text-[var(--color-muted)]">{detail}</span>}
      </span>
      {control}
    </div>
  );
}

function Switch({ pressed, onToggle, label }: { pressed: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={pressed}
      aria-label={label}
      className={`flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
        pressed ? "border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)]" : "border-hairline-strong bg-[var(--color-surface-strong)]"
      }`}
    >
      <span className={`h-4.5 w-4.5 rounded-full bg-white shadow transition-transform ${pressed ? "translate-x-[22px]" : "translate-x-0.5"}`} />
    </button>
  );
}

/**
 * Replaces the third-party UX4G accessibility widget with a panel that
 * looks like it belongs on this site — the reference screenshots the
 * request was built from were a functional spec (what each control does),
 * not a visual one, so this follows the same rounded-xl/border-hairline/
 * bg-surface-card language every other dropdown and drawer on the site
 * already uses (see NavDropdown, MobileDrawer), not the third-party
 * widget's own purple header and icon-tile grid. Mounted once (see
 * layout.tsx), driven by AccessibilityProvider's context — any trigger
 * anywhere on the site just calls `openPanel(event.currentTarget)`.
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
  const saturationLabel = prefs.saturation === "low" ? "Low" : prefs.saturation === "high" ? "High" : "Normal";

  return (
    <>
      <div aria-hidden className="fixed inset-0 z-[65] bg-black/10" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Accessibility options"
        className="fixed inset-x-3 top-16 z-[70] mx-auto max-h-[80vh] w-[min(380px,calc(100vw-1.5rem))] overflow-y-auto rounded-xl border border-hairline bg-surface-card shadow-[0_4px_16px_rgba(0,0,0,0.08)] sm:inset-x-auto sm:right-4"
      >
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-4 py-3">
          <span className="type-title-sm text-ink">Accessibility</span>
          <button
            type="button"
            onClick={close}
            aria-label="Close accessibility options"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)] hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="divide-y divide-hairline py-1">
          <Row
            icon={ICONS.textUp}
            label="Text size"
            detail={`${fontPct}%`}
            control={
              <span className="flex shrink-0 items-center gap-1">
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
            }
          />
          <Row
            icon={ICONS.spacing}
            label="Text spacing"
            detail="Wider letter and word spacing"
            control={<Switch pressed={prefs.textSpacing} onToggle={prefs.toggleTextSpacing} label="Text spacing" />}
          />
          <Row
            icon={ICONS.lineHeight}
            label="Line height"
            detail="More space between lines"
            control={<Switch pressed={prefs.lineHeightBoost} onToggle={prefs.toggleLineHeightBoost} label="Line height" />}
          />
          <Row
            icon={ICONS.dyslexia}
            label="Dyslexia-friendly font"
            detail="Switches to OpenDyslexic"
            control={<Switch pressed={prefs.dyslexiaFont} onToggle={prefs.toggleDyslexiaFont} label="Dyslexia-friendly font" />}
          />
          <Row
            icon={ICONS.adhd}
            label="Reading guide"
            detail="Highlights a line as you move the pointer"
            control={<Switch pressed={prefs.adhdMode} onToggle={prefs.toggleAdhdMode} label="Reading guide" />}
          />
          <Row
            icon={ICONS.saturation}
            label="Saturation"
            detail={saturationLabel}
            control={
              <button
                type="button"
                onClick={prefs.cycleSaturation}
                className="type-caption shrink-0 rounded-full border border-hairline-strong px-3 py-1.5 font-semibold text-ink hover:bg-[var(--color-surface-strong)]"
              >
                Cycle
              </button>
            }
          />
          <Row
            icon={ICONS.moon}
            label="Dark mode"
            detail="Inverted theme, photos stay natural"
            control={<Switch pressed={prefs.theme === "dark"} onToggle={() => prefs.setTheme("dark")} label="Dark mode" />}
          />
          <Row
            icon={ICONS.invert}
            label="Invert colors"
            detail="Full color inversion, including photos"
            control={<Switch pressed={prefs.theme === "invert"} onToggle={() => prefs.setTheme("invert")} label="Invert colors" />}
          />
          <Row
            icon={ICONS.link}
            label="Highlight links"
            control={<Switch pressed={prefs.highlightLinks} onToggle={prefs.toggleHighlightLinks} label="Highlight links" />}
          />
          <Row
            icon={ICONS.speak}
            label="Speak on hover"
            detail="Reads elements aloud as you point at them"
            control={<Switch pressed={prefs.speakOnHover} onToggle={prefs.toggleSpeakOnHover} label="Speak on hover" />}
          />
          <Row
            icon={ICONS.cursor}
            label="Large cursor"
            control={<Switch pressed={prefs.cursorLarge} onToggle={prefs.toggleCursorLarge} label="Large cursor" />}
          />
          <Row
            icon={ICONS.pause}
            label="Pause animations"
            control={<Switch pressed={prefs.pauseAnimation} onToggle={prefs.togglePauseAnimation} label="Pause animations" />}
          />
          <Row
            icon={ICONS.hideImages}
            label="Hide images"
            control={<Switch pressed={prefs.hideImages} onToggle={prefs.toggleHideImages} label="Hide images" />}
          />
        </div>

        <div className="border-t border-hairline p-3">
          <button
            type="button"
            onClick={prefs.reset}
            className="type-caption w-full rounded-lg border border-hairline-strong py-2 text-center font-semibold text-ink hover:bg-[var(--color-surface-strong)]"
          >
            Reset all settings
          </button>
        </div>
      </div>
    </>
  );
}
