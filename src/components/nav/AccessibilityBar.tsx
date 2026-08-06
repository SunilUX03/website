"use client";

import { useState } from "react";
import clsx from "clsx";
import { nav } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { useAccessibilityPrefs } from "@/lib/accessibility";
import { AccessibilityIcon, ExternalLinkArrow } from "./icons";

export function AccessibilityBar() {
  const [lang, setLang] = useState<"ta" | "en">("en");
  const { panelOpen, openPanel } = useAccessibilityPrefs();

  return (
    <div className="w-full border-b border-hairline bg-canvas">
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
            onClick={(e) => openPanel(e.currentTarget)}
            aria-pressed={panelOpen}
            className={clsx(
              "flex items-center gap-1.5 transition-colors",
              panelOpen ? "text-[var(--color-primary-blue)]" : "hover:text-ink"
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
          onClick={(e) => openPanel(e.currentTarget)}
          aria-pressed={panelOpen}
          className={clsx(
            "flex h-6 w-6 items-center justify-center rounded-full border transition-colors sm:hidden",
            panelOpen
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
