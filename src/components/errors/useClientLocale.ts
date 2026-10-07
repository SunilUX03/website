"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/lib/locale";

const noopSubscribe = () => () => {};

/** The visitor's chosen language, for Client Components that can't call the
 * server-only getLocale(). Reads the same NEXT_LOCALE cookie; the server
 * snapshot is English so hydration never mismatches. */
export function useClientLocale(): Locale {
  return useSyncExternalStore(
    noopSubscribe,
    () => (/(?:^|;\s*)NEXT_LOCALE=ta(?:;|$)/.test(document.cookie) ? "ta" : "en"),
    () => "en"
  );
}
