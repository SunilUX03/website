"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { hero, pillars } from "@/lib/content";
import { getServiceItemsByNames } from "@/lib/services-content";
import { Container } from "@/components/ui/Container";
import { LeadershipCard } from "@/components/hero/LeadershipCard";

type Pillar = (typeof pillars)[number];

const ACCENT: Record<string, string> = {
  "Citizen Services": "var(--color-gradient-sky)",
  "Interdepartmental Projects": "var(--color-gradient-lavender)",
  Services: "var(--color-gradient-mint)",
};

const ICON: Record<string, ReactNode> = {
  "Citizen Services": (
    <path
      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "Interdepartmental Projects": (
    <path
      d="M4 6h6v6H4V6Zm10 0h6v6h-6V6ZM4 16h6v2H4v-2Zm10 0h6v2h-6v-2M9 12v2m6-2v2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  Services: (
    <path
      d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2.1 2.1M8.6 15.4l-2.1 2.1m11-.1-2.1-2.1M8.6 8.6 6.5 6.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

/**
 * One "Enabling Digital Governance" tile. Default state is a compact
 * summary; hovering (desktop) or tapping the toggle (touch) cross-fades in
 * the same items the old carousel showed, as a static list — so all three
 * pillars stay visible at once instead of only one carousel band at a time.
 */
function PillarCard({ pillar }: { pillar: Pillar }) {
  const [open, setOpen] = useState(false);
  const items = getServiceItemsByNames(pillar.itemNames);
  const accent = ACCENT[pillar.title] ?? "var(--color-gradient-sky)";

  return (
    <div
      className="card-feature group relative flex h-[440px] flex-col overflow-hidden !p-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgba(12,10,9,0.14)]"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        aria-hidden
        className="absolute -right-10 -top-16 h-[220px] w-[220px] rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />

      <div className="relative flex flex-1 flex-col p-6 md:p-7">
        <span
          className="voice-icon-circular flex h-12 w-12 shrink-0 items-center justify-center text-ink"
          style={{ backgroundColor: accent }}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
            {ICON[pillar.title]}
          </svg>
        </span>

        <h3 className="type-title-md mt-4 text-ink">{pillar.title}</h3>

        {/* Fixed-height content well: description and item list occupy the
            same box and cross-fade, so the card never resizes on hover and
            the grid stays a stable single glance. */}
        <div className="relative mt-3 flex-1">
          <p
            className={`type-body-sm absolute inset-0 text-[var(--color-body)] transition-opacity duration-300 ${
              open ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            {pillar.description}
          </p>

          <ul
            className={`absolute inset-0 space-y-1.5 overflow-y-auto pr-1 transition-opacity duration-300 [scrollbar-width:thin] ${
              open ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {items.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.knowMoreHref}
                  className="voice-row flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--color-surface-strong)]"
                >
                  <span className="type-body-sm truncate text-ink">{item.name}</span>
                  <span className="type-caption shrink-0 text-[var(--color-muted)]">
                    {item.stats.split("·")[0].trim()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="type-caption-uppercase text-[var(--color-muted)]">
            {items.length} {items.length === 1 ? "project" : "projects"}
          </span>
          <Link
            href={pillar.href}
            aria-label={pillar.linkLabel}
            className="type-caption font-semibold text-[var(--color-primary-blue)] underline-offset-4 hover:underline"
          >
            View all
            <span aria-hidden>{" →"}</span>
          </Link>
        </div>
      </div>

      {/* Touch-only toggle — hover doesn't exist on touch, so this is the
          way in to the same detail there. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? `Hide ${pillar.title} projects` : `Show ${pillar.title} projects`}
        aria-expanded={open}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-hairline-strong bg-surface-card/90 text-ink md:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          fill="none"
          aria-hidden
        >
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function PillarCards() {
  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          Enabling Digital Governance
        </p>
        <h2 className="type-display-lg mb-8 max-w-2xl text-ink">
          How TNeGA powers governance across Tamil Nadu
        </h2>

        <div className="mb-10 flex flex-col flex-wrap items-start gap-3 rounded-xl border border-hairline bg-surface-card p-4 sm:flex-row sm:items-center sm:gap-5">
          <span className="type-caption-uppercase shrink-0 text-[var(--color-muted)]">
            Under the guidance of
          </span>
          <div className="flex flex-wrap gap-3">
            {hero.leaders.map((leader) => (
              <LeadershipCard key={leader.name} {...leader} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.title} pillar={pillar} />
          ))}
        </div>
      </Container>
    </section>
  );
}
