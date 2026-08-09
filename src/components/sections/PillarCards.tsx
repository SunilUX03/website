"use client";

import { useState } from "react";
import Link from "next/link";
import { pillars } from "@/lib/content";
import type { CmsServiceItemDetail } from "@/lib/cms/service-types";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";

type Pillar = (typeof pillars)[number];
type Items = CmsServiceItemDetail[];

/**
 * Desktop pillar card — flips in place on hover/focus, nothing else
 * changes: front is photo + heading + description + "View all", back is
 * a plain divided list of project names with a one-line summary and a
 * trailing arrow, ending in the same "View all" link. No icons, no
 * accordion resizing — all three cards stay the same size the whole time.
 */
function FlipCard({ pillar, items, bannerImage }: {
  pillar: Pillar;
  items: Items;
  bannerImage: string | undefined;
}) {
  return (
    <div className="group h-[420px] flex-1 [perspective:1600px]">
      <div className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(.22,.9,.34,1)] [transform-style:preserve-3d] motion-reduce:transition-none group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-[0_10px_30px_rgba(12,10,9,0.06)] [backface-visibility:hidden]">
          {bannerImage && (
            <PhotoTile
              src={bannerImage}
              alt=""
              aspect="aspect-[16/9]"
              className="shrink-0"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          )}
          <div className="flex flex-1 flex-col p-6">
            <h3 className="type-title-md text-ink">{pillar.title}</h3>
            {/* line-clamp-4 (not flex-1) caps this at a fixed height —
                flex-1 only sets a growth preference, it doesn't stop text
                from overflowing past the card's fixed height when a
                pillar's description is longer than the others', which is
                exactly what pushed "View all Services" lower than the
                other two cards' links. mt-auto on the Link is what then
                anchors it to the same bottom row regardless of whether
                the (now-capped) description took 2 lines or 4. */}
            <p className="type-body-sm mt-2 line-clamp-4 text-[var(--color-body)]">{pillar.description}</p>
            <Link
              href={pillar.href}
              className="type-caption mt-auto pt-4 shrink-0 font-semibold text-[var(--color-primary-blue)] underline-offset-4 hover:underline"
            >
              {pillar.linkLabel}
              <span aria-hidden>{" →"}</span>
            </Link>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-card p-6 shadow-[0_10px_30px_rgba(12,10,9,0.06)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex-1 divide-y divide-hairline overflow-y-auto [scrollbar-width:thin]">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.knowMoreHref}
                className="flex items-center justify-between gap-3 py-3 first:pt-0"
              >
                <span className="min-w-0">
                  <span className="type-body-strong block truncate text-ink">{item.name}</span>
                  <span className="type-caption line-clamp-2 text-[var(--color-muted)]">{item.description}</span>
                </span>
                <span aria-hidden className="shrink-0 text-[var(--color-muted)]">
                  →
                </span>
              </Link>
            ))}
          </div>
          <Link
            href={pillar.href}
            className="type-caption mt-3 shrink-0 border-t border-hairline pt-3 text-center font-semibold text-[var(--color-primary-blue)] underline-offset-4 hover:underline"
          >
            {pillar.linkLabel}
            <span aria-hidden>{" →"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Mobile: a plain tap-to-expand accordion — no flip (no hover on touch),
 * same divided project list as the desktop card's back face. */
function MobileAccordion({ pillar, items, bannerImage, open, onToggle }: {
  pillar: Pillar;
  items: Items;
  bannerImage: string | undefined;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-surface-card">
      {bannerImage && <PhotoTile src={bannerImage} alt="" aspect="aspect-[16/9]" sizes="100vw" />}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-5 text-left"
      >
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
          <div className="divide-y divide-hairline px-5">
            {items.map((item) => (
              <Link key={item.name} href={item.knowMoreHref} className="flex items-center justify-between gap-3 py-3">
                <span className="min-w-0">
                  <span className="type-body-strong block truncate text-ink">{item.name}</span>
                  <span className="type-caption line-clamp-2 text-[var(--color-muted)]">{item.description}</span>
                </span>
                <span aria-hidden className="shrink-0 text-[var(--color-muted)]">
                  →
                </span>
              </Link>
            ))}
          </div>
          <Link
            href={pillar.href}
            className="type-caption block px-5 pb-5 pt-4 text-center font-semibold text-[var(--color-primary-blue)] underline-offset-4 hover:underline"
          >
            {pillar.linkLabel}
            <span aria-hidden>{" →"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PillarCards({ pillarItems }: { pillarItems: Items[] }) {
  const [mobileOpen, setMobileOpen] = useState<number>(-1);

  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          Enabling Digital Governance
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-balance text-ink">
          How TNeGA powers governance across Tamil Nadu
        </h2>

        {/* Desktop / tablet: three equal flip cards */}
        <div className="hidden gap-4 md:flex">
          {pillars.map((pillar, i) => (
            <FlipCard key={pillar.title} pillar={pillar} items={pillarItems[i]} bannerImage={pillar.bannerImage} />
          ))}
        </div>

        {/* Mobile: stacked tap accordion */}
        <div className="flex flex-col gap-4 md:hidden">
          {pillars.map((pillar, i) => (
            <MobileAccordion
              key={pillar.title}
              pillar={pillar}
              items={pillarItems[i]}
              bannerImage={pillar.bannerImage}
              open={mobileOpen === i}
              onToggle={() => setMobileOpen((cur) => (cur === i ? -1 : i))}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
