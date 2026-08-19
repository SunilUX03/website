"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { FilterBar, matchesFacets } from "@/components/documents/FilterBar";
import type { Facet } from "@/components/documents/FilterBar";
import {
  filterBarLabel,
  listHeading,
  noResultsText,
  searchAriaLabel,
  searchPlaceholder,
} from "@/lib/announcements-content";
import { type CmsAnnouncement, yearOf } from "@/lib/cms/announcement-types";

/**
 * Full announcements listing, with the same search + year filter used on
 * the document pages (via the shared FilterBar).
 *
 * Search matches heading and description, not just the heading — an
 * announcement is short enough that its summary is worth searching, and
 * users look for terms like "WhatsApp" that only appear in the body.
 *
 * Items and facets are fetched server-side (see the page component) and
 * passed in, since they now come from the CMS rather than a static
 * import this component could read directly.
 */

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4 shrink-0 fill-none stroke-current stroke-[1.5] transition-transform group-hover:translate-x-0.5"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

export function AnnouncementList({
  announcements,
  facets,
}: {
  announcements: CmsAnnouncement[];
  facets: Facet[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(facets.map((f) => [f.id, f.initial]))
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return announcements.filter((item) => {
      if (
        q &&
        !`${item.heading} ${item.description}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      return matchesFacets({ year: yearOf(item.timestamp) }, facets, selected);
    });
  }, [announcements, facets, query, selected]);

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

      <section id="all-announcements" className="scroll-mt-24 py-xxl md:py-section" aria-label="All announcements">
        <Container>
          <SectionHead heading={listHeading} id="announcements-heading" />

          {visible.length === 0 ? (
            <p className="rounded-xl border border-hairline bg-surface-card px-lg py-xxl text-center text-sm text-[var(--color-muted)]">
              {noResultsText}
            </p>
          ) : (
            <ul role="list" className="grid gap-lg sm:grid-cols-2 lg:grid-cols-4">
              {visible.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-surface-card transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                  >
                    {/* Fixed 3:2 crop (not each photo's natural size) so
                        every card is the same compact height — 4 fit in one
                        row/glance on desktop instead of a couple of
                        variable-height, full-size photos filling the
                        screen. Not every announcement has an image — a
                        text-only update renders without this block rather
                        than an empty crop. */}
                    {item.image && (
                      <PhotoTile
                        src={item.image}
                        alt=""
                        aspect="aspect-[3/2]"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      />
                    )}

                    <span className="flex h-full flex-col gap-sm p-base">
                      <span className="type-caption-uppercase text-[var(--color-muted)]">
                        {item.timestamp}
                      </span>

                      <h3 className="type-title-sm text-[var(--color-body-strong)]">
                        {item.heading}
                      </h3>

                      <p className="type-body-sm line-clamp-3 text-[var(--color-body)]">
                        {item.description}
                      </p>

                      <span className="type-body-strong mt-auto inline-flex items-center gap-xs pt-xs text-[var(--color-primary-blue)] transition-colors group-hover:text-[var(--color-primary-blue-active)]">
                        Read more
                        <ArrowIcon />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p
            className="mt-lg text-[13px] text-[var(--color-muted)]"
            aria-live="polite"
          >
            {visible.length === 0
              ? "No entries found"
              : `Showing 1 to ${visible.length} of ${announcements.length} entries`}
          </p>
        </Container>
      </section>
    </>
  );
}
