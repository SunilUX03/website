"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import type { CmsNavContent } from "@/lib/cms/nav-content";
import { NavDropdown, DropdownLink } from "./NavDropdown";
import { AccessibilityIcon, HomeIcon, MenuIcon } from "./icons";
import { MobileDrawer } from "./MobileDrawer";
import { useAccessibilityPrefs } from "@/lib/accessibility";
import { useHeaderHeightVar } from "@/lib/hooks";
// Static imports (not "/images/..." string paths) — Next fingerprints the
// built filename by content hash, so replacing either file on disk always
// produces a new URL instead of silently reusing a stale cached copy at
// the old one.
import tnEmblem from "../../../public/images/tn-emblem.png";
import tnegaMark from "../../../public/images/logos/tnega-mark.png";

export function MainNav({ nav }: { nav: CmsNavContent }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { openPanel, panelOpen } = useAccessibilityPrefs();
  useHeaderHeightVar();

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
            className="flex min-w-0 items-center gap-3"
            aria-label="TNeGA, Tamil Nadu e-Governance Agency home"
          >
            {/* Both logos + the divider are hidden below sm — on a phone
                width they alone ate ~170px of the row, leaving the
                wordmark only ~120px to work with (not enough for either
                line even at a tiny font size). Dropping them on mobile
                gives the wordmark the room it actually needs; both lines
                render there instead. */}
            <Image
              src={tnEmblem}
              alt="Government of Tamil Nadu emblem"
              priority
              className={clsx(
                "hidden w-auto transition-[height] duration-200 sm:block",
                scrolled ? "h-14" : "h-[4.5rem]"
              )}
            />
            <span
              aria-hidden
              className={clsx(
                "hidden w-px shrink-0 bg-hairline-strong transition-[height] duration-200 sm:block",
                scrolled ? "h-11" : "h-14"
              )}
            />
            <Image
              src={tnegaMark}
              alt=""
              aria-hidden
              priority
              className={clsx(
                // Matches the TN emblem's own box height. The mark's own
                // circle band is ~82.5% of its canvas height vs the
                // emblem's ~97.4% (baked-in "TNeGA" text below the circle
                // eats the rest), so the circle itself still reads
                // slightly smaller than the emblem at equal box heights —
                // accepted per explicit direction rather than compensated
                // with a CSS scale multiplier (that was tried once before
                // and overshot).
                "hidden w-auto shrink-0 transition-[height] duration-200 sm:block",
                scrolled ? "h-14" : "h-[4.5rem]"
              )}
            />
            {/* min-w-0 lets this column actually shrink within the flex
                row instead of forcing the row wider than the header —
                without it the Tamil wordmark (several words, no short
                abbreviated form the way "TNeGA" was) wrapped across 3-4
                lines on mobile and blew out the header's fixed height.
                gap-1 + leading-[1.6] on the Tamil line (not the tighter
                leading-tight this used to share with the English line
                below it) — Tamil's taller vowel signs were getting
                clipped at the top by too short a line box. Both lines
                always render (no breakpoint hides the English one) —
                text-[12px] on mobile, stepping up at sm/md once the
                logos return and share the row again. */}
            <span className="flex min-w-0 flex-col gap-1">
              <span
                lang="ta"
                className="block truncate text-[12px] font-semibold leading-[1.6] text-[var(--color-primary-blue)] sm:text-[15px] md:text-[16px]"
              >
                தமிழ்நாடு மின்-ஆளுமை முகமை
              </span>
              <span className="block truncate text-[12px] font-semibold leading-[1.4] text-[var(--color-primary-blue)] sm:text-[15px] md:text-[16px]">
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
              label="Others"
              iconTrigger={<MenuIcon className="h-5 w-5" />}
              panelClassName="grid w-[420px] max-w-[90vw] grid-cols-2 gap-4 p-5"
              panel={
                <>
                  <div>
                    <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">
                      Updates
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {nav.notificationsUpdates.map((item) => (
                        <DropdownLink key={item.href} {...item} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">
                      Documents
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {nav.notificationsDocuments.map((item) => (
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
              Contact us
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

      {/* Floating quick-access controls — appear once the page is
          scrolled, on every breakpoint (not just mobile), so both the
          accessibility panel and the full drawer menu stay reachable
          without scrolling back up to the header. A single flex row
          (rather than two independently right-offset buttons) so the
          accessibility control can grow into a labeled pill without the
          menu button's position needing to be hand-tuned to match. */}
      <div
        className={clsx(
          "fixed right-5 top-5 z-40 flex items-center gap-3 transition-all duration-200 md:right-8 md:top-6",
          scrolled ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <button
          type="button"
          onClick={(e) => openPanel(e.currentTarget)}
          aria-label="Accessibility options"
          aria-pressed={panelOpen}
          className={clsx(
            "flex h-11 items-center gap-2 rounded-full border px-4 text-ink shadow-[0_4px_14px_rgba(12,10,9,0.16)] transition-colors hover:bg-[var(--color-surface-strong)]",
            panelOpen ? "border-[var(--color-primary-blue)] bg-[var(--color-surface-strong)]" : "border-hairline bg-surface-card"
          )}
        >
          <AccessibilityIcon className="h-5 w-5 shrink-0" />
          <span className="type-body-sm font-medium">Accessibility</span>
        </button>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-card text-ink shadow-[0_4px_14px_rgba(12,10,9,0.16)] transition-colors hover:bg-[var(--color-surface-strong)]"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      <MobileDrawer nav={nav} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
