"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackClick, trackConversion } from "@/lib/analytics-client";

/** One delegated click listener for the whole app, mounted once in the
 * root layout — cheaper and far less invasive than wiring an onClick
 * handler (and importing analytics-client) into every button/link we
 * want counted. Any element tagged `data-track="some_label"` gets
 * counted on click; add `data-track-type="conversion"` to count it as a
 * conversion instead of a plain click. Doesn't touch or interfere with
 * the element's own click behaviour (link navigation, form submission,
 * existing onClick handlers) — this only ever reads the DOM, in a
 * separate listener, after the event has already fired. */
export function AnalyticsClickTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/cms") || pathname?.startsWith("/career-portal")) return;

    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const label = el.dataset.track;
      if (!label) return;
      if (el.dataset.trackType === "conversion") trackConversion(label);
      else trackClick(label);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  return null;
}
