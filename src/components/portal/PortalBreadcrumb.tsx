"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./PortalSidebar";

/** Trailing path segments that describe *how* the matched page is being
 * viewed, not what it is — shown as a final crumb after the section
 * item. A bare numeric id (a doc's row id in an edit URL) isn't
 * meaningful on its own, so it's dropped rather than shown. */
const SEGMENT_LABELS: Record<string, string> = {
  new: "New",
  edit: "Edit",
};

/** Auto-derived "Dashboard / Section / Page [/ Edit]" trail for every
 * CMS portal page, built from the same NAV structure PortalSidebar
 * renders — one shared source of section/page labels, so adding a page
 * to the sidebar gets it a correct breadcrumb for free instead of
 * needing every page.tsx to declare its own trail by hand. Rendered
 * once in the portal layout, above `{children}`. */
export function PortalBreadcrumb() {
  const pathname = usePathname();

  if (pathname === "/cms") return null;

  // Longest matching item href wins — "/cms" (the Dashboard root) is
  // technically a prefix of every portal path, but a page's own item
  // (e.g. "/cms/citizen-services") is always the more specific match.
  let bestGroup: (typeof NAV)[number] | null = null;
  let bestItem: (typeof NAV)[number]["items"][number] | null = null;
  for (const group of NAV) {
    for (const item of group.items) {
      if (item.href === "/cms") continue;
      const matches = pathname === item.href || pathname.startsWith(`${item.href}/`);
      if (matches && (!bestItem || item.href.length > bestItem.href.length)) {
        bestGroup = group;
        bestItem = item;
      }
    }
  }

  if (!bestItem) return null;

  const trailingSegments = pathname
    .slice(bestItem.href.length)
    .split("/")
    .filter(Boolean)
    .filter((segment) => !/^\d+$/.test(segment))
    .map((segment) => SEGMENT_LABELS[segment] ?? segment);

  return (
    <nav className="type-body-sm mb-4 flex flex-wrap items-center gap-1.5 text-[var(--color-muted)]" aria-label="Breadcrumb">
      <Link href="/cms" className="hover:text-ink">
        Dashboard
      </Link>
      {bestGroup?.label ? (
        <>
          <span aria-hidden>/</span>
          <span>{bestGroup.label}</span>
        </>
      ) : null}
      <span aria-hidden>/</span>
      {trailingSegments.length > 0 ? (
        <Link href={bestItem.href} className="hover:text-ink">
          {bestItem.label}
        </Link>
      ) : (
        <span className="text-ink" aria-current="page">
          {bestItem.label}
        </span>
      )}
      {trailingSegments.map((segment, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span aria-hidden>/</span>
          <span className={i === trailingSegments.length - 1 ? "text-ink" : undefined} aria-current={i === trailingSegments.length - 1 ? "page" : undefined}>
            {segment}
          </span>
        </span>
      ))}
    </nav>
  );
}
