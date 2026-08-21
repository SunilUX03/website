import { cookies } from "next/headers";

export type Locale = "en" | "ta";

const COOKIE_NAME = "NEXT_LOCALE";

/** Reads the visitor's chosen site language from a cookie (set by the
 * தமிழ்/English toggle in AccessibilityBar.tsx). No URL-based routing
 * yet — same page, same URL, content just switches locale — so this is
 * the only place that needs to know how the preference is stored. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  return value === "ta" ? "ta" : "en";
}
