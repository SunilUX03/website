"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageview } from "@/lib/analytics-client";

/** Fires a pageview event on every route change — mounted once in the
 * root layout. trackPageview() itself is a no-op unless analytics
 * consent has been given, so this is safe to mount unconditionally. */
export function AnalyticsPageviewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/cms") || pathname?.startsWith("/career-portal")) return;
    trackPageview(pathname);
  }, [pathname]);

  return null;
}
