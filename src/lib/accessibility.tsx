"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "tnega-a11y-prefs";

type Saturation = "normal" | "low" | "high";
type Theme = "normal" | "dark" | "invert";

type Prefs = {
  fontScale: number;
  textSpacing: boolean;
  lineHeightBoost: boolean;
  dyslexiaFont: boolean;
  adhdMode: boolean;
  saturation: Saturation;
  theme: Theme;
  highlightLinks: boolean;
  speakOnHover: boolean;
  cursorLarge: boolean;
  pauseAnimation: boolean;
  hideImages: boolean;
};

const DEFAULT_PREFS: Prefs = {
  fontScale: 1,
  textSpacing: false,
  lineHeightBoost: false,
  dyslexiaFont: false,
  adhdMode: false,
  saturation: "normal",
  theme: "normal",
  highlightLinks: false,
  speakOnHover: false,
  cursorLarge: false,
  pauseAnimation: false,
  hideImages: false,
};

const FONT_SCALE_MIN = 0.85;
const FONT_SCALE_MAX = 1.4;
const FONT_SCALE_STEP = 0.1;
const SATURATION_CYCLE: Saturation[] = ["normal", "low", "high"];

type AccessibilityContextValue = Prefs & {
  increaseFontScale: () => void;
  decreaseFontScale: () => void;
  toggleTextSpacing: () => void;
  toggleLineHeightBoost: () => void;
  toggleDyslexiaFont: () => void;
  toggleAdhdMode: () => void;
  cycleSaturation: () => void;
  setTheme: (theme: Theme) => void;
  toggleHighlightLinks: () => void;
  toggleSpeakOnHover: () => void;
  toggleCursorLarge: () => void;
  togglePauseAnimation: () => void;
  toggleHideImages: () => void;
  reset: () => void;
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

/** Reads aloud whichever element the pointer is currently over, cancelling
 * any utterance already in progress — only attached while speakOnHover is
 * on, and only on pointer (mouse), never touch, since "hover" has no touch
 * equivalent and would otherwise fire on every tap. */
function useSpeakOnHover(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    let lastEl: Element | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element)?.closest("a, button, h1, h2, h3, h4, p, li, span, td, th, label");
      if (!el || el === lastEl) return;
      lastEl = el;
      const text = el.textContent?.trim();
      if (!text) return;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    };

    document.addEventListener("pointermove", onMove);
    return () => {
      document.removeEventListener("pointermove", onMove);
      window.speechSynthesis?.cancel();
    };
  }, [enabled]);
}

/** ADHD reading guide — a translucent mask over the whole page with a clear
 * horizontal band that follows the cursor, so only a line of text at a time
 * is fully visible. Pure DOM/CSS, no canvas needed for a couple of rects. */
function AdhdReadingGuide({ enabled }: { enabled: boolean }) {
  const [y, setY] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => setY(e.clientY);
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  if (!enabled || y === null) return null;
  const bandHeight = 64;

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden>
      <div className="absolute inset-x-0 top-0 bg-black/45" style={{ height: Math.max(0, y - bandHeight / 2) }} />
      <div
        className="absolute inset-x-0 bottom-0 bg-black/45"
        style={{ top: y + bandHeight / 2 }}
      />
      <div
        className="absolute inset-x-0 border-y-2 border-[var(--color-primary-blue)]"
        style={{ top: y - bandHeight / 2, height: bandHeight }}
      />
    </div>
  );
}

/**
 * Native, first-party accessibility preferences — replaces dependence on
 * the third-party UX4G widget (cdn.ux4g.gov.in), whose own close button
 * doesn't work and which we don't control or can't guarantee stays online.
 * Text size, spacing, line height, dyslexia font, saturation, theme and
 * highlight-links all drive CSS custom properties / data-attributes that
 * globals.css keys off — every component already reads through
 * var(--color-*)/var(--font-*) or the shared .type-* classes, so none of
 * them need to know these modes exist. ADHD mode and text-to-speech are
 * genuinely interactive (mouse position, live speech) so those are handled
 * here as real DOM listeners rather than pure CSS.
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
    root.toggleAttribute("data-a11y-spacing", prefs.textSpacing);
    root.toggleAttribute("data-a11y-line-height", prefs.lineHeightBoost);
    root.toggleAttribute("data-a11y-dyslexic", prefs.dyslexiaFont);
    root.toggleAttribute("data-a11y-highlight-links", prefs.highlightLinks);
    root.toggleAttribute("data-a11y-cursor-large", prefs.cursorLarge);
    root.toggleAttribute("data-a11y-hide-images", prefs.hideImages);
    root.toggleAttribute("data-a11y-motion-reduce", prefs.pauseAnimation);
    if (prefs.saturation === "normal") root.removeAttribute("data-a11y-saturation");
    else root.setAttribute("data-a11y-saturation", prefs.saturation);
    if (prefs.theme === "normal") root.removeAttribute("data-a11y-theme");
    else root.setAttribute("data-a11y-theme", prefs.theme);
  }, [prefs, hydrated]);

  useSpeakOnHover(prefs.speakOnHover);

  const value: AccessibilityContextValue = {
    ...prefs,
    increaseFontScale: () =>
      setPrefs((p) => ({ ...p, fontScale: Math.min(FONT_SCALE_MAX, +(p.fontScale + FONT_SCALE_STEP).toFixed(2)) })),
    decreaseFontScale: () =>
      setPrefs((p) => ({ ...p, fontScale: Math.max(FONT_SCALE_MIN, +(p.fontScale - FONT_SCALE_STEP).toFixed(2)) })),
    toggleTextSpacing: () => setPrefs((p) => ({ ...p, textSpacing: !p.textSpacing })),
    toggleLineHeightBoost: () => setPrefs((p) => ({ ...p, lineHeightBoost: !p.lineHeightBoost })),
    toggleDyslexiaFont: () => setPrefs((p) => ({ ...p, dyslexiaFont: !p.dyslexiaFont })),
    toggleAdhdMode: () => setPrefs((p) => ({ ...p, adhdMode: !p.adhdMode })),
    cycleSaturation: () =>
      setPrefs((p) => {
        const next = SATURATION_CYCLE[(SATURATION_CYCLE.indexOf(p.saturation) + 1) % SATURATION_CYCLE.length];
        return { ...p, saturation: next };
      }),
    setTheme: (theme: Theme) => setPrefs((p) => ({ ...p, theme: p.theme === theme ? "normal" : theme })),
    toggleHighlightLinks: () => setPrefs((p) => ({ ...p, highlightLinks: !p.highlightLinks })),
    toggleSpeakOnHover: () => setPrefs((p) => ({ ...p, speakOnHover: !p.speakOnHover })),
    toggleCursorLarge: () => setPrefs((p) => ({ ...p, cursorLarge: !p.cursorLarge })),
    togglePauseAnimation: () => setPrefs((p) => ({ ...p, pauseAnimation: !p.pauseAnimation })),
    toggleHideImages: () => setPrefs((p) => ({ ...p, hideImages: !p.hideImages })),
    reset: () => setPrefs(DEFAULT_PREFS),
    panelOpen,
    panelTrigger,
    openPanel: (trigger: HTMLElement | null) => {
      setPanelTrigger(trigger);
      setPanelOpen(true);
    },
    closePanel: () => setPanelOpen(false),
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      <AdhdReadingGuide enabled={hydrated && prefs.adhdMode} />
    </AccessibilityContext.Provider>
  );
}

/** Full read/write access to every preference — used by the toolbar UI. */
export function useAccessibilityPrefs(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibilityPrefs must be used within AccessibilityProvider");
  return ctx;
}

/** Read-only: whether the user has forced reduce-motion ("Pause
 * Animation") on, for callers (useReducedMotion) that don't need the rest
 * of the toolbar's state. */
export function useForcedReduceMotion(): boolean {
  return useContext(AccessibilityContext)?.pauseAnimation ?? false;
}
