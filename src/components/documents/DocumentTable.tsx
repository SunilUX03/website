"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Cell } from "./Cells";
import { FilterBar, matchesFacets } from "./FilterBar";
import type { DocumentCell, DocumentFacet, DocumentRow } from "./types";

/** The text a cell sorts by — the same text every cell kind already
 * displays, so sorting never contradicts what's on screen. */
function sortValue(cell: DocumentCell | undefined): string {
  if (!cell) return "";
  return cell.kind === "download" ? cell.label : cell.text;
}

/** Numeric compare when both sides parse as numbers (years, GO numbers
 * embedded at the start of a reference, etc.) so "2" sorts before "10"
 * instead of after it; falls back to locale string compare otherwise. */
function compareValues(a: string, b: string): number {
  const na = Number(a);
  const nb = Number(b);
  if (a !== "" && b !== "" && !Number.isNaN(na) && !Number.isNaN(nb)) {
    return na - nb;
  }
  return a.localeCompare(b);
}

const PAGE_SIZE = 25;

function SortIcon({ direction }: { direction: "asc" | "desc" | null }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-3 w-3 shrink-0 fill-none stroke-current stroke-[1.5]">
      <polyline
        points="4 6 8 2 12 6"
        opacity={direction === "desc" ? 0.3 : 1}
      />
      <polyline
        points="4 10 8 14 12 10"
        opacity={direction === "asc" ? 0.3 : 1}
      />
    </svg>
  );
}

/**
 * One component behind Government Orders, Tenders, Publications and
 * Policies & Guidelines — the four prototypes that shared an identical
 * "search + filters + table + count" block and duplicated the same
 * ~60 lines of filter JavaScript each.
 *
 * Responsive strategy: the prototypes put the table in a horizontally
 * scrolling wrapper on small screens, which meant phone users had to
 * swipe sideways to read a single row. Instead, the <table> renders from
 * `md:` up, and below that each row becomes a self-contained card with
 * the columns as label/value pairs — no sideways scrolling at all. Both
 * views read from the same filtered, sorted, paginated `pageRows` array,
 * so they can't disagree.
 *
 * Filtering, sorting and pagination (25 rows/page) all run on the client
 * over data passed in from the server.
 */

export function DocumentTable({
  rows,
  headers,
  facets,
  searchPlaceholder,
  searchAriaLabel,
  filterBarLabel,
  tableLabel,
  noResultsText,
}: {
  rows: DocumentRow[];
  headers: string[];
  facets: DocumentFacet[];
  searchPlaceholder: string;
  searchAriaLabel: string;
  filterBarLabel: string;
  tableLabel: string;
  noResultsText: string;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(facets.map((f) => [f.id, f.initial]))
  );
  // Column index being sorted, and which direction — null means "as given"
  // (the original row order), same as before sorting existed.
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rows.filter((row) => {
      if (q && !row.searchText.toLowerCase().includes(q)) return false;
      return matchesFacets(row.facets, facets, selected);
    });

    if (sortColumn === null) return filtered;

    const sorted = [...filtered].sort((a, b) =>
      compareValues(sortValue(a.cells[sortColumn]), sortValue(b.cells[sortColumn]))
    );
    if (sortDirection === "desc") sorted.reverse();
    return sorted;
  }, [rows, facets, query, selected, sortColumn, sortDirection]);

  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = useMemo(
    () => visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [visible, currentPage]
  );

  // Every one of these resets to page 1 itself, right where the result set
  // changes — a search, filter or re-sort landing a user on a now-empty or
  // confusingly-reordered later page would be far more confusing than
  // always starting back at the top of the new results.
  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const setFacet = (id: string, value: string) => {
    setSelected((prev) => ({ ...prev, [id]: value }));
    setPage(1);
  };

  const toggleSort = (columnIndex: number) => {
    if (sortColumn !== columnIndex) {
      setSortColumn(columnIndex);
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      // Third click clears sorting rather than only ever toggling asc/desc
      // — lets a user get back to the original, unsorted order.
      setSortColumn(null);
    }
    setPage(1);
  };

  const countText =
    visible.length === 0
      ? "No entries found"
      : `Showing ${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(
          currentPage * PAGE_SIZE,
          visible.length
        )} of ${visible.length} entries`;

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={changeQuery}
        facets={facets}
        selected={selected}
        onFacetChange={setFacet}
        searchPlaceholder={searchPlaceholder}
        searchAriaLabel={searchAriaLabel}
        label={filterBarLabel}
      />

      <section className="pb-section pt-xxl" aria-label={tableLabel}>
        <Container>
          {/* ── Mobile: one card per row, no horizontal scrolling ──
              The table's column headers (where sorting normally lives)
              aren't shown at all on mobile, so it needs its own compact
              sort control instead of just inheriting the desktop one. */}
          <div className="mb-base flex items-center gap-2 md:hidden">
            <label htmlFor="mobile-sort" className="type-caption shrink-0 text-[var(--color-muted)]">
              Sort by
            </label>
            <select
              id="mobile-sort"
              value={sortColumn ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setSortColumn(null);
                } else {
                  setSortColumn(Number(value));
                  setSortDirection("asc");
                }
                setPage(1);
              }}
              className="h-9 flex-1 rounded-md border border-hairline-strong bg-surface-card px-2.5 text-sm text-ink"
            >
              <option value="">Original order</option>
              {headers.map((h, i) =>
                h.toLowerCase() === "download" ? null : (
                  <option key={h} value={i}>
                    {h}
                  </option>
                )
              )}
            </select>
            {sortColumn !== null ? (
              <button
                type="button"
                onClick={() => {
                  setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
                  setPage(1);
                }}
                aria-label={`Toggle sort direction, currently ${sortDirection === "asc" ? "ascending" : "descending"}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-hairline-strong bg-surface-card text-[var(--color-body-strong)]"
              >
                <SortIcon direction={sortDirection} />
              </button>
            ) : null}
          </div>

          <ul role="list" className="flex flex-col gap-base md:hidden">
            {pageRows.map((row) => {
              const title = row.cells.find((c) => c.kind === "title");
              const badges = row.cells.filter((c) => c.kind === "badge");
              const download = row.cells.find((c) => c.kind === "download");
              const meta = row.cells
                .map((cell, i) => ({ cell, label: headers[i] }))
                .filter(
                  ({ cell }) => cell.kind === "ref" || cell.kind === "date"
                );

              return (
                <li
                  key={row.id}
                  className="flex flex-col gap-sm rounded-xl border border-hairline bg-surface-card p-base"
                >
                  {badges.length > 0 ? (
                    <div className="flex flex-wrap gap-xs">
                      {badges.map((cell, i) => (
                        <Cell key={i} cell={cell} />
                      ))}
                    </div>
                  ) : null}

                  {title ? (
                    <h3 className="type-body-strong text-[var(--color-body-strong)]">
                      {title.kind === "title" ? title.text : null}
                    </h3>
                  ) : null}

                  {meta.length > 0 ? (
                    <dl className="flex flex-col gap-xxs border-t border-hairline-soft pt-sm">
                      {meta.map(({ cell, label }, i) => (
                        <div
                          key={i}
                          className="flex items-baseline justify-between gap-base"
                        >
                          <dt className="type-caption-uppercase shrink-0 text-[var(--color-muted)]">
                            {label}
                          </dt>
                          <dd className="text-right">
                            <Cell cell={cell} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {download ? (
                    <div className="border-t border-hairline-soft pt-sm">
                      <Cell cell={download} />
                    </div>
                  ) : null}
                </li>
              );
            })}

            {visible.length === 0 ? (
              <li className="rounded-xl border border-hairline bg-surface-card px-lg py-xxl text-center text-sm text-[var(--color-muted)]">
                {noResultsText}
              </li>
            ) : null}
          </ul>

          <div className="mt-base flex items-center justify-between gap-sm md:hidden">
            <p className="text-[13px] text-[var(--color-muted)]" aria-live="polite">
              {countText}
            </p>
            {pageCount > 1 ? (
              <div className="flex shrink-0 items-center gap-xs">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-hairline-strong text-[13px] font-medium text-[var(--color-body-strong)] disabled:opacity-35"
                >
                  <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.5]">
                    <polyline points="10 4 6 8 10 12" />
                  </svg>
                </button>
                <span className="text-[13px] text-[var(--color-muted)]">
                  {currentPage} / {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={currentPage >= pageCount}
                  aria-label="Next page"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-hairline-strong text-[13px] font-medium text-[var(--color-body-strong)] disabled:opacity-35"
                >
                  <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.5]">
                    <polyline points="6 4 10 8 6 12" />
                  </svg>
                </button>
              </div>
            ) : null}
          </div>

          {/* ── Tablet and up: the full table ── */}
          <div className="hidden overflow-hidden rounded-md border border-hairline bg-surface-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm" aria-label={tableLabel}>
                <thead className="border-b border-hairline bg-canvas">
                  <tr>
                    {headers.map((h, i) => {
                      const active = sortColumn === i;
                      return (
                        <th
                          key={h}
                          scope="col"
                          aria-sort={active ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                          className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.72px] text-[var(--color-muted)]"
                        >
                          <button
                            type="button"
                            onClick={() => toggleSort(i)}
                            className={clsx(
                              "inline-flex items-center gap-1 transition-colors hover:text-[var(--color-body-strong)]",
                              active && "text-[var(--color-body-strong)]"
                            )}
                            aria-label={`Sort by ${h}${active ? (sortDirection === "asc" ? ", ascending" : ", descending") : ""}`}
                          >
                            {h}
                            <SortIcon direction={active ? sortDirection : null} />
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-canvas">
                      {row.cells.map((cell, i) => (
                        <td
                          key={i}
                          className={clsx(
                            "border-t border-hairline-soft px-4 py-4 align-middle text-sm leading-normal text-[var(--color-body-strong)]",
                            cell.kind === "title" && "max-w-[320px]"
                          )}
                        >
                          <Cell cell={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}

                  {visible.length === 0 ? (
                    <tr>
                      <td
                        colSpan={headers.length}
                        className="px-lg py-xxl text-center text-sm text-[var(--color-muted)]"
                      >
                        {noResultsText}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-sm border-t border-hairline px-4 py-3.5">
              <p className="text-[13px] text-[var(--color-muted)]" aria-live="polite">
                {countText}
              </p>

              <nav className="flex items-center gap-xxs" aria-label="Table pagination">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-transparent text-[13px] font-medium text-[var(--color-body-strong)] disabled:opacity-35"
                >
                  <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.5]">
                    <polyline points="10 4 6 8 10 12" />
                  </svg>
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-label={`Page ${n}`}
                    aria-current={n === currentPage ? "page" : undefined}
                    className={clsx(
                      "inline-flex h-8 w-8 items-center justify-center rounded-sm border text-[13px] font-medium",
                      n === currentPage
                        ? "border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)] text-[var(--color-on-primary)]"
                        : "border-transparent text-[var(--color-body-strong)] hover:bg-canvas"
                    )}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={currentPage >= pageCount}
                  aria-label="Next page"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-transparent text-[13px] font-medium text-[var(--color-body-strong)] disabled:opacity-35"
                >
                  <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.5]">
                    <polyline points="6 4 10 8 6 12" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
