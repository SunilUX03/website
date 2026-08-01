/**
 * Shared shapes for the filterable document tables on Government Orders,
 * Tenders, Publications and Policies & Guidelines.
 *
 * Everything here is plain serializable data — no render callbacks — so
 * the pages themselves stay Server Components and only the interactive
 * <DocumentTable> is marked "use client".
 */

/** Badge palettes lifted from the prototypes' .dept-badge / .cat-badge / .badge rules. */
export type BadgeTone =
  | "sky"
  | "amber"
  | "pink"
  | "green"
  | "violet"
  | "lime"
  | "yellow"
  | "deepSky"
  | "neutral"
  | "ink";

export type DocumentCell =
  /** Primary column — heavier weight, wraps. */
  | { kind: "title"; text: string }
  /** Reference / GO number — small, muted, no wrap. */
  | { kind: "ref"; text: string }
  /** Any date column. */
  | { kind: "date"; text: string }
  /** Department / category / status pill. */
  | { kind: "badge"; text: string; tone: BadgeTone }
  /** Download action. */
  | { kind: "download"; href: string; label: string; ariaLabel: string };

export type DocumentRow = {
  id: string;
  /** Text the search box matches against (the title, per the prototypes). */
  searchText: string;
  /** Facet values keyed by facet id, e.g. { year: "2024", dept: "itds" }. */
  facets: Record<string, string>;
  cells: DocumentCell[];
};

export type DocumentFacet = {
  /** Must match a key in DocumentRow.facets. */
  id: string;
  kind: "select" | "pills";
  ariaLabel: string;
  /** Value selected on first render; "all" shows everything. */
  initial: string;
  options: { value: string; label: string }[];
};
