"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import clsx from "clsx";
import { nav } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { AccessibilityIcon, ExternalLinkArrow } from "./icons";

function isWidgetPanelOpen() {
  const panel = document.getElementById("uw-main");
  if (!panel) return false;
  // The widget slides #uw-main to right:0 when open, right:-530px (off
  // canvas) when closed — no class or event to hook, so we read this.
  return getComputedStyle(panel).right === "0px";
}

// Exported so the footer's "Accessibility" link can open the same panel
// instead of duplicating this logic or pointing at a dead "#" href.
export function toggleAccessibilityWidget() {
  if (isWidgetPanelOpen()) {
    // Confirmed the widget's own close button (.uwaw-close) doesn't
    // actually close the panel either — that's a bug in the third-party
    // script itself (cdn.ux4g.gov.in), not our integration. Since we
    // can't fix their code, we force it closed directly the same way the
    // widget itself closes it (sliding #uw-main back off-canvas).
    const panel = document.getElementById("uw-main");
    if (panel) panel.style.right = "-530px";
  } else {
    document.getElementById("uw-widget-custom-trigger")?.click();
  }
}

export function AccessibilityBar() {
  const [lang, setLang] = useState<"ta" | "en">("en");
  const [widgetOpen, setWidgetOpen] = useState(false);

  useEffect(() => {
    // The widget has no open/close event, so watch #uw-main's inline
    // style (how it actually signals open vs. closed) to keep our own
    // trigger's active color in sync.
    const observer = new MutationObserver(() => setWidgetOpen(isWidgetPanelOpen()));
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full border-b border-hairline bg-canvas">
      <Script src="https://cdn.ux4g.gov.in/tools/accessibility-widget.js" strategy="afterInteractive" async />

      <Container className="flex h-9 items-center justify-between gap-4 text-[13px]">
        <a
          href="https://www.tn.gov.in/index.php"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-1 text-[var(--color-muted)] hover:text-ink"
        >
          <span className="truncate">{nav.accessibility.govLabel}</span>
          <ExternalLinkArrow className="h-3 w-3 shrink-0" />
        </a>

        <div className="hidden items-center gap-4 text-[var(--color-muted)] sm:flex">
          <a href="#main-content" className="hover:text-ink">
            Skip to content
          </a>
          <span aria-hidden className="h-3 w-px bg-hairline-strong" />
          <button
            type="button"
            onClick={toggleAccessibilityWidget}
            aria-pressed={widgetOpen}
            className={clsx(
              "flex items-center gap-1.5 transition-colors",
              widgetOpen ? "text-[var(--color-primary-blue)]" : "hover:text-ink"
            )}
          >
            <AccessibilityIcon className="h-4 w-4" />
            Accessibility
          </button>
          <span aria-hidden className="h-3 w-px bg-hairline-strong" />
          <button
            type="button"
            onClick={() => setLang((l) => (l === "en" ? "ta" : "en"))}
            className="hover:text-ink"
          >
            {lang === "en" ? "தமிழ்" : "English"}
          </button>
        </div>

        {/* Mobile: collapse to one icon */}
        <button
          type="button"
          onClick={toggleAccessibilityWidget}
          aria-pressed={widgetOpen}
          className={clsx(
            "flex h-6 w-6 items-center justify-center rounded-full border transition-colors sm:hidden",
            widgetOpen
              ? "border-[var(--color-primary-blue)] text-[var(--color-primary-blue)]"
              : "border-hairline-strong text-[var(--color-muted)]"
          )}
          aria-label="Accessibility options"
        >
          <AccessibilityIcon className="h-3.5 w-3.5" />
        </button>
      </Container>
    </div>
  );
}
