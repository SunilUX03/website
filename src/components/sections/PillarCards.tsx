"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { pillars } from "@/lib/content";
import { getServiceItemsByNames } from "@/lib/services-content";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";

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

const PILLAR_ITEMS = pillars.map((p) => getServiceItemsByNames(p.itemNames));

function PillarIcon({ title, className }: { title: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      {ICON[title]}
    </svg>
  );
}

/**
 * Grid card. `isOpen` swaps it from the default image+blurb summary to a
 * taller, elevated project list (thumbnails + stats) — content is driven
 * by `displayPillar`/`displayItems`, which can differ from this card's own
 * pillar once the bottom tab row inside the elevated card is used to
 * switch, so the elevated card stays put while what it shows changes.
 */
function PillarCard({
  pillar,
  items,
  isOpen,
  faded,
  displayPillar,
  displayItems,
  onOpen,
  onClose,
  onSelectPillar,
}: {
  pillar: Pillar;
  items: ReturnType<typeof getServiceItemsByNames>;
  isOpen: boolean;
  faded: boolean;
  displayPillar: Pillar;
  displayItems: ReturnType<typeof getServiceItemsByNames>;
  onOpen: () => void;
  onClose: () => void;
  onSelectPillar: (i: number) => void;
}) {
  const accent = ACCENT[pillar.title] ?? "var(--color-gradient-sky)";
  const cover = items[0]?.image;

  return (
    <div
      className={`card-feature group relative flex flex-col overflow-hidden !p-0 transition-all duration-300 ease-out ${
        isOpen
          ? "z-20 h-auto min-h-[500px] -translate-y-2 shadow-[0_28px_56px_rgba(12,10,9,0.20)] md:h-[500px] md:min-h-0"
          : "h-[440px] shadow-none"
      } ${faded ? "md:scale-[0.97] md:opacity-70" : ""}`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onOpen();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") onClose();
      }}
    >
      {/* ---------- Default summary ---------- */}
      <div
        className={`flex h-full flex-col transition-opacity duration-200 ${
          isOpen ? "pointer-events-none absolute inset-0 opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative h-[42%] shrink-0 overflow-hidden">
          {cover && <PhotoTile src={cover} alt="" aspect="aspect-auto" className="h-full w-full" sizes="(min-width: 768px) 33vw, 100vw" />}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(12,10,9,0.35) 0%, transparent 55%)" }}
          />
          <span
            className="voice-icon-circular absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center text-ink shadow-[0_6px_16px_rgba(12,10,9,0.18)]"
            style={{ backgroundColor: accent }}
          >
            <PillarIcon title={pillar.title} className="h-5 w-5" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6 md:p-7">
          <h3 className="type-title-md text-ink">{pillar.title}</h3>
          <p className="type-body-sm mt-2 flex-1 text-[var(--color-body)]">{pillar.description}</p>

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
              <span aria-hidden>{" →"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- Expanded / elevated: shared pillar switcher ---------- */}
      <div
        className={`flex h-full flex-col p-5 transition-opacity duration-200 md:p-6 ${
          isOpen ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
        }`}
      >
        <div className="mb-3 flex shrink-0 items-center gap-3">
          <span
            className="voice-icon-circular flex h-9 w-9 shrink-0 items-center justify-center text-ink"
            style={{ backgroundColor: ACCENT[displayPillar.title] }}
          >
            <PillarIcon title={displayPillar.title} className="h-4 w-4" />
          </span>
          <h3 className="type-title-sm text-ink">{displayPillar.title}</h3>
        </div>

        <ul className="flex-1 space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
          {displayItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.knowMoreHref}
                className="voice-row flex items-center gap-3 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-[var(--color-surface-strong)]"
              >
                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md">
                  <PhotoTile src={item.image} alt="" aspect="aspect-auto" className="h-full w-full" sizes="32px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="type-body-sm block truncate text-ink">{item.name}</span>
                </span>
                <span className="type-caption shrink-0 text-[var(--color-muted)]">
                  {item.stats.split("·")[0].trim()}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex shrink-0 items-center justify-between gap-3 border-t border-hairline pt-3">
          <div className="flex gap-1.5">
            {pillars.map((p, i) => (
              <button
                key={p.title}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPillar(i);
                }}
                aria-label={`Show ${p.title}`}
                aria-current={p.title === displayPillar.title}
                className={`h-2 rounded-full transition-all duration-200 ${
                  p.title === displayPillar.title
                    ? "w-6 bg-[var(--color-primary-blue)]"
                    : "w-2 bg-[var(--color-hairline-strong)] hover:bg-[var(--color-muted)]"
                }`}
              />
            ))}
          </div>
          <Link
            href={displayPillar.href}
            className="type-caption shrink-0 font-semibold text-[var(--color-primary-blue)] underline-offset-4 hover:underline"
          >
            View all
            <span aria-hidden>{" →"}</span>
          </Link>
        </div>
      </div>

      {/* Touch-only toggle — hover doesn't exist on touch. */}
      <button
        type="button"
        onClick={() => (isOpen ? onClose() : onOpen())}
        aria-label={isOpen ? `Hide ${pillar.title} projects` : `Show ${pillar.title} projects`}
        aria-expanded={isOpen}
        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-hairline-strong bg-surface-card/90 text-ink md:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
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
  // Which card is visually open (elevated). Set by a mouse hover-enter on
  // desktop or the tap-toggle on touch — both funnel into the same state,
  // guarded to mouse-only in the pointer handlers below so a stray touch
  // "hover" can't fight the tap toggle.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Which pillar's content the open card is currently showing — defaults
  // to the open card's own pillar, but can diverge after a tab click
  // inside it, without moving the elevated card itself.
  const [switchedIndex, setSwitchedIndex] = useState<number | null>(null);

  const displayIndex = switchedIndex ?? openIndex ?? 0;

  const open = (i: number) => {
    setOpenIndex(i);
    setSwitchedIndex(null);
  };
  const close = () => {
    setOpenIndex(null);
    setSwitchedIndex(null);
  };

  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          Enabling Digital Governance
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">
          How TNeGA powers governance across Tamil Nadu
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <PillarCard
              key={pillar.title}
              pillar={pillar}
              items={PILLAR_ITEMS[i]}
              isOpen={openIndex === i}
              faded={openIndex !== null && openIndex !== i}
              displayPillar={pillars[openIndex === i ? displayIndex : i]}
              displayItems={PILLAR_ITEMS[openIndex === i ? displayIndex : i]}
              onOpen={() => open(i)}
              onClose={close}
              onSelectPillar={setSwitchedIndex}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
