"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { nav } from "@/lib/content";
import { NavDropdown, DropdownLink } from "./NavDropdown";
import { AccessibilityIcon, HomeIcon, MenuIcon } from "./icons";
import { MobileDrawer } from "./MobileDrawer";
import { useAccessibilityPrefs } from "@/lib/accessibility";

export function MainNav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { openPanel, panelOpen } = useAccessibilityPrefs();

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
            scrolled ? "h-20" : "h-24"
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
                scrolled ? "h-14" : "h-[4.5rem]"
              )}
            />
            <span
              aria-hidden
              className={clsx(
                "w-px shrink-0 bg-hairline-strong transition-[height] duration-200",
                scrolled ? "h-11" : "h-14"
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
                scrolled ? "h-14" : "h-[4.5rem]"
              )}
            />
            <span className="leading-tight">
              <span className="type-title-md block font-semibold text-[var(--color-primary-blue)] md:text-lg">
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
                "flex items-center p-2 text-ink transition-colors hover:text-[var(--color-primary-blue)]",
                pathname === "/" && "text-[var(--color-primary-blue)]"
              )}
            >
              <HomeIcon className="h-5 w-5" />
            </a>

            <NavDropdown
              label="About"
              href="/about"
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
              href="/services"
              panel={
                <div className="flex flex-col">
                  {nav.services.map((item) => (
                    <DropdownLink key={item.href} {...item} />
                  ))}
                </div>
              }
            />

            <NavDropdown
              label="Notifications"
              panelClassName="grid w-[420px] max-w-[90vw] grid-cols-2 gap-4 p-5"
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

            <a
              href="/reach-us"
              className="type-button btn-primary shadow-[0_4px_14px_rgba(29,63,143,0.35)]"
            >
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

      {/* Floating quick-access menu button — appears once the page is
          scrolled, on every breakpoint (not just mobile), so the full
          drawer menu is reachable without scrolling back up to the header. */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open menu"
        className={clsx(
          "fixed right-5 top-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface-card text-ink shadow-[0_4px_14px_rgba(12,10,9,0.16)] transition-all duration-200 hover:bg-[var(--color-surface-strong)] md:right-8 md:top-6",
          scrolled ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      {/* Floating accessibility button — the top bar's "Accessibility"
          control scrolls away with it; once scrolled, this is what's
          actually reachable without scrolling back up. Sits just left of
          the floating menu button, same appear-on-scroll behaviour. */}
      <button
        type="button"
        onClick={(e) => openPanel(e.currentTarget)}
        aria-label="Accessibility options"
        aria-pressed={panelOpen}
        className={clsx(
          "fixed right-[68px] top-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border text-ink shadow-[0_4px_14px_rgba(12,10,9,0.16)] transition-all duration-200 hover:bg-[var(--color-surface-strong)] md:right-[84px] md:top-6",
          panelOpen ? "border-[var(--color-primary-blue)] bg-[var(--color-surface-strong)]" : "border-hairline bg-surface-card",
          scrolled ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <AccessibilityIcon className="h-5 w-5" />
      </button>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
