"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV = [
  { label: "Dashboard", href: "/career-portal/dashboard" },
  { label: "Current Openings", href: "/career-portal/openings" },
  { label: "Applications", href: "/career-portal/applications" },
  { label: "Resume Submitted", href: "/career-portal/resumes" },
  { label: "Roles", href: "/career-portal/roles" },
];

export function CareerPortalSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-[240px] shrink-0 flex-col gap-1 border-r border-hairline bg-surface-card px-4 py-6">
      <p className="type-title-sm mb-4 px-2 text-ink">Career Portal</p>
      <ul role="list" className="flex flex-col gap-0.5">
        {NAV.map((item) => {
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
    </nav>
  );
}
