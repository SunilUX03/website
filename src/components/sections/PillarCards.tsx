"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { pillars } from "@/lib/content";
import { getServiceItemsByNames } from "@/lib/services-content";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";

type Pillar = (typeof pillars)[number];
type Items = ReturnType<typeof getServiceItemsByNames>;

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

function ProjectCard({ item }: { item: Items[number] }) {
  return (
    <Link
      href={item.knowMoreHref}
      className="group/card flex w-[168px] shrink-0 flex-col overflow-hidden rounded-xl border border-hairline bg-canvas transition-colors hover:border-hairline-strong"
    >
      <PhotoTile
        src={item.image}
        alt=""
        aspect="aspect-[4/3]"
        className="transition-transform duration-300 group-hover/card:scale-[1.04]"
        sizes="168px"
      />
      <div className="p-3">
        <p className="type-body-sm truncate text-ink">{item.name}</p>
        <p className="type-caption mt-0.5 truncate text-[var(--color-muted)]">
          {item.stats.split("·")[0].trim()}
        </p>
      </div>
    </Link>
  );
}

/**
 * One rail in the floating hover-accordion: narrow with an icon and a
 * vertically-set heading when it isn't the active pillar, wide with the
 * pillar's project cards in a horizontal-scroll row when it is.
 */
function DesktopRail({ pillar, items, active, onActivate }: {
  pillar: Pillar;
  items: Items;
  active: boolean;
  onActivate: () => void;
}) {
  const accent = ACCENT[pillar.title] ?? "var(--color-gradient-sky)";

  return (
    <div
      className="relative h-[480px] overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-[0_10px_30px_rgba(12,10,9,0.06)] transition-[flex-basis] duration-500 ease-[cubic-bezier(.22,.9,.34,1)]"
      style={{ flexBasis: active ? "66%" : "17%", flexGrow: 0, flexShrink: 0 }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onActivate();
      }}
      onFocus={onActivate}
    >
      {/* Collapsed face — icon + vertical heading, cross-fades out */}
      <button
        type="button"
        onClick={onActivate}
        aria-label={`Show ${pillar.title} projects`}
        className={`absolute inset-0 flex h-full w-full flex-col items-center justify-between gap-6 py-8 transition-opacity duration-300 ${
          active ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <span
          className="voice-icon-circular flex h-11 w-11 shrink-0 items-center justify-center text-ink"
          style={{ backgroundColor: accent }}
        >
          <PillarIcon title={pillar.title} className="h-5 w-5" />
        </span>
        <span
          className="type-title-sm flex-1 whitespace-nowrap text-ink"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {pillar.title}
        </span>
        <span className="type-caption text-[var(--color-muted)]">{items.length}</span>
      </button>

      {/* Expanded face — header + project cards */}
      <div
        className={`absolute inset-0 flex h-full flex-col p-6 transition-opacity duration-300 ${
          active ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mb-4 flex shrink-0 items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              className="voice-icon-circular flex h-10 w-10 shrink-0 items-center justify-center text-ink"
              style={{ backgroundColor: accent }}
            >
              <PillarIcon title={pillar.title} className="h-5 w-5" />
            </span>
            <div>
              <h3 className="type-title-md text-ink">{pillar.title}</h3>
              <p className="type-body-sm mt-1 max-w-[46ch] text-[var(--color-body)]">{pillar.description}</p>
            </div>
          </div>
          <Link
            href={pillar.href}
            aria-label={pillar.linkLabel}
            className="type-caption shrink-0 whitespace-nowrap font-semibold text-[var(--color-primary-blue)] underline-offset-4 hover:underline"
          >
            View all
            <span aria-hidden>{" →"}</span>
          </Link>
        </div>

        <div className="flex flex-1 gap-3 overflow-x-auto pb-1 pr-1 [scrollbar-width:thin]">
          {items.map((item) => (
            <ProjectCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Mobile: a plain tap-to-expand accordion — no rotated text, no
 * horizontal rail metaphor, since neither survives a 375px viewport. */
function MobileAccordion({ pillar, items, open, onToggle }: {
  pillar: Pillar;
  items: Items;
  open: boolean;
  onToggle: () => void;
}) {
  const accent = ACCENT[pillar.title] ?? "var(--color-gradient-sky)";

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-surface-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-5 text-left"
      >
        <span
          className="voice-icon-circular flex h-10 w-10 shrink-0 items-center justify-center text-ink"
          style={{ backgroundColor: accent }}
        >
          <PillarIcon title={pillar.title} className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="type-title-sm block text-ink">{pillar.title}</span>
          <span className="type-caption text-[var(--color-muted)]">{items.length} projects</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-5 w-5 shrink-0 text-[var(--color-muted)] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="type-body-sm px-5 pb-4 text-[var(--color-body)]">{pillar.description}</p>
          <div className="flex gap-3 overflow-x-auto px-5 pb-5 [scrollbar-width:thin]">
            {items.map((item) => (
              <ProjectCard key={item.name} item={item} />
            ))}
          </div>
          <Link
            href={pillar.href}
            className="type-caption block px-5 pb-5 font-semibold text-[var(--color-primary-blue)] underline-offset-4 hover:underline"
          >
            View all {pillar.title}
            <span aria-hidden>{" →"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PillarCards() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState<number>(0);
  const active = hovered ?? 0;

  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          Enabling Digital Governance
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">
          How TNeGA powers governance across Tamil Nadu
        </h2>

        {/* Desktop / tablet: floating hover-accordion rail */}
        <div
          className="hidden gap-4 md:flex"
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setHovered(null);
          }}
        >
          {pillars.map((pillar, i) => (
            <DesktopRail
              key={pillar.title}
              pillar={pillar}
              items={PILLAR_ITEMS[i]}
              active={active === i}
              onActivate={() => setHovered(i)}
            />
          ))}
        </div>

        {/* Mobile: stacked tap accordion */}
        <div className="flex flex-col gap-4 md:hidden">
          {pillars.map((pillar, i) => (
            <MobileAccordion
              key={pillar.title}
              pillar={pillar}
              items={PILLAR_ITEMS[i]}
              open={mobileOpen === i}
              onToggle={() => setMobileOpen((cur) => (cur === i ? -1 : i))}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
