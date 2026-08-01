"use client";

import clsx from "clsx";
import { Container } from "@/components/ui/Container";

/**
 * The search + filter row used across the Notifications section.
 *
 * Originally this lived inside DocumentTable and served only the four
 * document pages. It's extracted here so Announcements and Media & Press
 * get the identical control — same input, same select styling, same pill
 * group — rather than each page growing its own variant.
 *
 * Facets are plain serializable config, so pages stay Server Components
 * and only the components that own filter state are client-side.
 */

export type Facet = {
  /** Must match a key in the item's facet map. */
  id: string;
  kind: "select" | "pills";
  ariaLabel: string;
  initial: string;
  options: { value: string; label: string }[];
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 fill-none stroke-[var(--color-muted)] stroke-[1.5]"
    >
      <circle cx="8.5" cy="8.5" r="5.5" />
      <line x1="13" y1="13" x2="18" y2="18" />
    </svg>
  );
}

const SELECT_CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23777169' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";

export function FilterBar({
  query,
  onQueryChange,
  facets,
  selected,
  onFacetChange,
  searchPlaceholder,
  searchAriaLabel,
  label,
  bordered = true,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  facets: Facet[];
  selected: Record<string, string>;
  onFacetChange: (id: string, value: string) => void;
  searchPlaceholder: string;
  searchAriaLabel: string;
  label: string;
  /** Document pages sit the bar flush under the hero with a rule; inline uses omit it. */
  bordered?: boolean;
}) {
  return (
    <div
      className={clsx("py-xl", bordered && "border-b border-hairline")}
      aria-label={label}
    >
      <Container>
        <div className="flex flex-wrap items-center gap-sm max-md:flex-col max-md:items-stretch">
          <div className="relative min-w-[220px] flex-1">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchAriaLabel}
              className="h-11 w-full rounded-md border border-hairline-strong bg-surface-card pl-[42px] pr-base text-[15px] text-ink outline-none transition-colors placeholder:text-[var(--color-muted-soft)] focus:border-ink focus:shadow-[0_0_0_2px_rgba(12,10,9,0.06)]"
            />
          </div>

          {facets.map((facet) =>
            facet.kind === "select" ? (
              <select
                key={facet.id}
                value={selected[facet.id]}
                onChange={(e) => onFacetChange(facet.id, e.target.value)}
                aria-label={facet.ariaLabel}
                className="h-11 cursor-pointer appearance-none rounded-md border border-hairline-strong bg-surface-card bg-[right_12px_center] bg-no-repeat pl-3.5 pr-9 text-sm font-medium text-[var(--color-body-strong)] outline-none transition-colors focus:border-ink max-md:w-full"
                style={{ backgroundImage: SELECT_CHEVRON }}
              >
                {facet.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <div
                key={facet.id}
                role="group"
                aria-label={facet.ariaLabel}
                className="flex flex-wrap items-center gap-1.5"
              >
                {facet.options.map((o) => {
                  const active = selected[facet.id] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onFacetChange(facet.id, o.value)}
                      className={clsx(
                        "type-body-sm inline-flex h-9 items-center rounded-pill border px-3.5 font-medium transition-colors",
                        active
                          ? "border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-blue-active)]"
                          : "border-hairline-strong bg-transparent text-[var(--color-body-strong)] hover:bg-surface-strong"
                      )}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            )
          )}
        </div>
      </Container>
    </div>
  );
}

/** Shared filter predicate: "all" matches everything, otherwise exact match. */
export function matchesFacets(
  facetValues: Record<string, string>,
  facets: Facet[],
  selected: Record<string, string>
) {
  return facets.every((facet) => {
    const value = selected[facet.id];
    return value === "all" || facetValues[facet.id] === value;
  });
}
