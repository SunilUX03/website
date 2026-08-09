"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavItem = { label: string; href: string };
type NavGroup = { label: string; items: NavItem[] };

const NAV: NavGroup[] = [
  { label: "", items: [{ label: "Dashboard", href: "/cms" }] },
  {
    label: "Services & Projects",
    items: [{ label: "All services", href: "/cms/services" }],
  },
  {
    label: "Notifications",
    items: [
      { label: "Announcements", href: "/cms/announcements" },
      { label: "Media & Press", href: "/cms/media" },
      { label: "Government Orders", href: "/cms/government-orders" },
      { label: "Policies & Guidelines", href: "/cms/policies" },
    ],
  },
];

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-[260px] shrink-0 flex-col gap-6 overflow-y-auto border-r border-hairline bg-surface-card px-4 py-6">
      {NAV.map((group) => (
        <div key={group.label || "root"}>
          {group.label ? (
            <p className="type-caption-uppercase mb-2 px-2 text-[var(--color-muted)]">{group.label}</p>
          ) : null}
          <ul role="list" className="flex flex-col gap-0.5">
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
        </div>
      ))}
    </nav>
  );
}
