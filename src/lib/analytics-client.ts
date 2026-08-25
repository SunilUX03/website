"use client";

import { getConsent } from "@/lib/consent";

// Thin client for the self-hosted analytics pipeline (see
// src/app/(frontend)/api/analytics/track/route.ts and the
// `analytics_events` table). Every call here is a no-op unless the
// visitor has accepted the "analytics" cookie category — checked fresh
// on every call rather than cached, so withdrawing consent mid-session
// (via the cookie preferences panel) takes effect on the very next
// event, not just the next page load.

const VISITOR_COOKIE = "tnega_visitor_id";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Only ever called once analytics consent is confirmed — this is the
 * one cookie in the whole analytics system, and it's nothing but a
 * random anonymous id (no name/email/IP baked in), matching the
 * data-minimization rule from the compliance spec this is built to. */
function getOrCreateVisitorId(): string {
  const existing = readCookie(VISITOR_COOKIE);
  if (existing) return existing;
  const id = crypto.randomUUID();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${VISITOR_COOKIE}=${id}; path=/; max-age=${VISITOR_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  return id;
}

/** Deletes the visitor-id cookie — called when analytics consent is
 * withdrawn, so nothing lingers on the browser once the visitor has
 * said no. */
export function clearVisitorId(): void {
  document.cookie = `${VISITOR_COOKIE}=; path=/; max-age=0`;
}

function detectDevice(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function detectLocale(): string {
  return readCookie("NEXT_LOCALE") === "ta" ? "ta" : "en";
}

type EventType = "pageview" | "click" | "conversion" | "accessibility";

function send(type: EventType, path: string, label?: string): void {
  if (!getConsent().analytics) return;
  const body = JSON.stringify({
    type,
    path,
    label,
    visitorId: getOrCreateVisitorId(),
    locale: detectLocale(),
    device: detectDevice(),
  });
  const url = "/api/analytics/track";
  // sendBeacon survives the page unloading (important for the last
  // click before navigation/close); fetch with keepalive is the
  // fallback for browsers/contexts where sendBeacon isn't available.
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
  }
}

export function trackPageview(path: string): void {
  send("pageview", path);
}

export function trackClick(label: string, path: string = window.location.pathname): void {
  send("click", path, label);
}

export function trackConversion(label: string, path: string = window.location.pathname): void {
  send("conversion", path, label);
}

export function trackAccessibility(label: string, path: string = window.location.pathname): void {
  send("accessibility", path, label);
}
