"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "tnega-a11y-prefs";

type Prefs = {
  fontScale: number;
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexiaFont: boolean;
};

const DEFAULT_PREFS: Prefs = {
  fontScale: 1,
  highContrast: false,
  reduceMotion: false,
  dyslexiaFont: false,
};

const FONT_SCALE_MIN = 0.85;
const FONT_SCALE_MAX = 1.4;
const FONT_SCALE_STEP = 0.1;

type AccessibilityContextValue = Prefs & {
  increaseFontScale: () => void;
  decreaseFontScale: () => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  toggleDyslexiaFont: () => void;
  reset: () => void;
  /** The panel is triggerable from more than one place (nav bar, footer),
   * so its open/close state and which element to return focus to on close
   * live here rather than being duplicated per caller. */
  panelOpen: boolean;
  openPanel: (trigger: HTMLElement | null) => void;
  closePanel: () => void;
  panelTrigger: HTMLElement | null;
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

/**
 * Native, first-party accessibility preferences — replaces dependence on
 * the third-party UX4G widget (cdn.ux4g.gov.in), whose own close button
 * doesn't work and which we don't control or can't guarantee stays online.
 * Every effect here is real CSS/DOM this codebase owns: font scale drives
 * `--a11y-scale`, which every `.type-*` class in globals.css multiplies its
 * own font-size by; high contrast and dyslexia-friendly font override the
 * same CSS custom properties every component already reads through
 * (`--color-*`, `--font-body`, `--font-display`); reduce motion is exposed
 * to `useReducedMotion()` so JS-driven animation loops (not just CSS
 * transitions) actually stop, not just visually mute.
 */
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTrigger, setPanelTrigger] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPrefs(loadPrefs());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    const root = document.documentElement;
    root.style.setProperty("--a11y-scale", String(prefs.fontScale));
    root.toggleAttribute("data-a11y-contrast", prefs.highContrast);
    root.toggleAttribute("data-a11y-motion-reduce", prefs.reduceMotion);
    root.toggleAttribute("data-a11y-dyslexic", prefs.dyslexiaFont);
  }, [prefs, hydrated]);

  const value: AccessibilityContextValue = {
    ...prefs,
    increaseFontScale: () =>
      setPrefs((p) => ({ ...p, fontScale: Math.min(FONT_SCALE_MAX, +(p.fontScale + FONT_SCALE_STEP).toFixed(2)) })),
    decreaseFontScale: () =>
      setPrefs((p) => ({ ...p, fontScale: Math.max(FONT_SCALE_MIN, +(p.fontScale - FONT_SCALE_STEP).toFixed(2)) })),
    toggleHighContrast: () => setPrefs((p) => ({ ...p, highContrast: !p.highContrast })),
    toggleReduceMotion: () => setPrefs((p) => ({ ...p, reduceMotion: !p.reduceMotion })),
    toggleDyslexiaFont: () => setPrefs((p) => ({ ...p, dyslexiaFont: !p.dyslexiaFont })),
    reset: () => setPrefs(DEFAULT_PREFS),
    panelOpen,
    panelTrigger,
    openPanel: (trigger: HTMLElement | null) => {
      setPanelTrigger(trigger);
      setPanelOpen(true);
    },
    closePanel: () => setPanelOpen(false),
  };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

/** Full read/write access to every preference — used by the toolbar UI. */
export function useAccessibilityPrefs(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibilityPrefs must be used within AccessibilityProvider");
  return ctx;
}

/** Read-only: whether the user has forced reduce-motion on, for callers
 * (useReducedMotion) that don't need the rest of the toolbar's state. */
export function useForcedReduceMotion(): boolean {
  return useContext(AccessibilityContext)?.reduceMotion ?? false;
}
