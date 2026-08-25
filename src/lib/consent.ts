"use client";

// Cookie/analytics consent state — stored in localStorage (not a
// cookie), per the DPDPA-style guidance this project is following:
// consent *preferences* themselves should live in a mechanism that
// isn't itself a tracking cookie. Only once "analytics" is accepted
// does analytics-client.ts set an actual (anonymous) visitor-id cookie.
//
// Two categories, matching what this site actually has:
//  - functional: currently unused for anything gated (see Hero.tsx/
//    MainNav.tsx's language cookie, which this project treats as
//    strictly necessary — the whole site's bilingual content depends on
//    it with no fallback routing, so blocking it would break core
//    functionality for anyone who declines, not just "enhance" it).
//    Kept as a category anyway since a future functional cookie (e.g. a
//    genuine preference, not core routing) would need somewhere to plug
//    into without a schema change.
//  - analytics: gates the visitor-id cookie + all pageview/click/
//    conversion/accessibility-usage tracking (analytics-client.ts).

const STORAGE_KEY = "tnega-cookie-consent";

export type ConsentCategories = {
  functional: boolean;
  analytics: boolean;
};

export type ConsentState = ConsentCategories & {
  /** Whether the visitor has made ANY choice yet — false means the
   * banner should still show. Distinct from both categories being
   * false, since "decided, rejected everything" must not re-show the
   * banner on the next page. */
  decided: boolean;
};

const DEFAULT_STATE: ConsentState = { decided: false, functional: false, analytics: false };

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

const CONSENT_EVENT = "tnega-cookie-consent-changed";

export function setConsent(categories: ConsentCategories): void {
  const state: ConsentState = { ...categories, decided: true };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Same-tab listeners (the banner itself, the analytics tracker) don't
  // see the native `storage` event, which only fires in OTHER tabs —
  // dispatch our own so everything mounted right now reacts immediately
  // without needing a page reload.
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function acceptAllConsent(): void {
  setConsent({ functional: true, analytics: true });
}

export function rejectAllConsent(): void {
  setConsent({ functional: false, analytics: false });
}

/** Fires `handler` whenever consent changes (this tab only) — used by
 * analytics-client.ts to start/stop tracking the moment a visitor
 * accepts or withdraws, without requiring a reload. */
export function onConsentChange(handler: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

const OPEN_PREFERENCES_EVENT = "tnega-open-cookie-preferences";

/** Reopens the consent banner in "manage preferences" mode — the
 * footer's "Cookie Preferences" link calls this, matching the same
 * always-available-to-change pattern the "Accessibility" footer link
 * already uses for its own panel. */
export function openCookiePreferences(): void {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}

export function onOpenCookiePreferencesRequest(handler: () => void): () => void {
  window.addEventListener(OPEN_PREFERENCES_EVENT, handler);
  return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, handler);
}
