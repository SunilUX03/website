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
function CheckBadge() {
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary-blue)] text-white">
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" aria-hidden>
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Tile({
  label,
  sublabel,
  active,
  onClick,
  children,
}: {
  label: string;
  sublabel?: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors ${
        active
          ? "border-[var(--color-primary-blue)] bg-[var(--color-surface-strong)]"
          : "border-hairline bg-surface-card hover:bg-[var(--color-surface-strong)]"
      }`}
    >
      {active && <CheckBadge />}
      <span className="text-ink" aria-hidden>
        {children}
      </span>
      <span className="type-caption leading-tight text-ink">{sublabel ?? label}</span>
    </button>
  );
}

/**
 * Replaces the third-party UX4G accessibility widget with a panel this
 * codebase owns end to end — same feature set (text size/spacing/line
 * height, dyslexia font, ADHD reading guide, saturation, light-dark,
 * invert, highlight links, text-to-speech, large cursor, pause animation,
 * hide images), all driven by AccessibilityProvider's context. Mounted
 * once (see layout.tsx); any trigger anywhere on the site (nav bar,
 * footer) just calls `openPanel(event.currentTarget)`.
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
  const saturationLabel =
    prefs.saturation === "low" ? "Low Saturation" : prefs.saturation === "high" ? "High Saturation" : "Saturation";

  return (
    <>
      <div aria-hidden className="fixed inset-0 z-[65] bg-black/20" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Accessibility options"
        className="fixed inset-x-3 top-16 z-[70] mx-auto max-h-[80vh] w-[min(460px,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-hairline bg-surface-card shadow-[0_16px_40px_rgba(12,10,9,0.18)] sm:inset-x-auto sm:right-4"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-2xl bg-[var(--color-primary-blue)] px-4 py-3 text-white">
          <p className="type-title-sm text-white">Accessibility options</p>
          <button
            type="button"
            onClick={close}
            aria-label="Close accessibility options"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5 p-4">
          <Tile sublabel={`Bigger Text (${fontPct}%)`} label="Bigger Text" active={prefs.fontScale > 1} onClick={prefs.increaseFontScale}>
            <span className="text-lg font-bold">T↑</span>
          </Tile>
          <Tile sublabel={`Smaller Text (${fontPct}%)`} label="Smaller Text" active={prefs.fontScale < 1} onClick={prefs.decreaseFontScale}>
            <span className="text-sm font-bold">T↓</span>
          </Tile>
          <Tile label="Text Spacing" active={prefs.textSpacing} onClick={prefs.toggleTextSpacing}>
            <span className="text-lg font-bold tracking-[0.2em]">A↔</span>
          </Tile>

          <Tile label="Line Height" active={prefs.lineHeightBoost} onClick={prefs.toggleLineHeightBoost}>
            <span className="text-lg font-bold">↕≡</span>
          </Tile>
          <Tile label="Dyslexia Friendly" active={prefs.dyslexiaFont} onClick={prefs.toggleDyslexiaFont}>
            <span className="text-lg font-bold">Df</span>
          </Tile>
          <Tile label="ADHD Mode" active={prefs.adhdMode} onClick={prefs.toggleAdhdMode}>
            <span className="text-lg">◫</span>
          </Tile>

          <Tile sublabel={saturationLabel} label="Saturation" active={prefs.saturation !== "normal"} onClick={prefs.cycleSaturation}>
            <span className="text-lg">◐</span>
          </Tile>
          <Tile label="Light-Dark" active={prefs.theme === "dark"} onClick={() => prefs.setTheme("dark")}>
            <span className="text-lg">☾</span>
          </Tile>
          <Tile label="Invert Colors" active={prefs.theme === "invert"} onClick={() => prefs.setTheme("invert")}>
            <span className="text-lg">◑</span>
          </Tile>

          <Tile label="Highlight Links" active={prefs.highlightLinks} onClick={prefs.toggleHighlightLinks}>
            <span className="text-lg">🔗</span>
          </Tile>
          <Tile label="Text To Speech" active={prefs.speakOnHover} onClick={prefs.toggleSpeakOnHover}>
            <span className="text-lg">🔊</span>
          </Tile>
          <Tile label="Cursor" active={prefs.cursorLarge} onClick={prefs.toggleCursorLarge}>
            <span className="text-lg">➤</span>
          </Tile>

          <Tile label="Pause Animation" active={prefs.pauseAnimation} onClick={prefs.togglePauseAnimation}>
            <span className="text-lg">⏸</span>
          </Tile>
          <Tile label="Hide Images" active={prefs.hideImages} onClick={prefs.toggleHideImages}>
            <span className="text-lg">🖼</span>
          </Tile>
        </div>

        <div className="px-4 pb-4">
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
