"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { useAccessibilityPrefs } from "@/lib/accessibility";
import { AccessibilityIcon, ExternalLinkArrow } from "./icons";
import type { Locale } from "@/lib/locale";

export function AccessibilityBar({ govLabel, locale }: { govLabel: string; locale: Locale }) {
  const router = useRouter();
  const { panelOpen, openPanel } = useAccessibilityPrefs();

  // Sets a plain preference cookie (no auth/security concern — just
  // which language to render) and asks the server to re-render with it.
  // No /ta URL prefix yet: same page, same address, content switches
  // locale in place.
  function switchLocale(next: Locale) {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <div className="w-full border-b border-hairline bg-canvas">
      <Container className="flex h-9 items-center justify-between gap-4 text-[13px]">
        <a
          href="https://www.tn.gov.in/index.php"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-1 text-[var(--color-muted)] hover:text-ink"
        >
          <span className="truncate">{govLabel}</span>
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
            onClick={() => switchLocale(locale === "en" ? "ta" : "en")}
            aria-label={locale === "en" ? "தமிழில் காட்டு" : "Show in English"}
            className="hover:text-ink"
          >
            {locale === "en" ? "தமிழ்" : "English"}
          </button>
        </div>

        {/* Mobile: collapse to icon + a compact language toggle (the
            language switch matters enough on a government site that it
            shouldn't be desktop-only, unlike the full accessibility
            panel). */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => switchLocale(locale === "en" ? "ta" : "en")}
            aria-label={locale === "en" ? "தமிழில் காட்டு" : "Show in English"}
            className="type-caption font-semibold text-[var(--color-muted)] hover:text-ink"
          >
            {locale === "en" ? "தமிழ்" : "EN"}
          </button>
          <button
            type="button"
            onClick={(e) => openPanel(e.currentTarget)}
            aria-pressed={panelOpen}
            className={clsx(
              "flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
              panelOpen
                ? "border-[var(--color-primary-blue)] text-[var(--color-primary-blue)]"
                : "border-hairline-strong text-[var(--color-muted)]"
            )}
            aria-label="Accessibility options"
          >
            <AccessibilityIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </Container>
    </div>
  );
}
