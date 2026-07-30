"use client";

import { useState } from "react";
import Image from "next/image";
import { nav } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export function AccessibilityBar() {
  const [lang, setLang] = useState<"ta" | "en">("en");
  const [textSize, setTextSize] = useState<"sm" | "md" | "lg">("md");
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="w-full border-b border-hairline bg-canvas">
      <Container className="flex h-9 items-center justify-between gap-4 text-[13px]">
        <div className="flex items-center gap-2 truncate text-[var(--color-muted)]">
          <Image
            src="/images/tn-emblem.png"
            alt=""
            aria-hidden
            width={178}
            height={186}
            className="h-5 w-auto shrink-0"
          />
          <span className="truncate">{nav.accessibility.govLabel}</span>
        </div>

        <div className="hidden items-center gap-4 text-[var(--color-muted)] sm:flex">
          <a href="#main-content" className="hover:text-ink">
            Skip to content
          </a>
          <span aria-hidden className="h-3 w-px bg-hairline-strong" />
          <button type="button" className="hover:text-ink" aria-label="Screen reader access">
            Screen Reader Access
          </button>
          <span aria-hidden className="h-3 w-px bg-hairline-strong" />
          <div className="flex items-center gap-1" role="group" aria-label="Text size">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTextSize(s)}
                aria-pressed={textSize === s}
                className={`px-1 hover:text-ink ${
                  textSize === s ? "text-ink font-medium" : ""
                }`}
              >
                {s === "sm" ? "A-" : s === "md" ? "A" : "A+"}
              </button>
            ))}
          </div>
          <span aria-hidden className="h-3 w-px bg-hairline-strong" />
          <button
            type="button"
            onClick={() => setHighContrast((v) => !v)}
            aria-pressed={highContrast}
            className="hover:text-ink"
          >
            Contrast
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

        {/* Mobile: collapse accessibility options to one icon */}
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-hairline-strong text-[var(--color-muted)] sm:hidden"
          aria-label="Accessibility options"
        >
          <span aria-hidden>A</span>
        </button>
      </Container>
    </div>
  );
}
