"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { FilterBar, matchesFacets } from "@/components/documents/FilterBar";
import {
  announcements,
  facets,
  filterBarLabel,
  listHeading,
  noResultsText,
  searchAriaLabel,
  searchPlaceholder,
  yearOf,
} from "@/lib/announcements-content";

/**
 * Full announcements listing, with the same search + year filter used on
 * the document pages (via the shared FilterBar).
 *
 * Search matches heading and description, not just the heading — an
 * announcement is short enough that its summary is worth searching, and
 * users look for terms like "WhatsApp" that only appear in the body.
 *
 * Items come from the same `announcements` array the homepage renders,
 * so the two never drift apart.
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

export function AnnouncementList() {
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
  }, [query, selected]);

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

      <section className="py-xxl md:py-section" aria-label="All announcements">
        <Container>
          <SectionHead heading={listHeading} id="announcements-heading" />

          {visible.length === 0 ? (
            <p className="rounded-xl border border-hairline bg-surface-card px-lg py-xxl text-center text-sm text-[var(--color-muted)]">
              {noResultsText}
            </p>
          ) : (
            <ul role="list" className="grid gap-lg md:grid-cols-2">
              {visible.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-surface-card transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                  >
                    {/* Plain <img>, not a fixed-aspect crop — matches the
                        Home page teaser, which uses each photo's own
                        natural proportions rather than force-cropping
                        every announcement to the same shape. Not every
                        announcement has one — a text-only update renders
                        without this block rather than an empty image. */}
                    {item.image && <img src={item.image} alt="" loading="lazy" className="block w-full" />}

                    <span className="flex h-full flex-col gap-sm p-lg">
                      <span className="type-caption-uppercase text-[var(--color-muted)]">
                        {item.timestamp}
                      </span>

                      <h3 className="type-title-sm text-[var(--color-body-strong)]">
                        {item.heading}
                      </h3>

                      <p className="type-body-sm text-[var(--color-body)]">
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
