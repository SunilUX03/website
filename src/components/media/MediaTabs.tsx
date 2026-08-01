"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { FilterBar, matchesFacets } from "@/components/documents/FilterBar";
import {
  facets,
  filterBarLabel,
  noResultsText,
  photos,
  searchAriaLabel,
  searchPlaceholder,
  videos,
  yearOf,
  type MediaItem,
} from "@/lib/media-content";

/**
 * Photos / Videos toggle from the Media & Press prototype.
 *
 * Kept as a real tablist: the buttons carry role="tab" with
 * aria-selected + aria-controls, and the inactive panel is `hidden`
 * rather than visually hidden, so assistive tech doesn't announce both
 * sets of cards at once.
 *
 * A search box and year filter sit above the tabs, using the same shared
 * FilterBar as the document pages. Filtering applies to both panels at
 * once, and each tab label shows its live match count so it's obvious
 * when a query has hits in the panel you're not currently looking at.
 *
 * Video cards render a play affordance but have no player attached yet —
 * the prototype had none either. Point them at real video URLs (or a
 * lightbox) when the media library exists.
 */

type PanelId = "photos" | "videos";

function PlayBadge() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors group-hover:bg-black/25"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-white/95 shadow-sm">
        <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-ink">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </span>
    </div>
  );
}

function MediaGrid({
  items,
  isVideo,
}: {
  items: MediaItem[];
  isVideo: boolean;
}) {
  return (
    <ul
      role="list"
      className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="group overflow-hidden rounded-xl border border-hairline bg-surface-card transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
        >
          <div className="relative aspect-[10/7] overflow-hidden bg-surface-strong">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
            {isVideo ? <PlayBadge /> : null}
          </div>
          <div className="flex flex-col gap-xxs p-base">
            <p className="type-body-strong text-[var(--color-body-strong)]">
              {item.caption}
            </p>
            <p className="type-caption text-[var(--color-muted)]">{item.date}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function MediaTabs() {
  const [panel, setPanel] = useState<PanelId>("photos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(facets.map((f) => [f.id, f.initial]))
  );

  const filter = (items: MediaItem[]) => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (q && !item.caption.toLowerCase().includes(q)) return false;
      return matchesFacets({ year: yearOf(item.date) }, facets, selected);
    });
  };

  const visiblePhotos = useMemo(
    () => filter(photos),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, selected]
  );
  const visibleVideos = useMemo(
    () => filter(videos),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, selected]
  );

  const tabs: {
    id: PanelId;
    label: string;
    count: number;
    icon: React.ReactNode;
  }[] = [
    {
      id: "photos",
      label: "Photos",
      count: visiblePhotos.length,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-none stroke-current stroke-[1.5]">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
    {
      id: "videos",
      label: "Videos",
      count: visibleVideos.length,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-none stroke-current stroke-[1.5]">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
      ),
    },
  ];

  const active = panel === "photos" ? visiblePhotos : visibleVideos;

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        facets={facets}
        selected={selected}
        onFacetChange={(id, value) =>
          setSelected((prev) => ({ ...prev, [id]: value }))
        }
        searchPlaceholder={searchPlaceholder}
        searchAriaLabel={searchAriaLabel}
        label={filterBarLabel}
      />

      <section className="py-xxl md:py-section" aria-label="Media gallery">
        <Container>
          <div
            role="tablist"
            aria-label="Media type"
            className="mb-xxl flex flex-wrap gap-xs"
          >
            {tabs.map((tab) => {
              const isActive = panel === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setPanel(tab.id)}
                  className={clsx(
                    "type-button inline-flex h-10 items-center gap-xs rounded-pill border px-5 transition-colors",
                    isActive
                      ? "border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)] text-[var(--color-on-primary)]"
                      : "border-hairline-strong bg-transparent text-[var(--color-body-strong)] hover:bg-surface-strong"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  <span className={isActive ? "opacity-80" : "text-[var(--color-muted)]"}>
                    ({tab.count})
                  </span>
                </button>
              );
            })}
          </div>

          {active.length === 0 ? (
            <p className="rounded-xl border border-hairline bg-surface-card px-lg py-xxl text-center text-sm text-[var(--color-muted)]">
              {noResultsText}
            </p>
          ) : (
            <>
              <div
                id="panel-photos"
                role="tabpanel"
                aria-labelledby="tab-photos"
                hidden={panel !== "photos"}
              >
                <MediaGrid items={visiblePhotos} isVideo={false} />
              </div>

              <div
                id="panel-videos"
                role="tabpanel"
                aria-labelledby="tab-videos"
                hidden={panel !== "videos"}
              >
                <MediaGrid items={visibleVideos} isVideo />
              </div>
            </>
          )}

          <p className="mt-lg text-[13px] text-[var(--color-muted)]" aria-live="polite">
            {active.length === 0
              ? "No entries found"
              : `Showing 1 to ${active.length} of ${
                  panel === "photos" ? photos.length : videos.length
                } entries`}
          </p>
        </Container>
      </section>
    </>
  );
}
