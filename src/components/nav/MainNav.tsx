"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { nav } from "@/lib/content";
import { NavDropdown, DropdownLink } from "./NavDropdown";
import { HomeIcon, MenuIcon } from "./icons";
import { MobileDrawer } from "./MobileDrawer";

export function MainNav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={clsx(
          "sticky top-0 z-50 w-full border-b bg-canvas transition-shadow duration-200",
          scrolled
            ? "border-hairline shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            : "border-transparent"
        )}
      >
        <div
          className={clsx(
            "mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 transition-[height] duration-200 md:px-10",
            scrolled ? "h-16" : "h-20"
          )}
        >
          <a
            href="/"
            className="flex items-center gap-3"
            aria-label="TNeGA — Tamil Nadu e-Governance Agency home"
          >
            <Image
              src="/images/tn-emblem.png"
              alt="Government of Tamil Nadu emblem"
              width={178}
              height={186}
              priority
              className={clsx(
                "w-auto transition-[height] duration-200",
                scrolled ? "h-11" : "h-14"
              )}
            />
            <span
              aria-hidden
              className={clsx(
                "w-px shrink-0 bg-hairline-strong transition-[height] duration-200",
                scrolled ? "h-9" : "h-11"
              )}
            />
            <Image
              src="/images/logos/tnega-mark.png"
              alt=""
              aria-hidden
              width={512}
              height={512}
              priority
              className={clsx(
                "w-auto shrink-0 transition-[height] duration-200",
                scrolled ? "h-11" : "h-14"
              )}
            />
            <span className="leading-tight">
              <span className="type-title-md block font-semibold text-[var(--color-primary-blue)]">
                TNeGA
              </span>
              <span className="type-caption hidden text-[var(--color-muted)] sm:block">
                Tamil Nadu e-Governance Agency
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="/"
              aria-label="Home"
              aria-current={pathname === "/" ? "page" : undefined}
              className={clsx(
                "flex items-center rounded-full p-2 text-ink transition-colors hover:text-[var(--color-primary-blue)]",
                pathname === "/" && "border-b-2 border-[var(--color-primary-blue)]"
              )}
            >
              <HomeIcon className="h-5 w-5" />
            </a>

            <NavDropdown
              label="About"
              panel={
                <div className="flex flex-col">
                  {nav.about.map((item) => (
                    <DropdownLink key={item.href} {...item} />
                  ))}
                </div>
              }
            />

            <NavDropdown
              label="Services"
              panelClassName="grid w-[640px] grid-cols-4 gap-4 p-5"
              panel={
                <>
                  {nav.services.map((group) => (
                    <div key={group.category}>
                      <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">
                        {group.category}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {group.items.map((item) => (
                          <DropdownLink key={item.href} {...item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              }
            />

            <NavDropdown
              label="Notifications"
              panelClassName="grid w-[420px] grid-cols-2 gap-4 p-5"
              panel={
                <>
                  <div>
                    <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">
                      Updates
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {nav.notifications.updates.map((item) => (
                        <DropdownLink key={item.href} {...item} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">
                      Documents
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {nav.notifications.documents.map((item) => (
                        <DropdownLink key={item.href} {...item} />
                      ))}
                    </div>
                  </div>
                </>
              }
            />

            <a href="/reach-us" className="type-button btn-primary">
              Reach us
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
