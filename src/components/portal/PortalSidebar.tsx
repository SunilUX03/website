"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export type NavItem = { label: string; href: string };
export type NavGroup = { label: string; items: NavItem[] };

// Exported so PortalBreadcrumb.tsx can derive "Section / Page" trails
// from the same group/item labels shown here, instead of maintaining a
// second copy of this structure that could drift out of sync.
export const NAV: NavGroup[] = [
  { label: "", items: [{ label: "Dashboard", href: "/cms" }, { label: "Analytics", href: "/cms/analytics" }] },
  {
    label: "Home Page",
    items: [
      { label: "Hero", href: "/cms/settings/hero" },
      { label: "Leadership Band", href: "/cms/settings/leadership-band" },
      { label: "Metrics", href: "/cms/settings/metrics" },
      { label: "Pillar Cards", href: "/cms/settings/pillars" },
      { label: "Projects Spotlight", href: "/cms/projects-spotlight" },
    ],
  },
  {
    label: "About Page",
    items: [
      { label: "Page Content", href: "/cms/settings/about" },
      { label: "Organisation Structure", href: "/cms/settings/org-chart" },
      { label: "Leadership Team", href: "/cms/team-members" },
      { label: "Governing Board", href: "/cms/settings/board" },
      { label: "Awards", href: "/cms/awards" },
      { label: "Roll of Honour", href: "/cms/roll-of-honour" },
    ],
  },
  {
    label: "Careers",
    items: [
      // Job Openings moved to the standalone Career Portal
      // (/career-portal/openings) — HR no longer needs CMS access at
      // all. This entry stays only for the Careers PAGE's own copy
      // (hero text, application steps), which is unrelated to openings.
      { label: "Page Content", href: "/cms/settings/careers" },
    ],
  },
  {
    label: "Services & Projects",
    items: [
      { label: "Citizen Services", href: "/cms/citizen-services" },
      { label: "Initiatives & Projects", href: "/cms/services" },
      { label: "Services to Government Page", href: "/cms/settings/services-to-government" },
    ],
  },
  {
    label: "Social Media",
    items: [{ label: "Posts", href: "/cms/social-media" }],
  },
  {
    label: "Notifications",
    items: [
      { label: "Announcements", href: "/cms/announcements" },
      { label: "Media & Press", href: "/cms/media" },
      { label: "Government Orders", href: "/cms/government-orders" },
      { label: "Policies & Guidelines", href: "/cms/policies" },
      { label: "RTI", href: "/cms/settings/rti" },
      { label: "Tenders", href: "/cms/settings/tenders" },
    ],
  },
  {
    label: "Legal Pages",
    items: [{ label: "All legal pages", href: "/cms/legal-pages" }],
  },
  {
    label: "Feedback",
    items: [{ label: "Feedback Received", href: "/cms/feedback" }],
  },
  {
    label: "Site Settings",
    items: [
      { label: "Site Identity (Logos & Name)", href: "/cms/settings/site-identity" },
      { label: "Header Navigation", href: "/cms/settings/nav" },
      { label: "Footer", href: "/cms/settings/footer" },
      { label: "Site Map", href: "/cms/settings/site-map" },
      { label: "Other Page Copy", href: "/cms/settings/site-copy" },
    ],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={clsx("h-4 w-4 shrink-0 transition-transform duration-150", open ? "rotate-90" : "")}
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PortalSidebar() {
  const pathname = usePathname();

  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  // Whichever group contains the current page starts open; every other
  // group starts collapsed. Toggling is manual after that — opening one
  // group doesn't auto-close another, so an admin can compare two
  // sections' settings side by side in the sidebar while working.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV.filter((g) => g.label).map((g) => [g.label, isGroupActive(g)]))
  );

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <nav className="flex h-full w-[260px] shrink-0 flex-col gap-1 overflow-y-auto border-r border-hairline bg-surface-card px-4 py-6">
      {NAV.map((group) => {
        if (!group.label) {
          // The unlabeled root group (just Dashboard) always renders flat,
          // no toggle — there's nothing to collapse.
          return (
            <ul key="root" role="list" className="mb-3 flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "type-body-sm block rounded-lg px-3 py-2 transition-colors",
                        active
                          ? "bg-[var(--color-primary-blue)] text-[var(--color-on-primary)]"
                          : "text-ink hover:bg-surface-strong"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          );
        }

        const open = openGroups[group.label] ?? false;
        const active = isGroupActive(group);

        return (
          <div key={group.label}>
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              aria-expanded={open}
              className={clsx(
                "type-caption-uppercase flex w-full items-center gap-1.5 rounded-lg px-2 py-2 text-left transition-colors",
                active ? "text-[var(--color-primary-blue)]" : "text-[var(--color-muted)]",
                "hover:bg-surface-strong"
              )}
            >
              <ChevronIcon open={open} />
              {group.label}
            </button>
            {open ? (
              <ul role="list" className="mb-1 flex flex-col gap-0.5 py-0.5 pl-[22px]">
                {group.items.map((item) => {
                  const itemActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={clsx(
                          "type-body-sm block rounded-lg px-3 py-2 transition-colors",
                          itemActive
                            ? "bg-[var(--color-primary-blue)] text-[var(--color-on-primary)]"
                            : "text-ink hover:bg-surface-strong"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
