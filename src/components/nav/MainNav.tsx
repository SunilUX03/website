"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import type { CmsNavContent } from "@/lib/cms/nav-content";
import type { CmsSiteIdentity } from "@/lib/cms/site-identity";
import { NavDropdown, DropdownLink } from "./NavDropdown";
import { AccessibilityIcon, HomeIcon, MenuIcon } from "./icons";
import { MobileDrawer } from "./MobileDrawer";
import { useAccessibilityPrefs } from "@/lib/accessibility";
import { useHeaderHeightVar } from "@/lib/hooks";
import type { Locale } from "@/lib/locale";

export function MainNav({
  nav,
  locale = "en",
  identity,
}: {
  nav: CmsNavContent;
  locale?: Locale;
  /** Emblem, mark, and bilingual org name — CMS-editable via
   * /cms/settings/site-identity, shared with FooterClient so header and
   * footer branding can never go out of sync. */
  identity: CmsSiteIdentity;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { openPanel, panelOpen } = useAccessibilityPrefs();
  const isTa = locale === "ta";
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
            "mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-6 py-4 transition-[height] duration-200 sm:gap-0 sm:py-0 md:px-10",
            scrolled ? "sm:h-20" : "sm:h-24"
          )}
        >
          <a
            href="/"
            className="flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3"
            aria-label={isTa ? `TNeGA, ${identity.nameTamil} முகப்பு` : `TNeGA, ${identity.nameEnglish} home`}
          >
            {/* Both logos used to be hidden below sm because at their
                full size they alone ate ~170px of a ~290px-wide mobile
                row, leaving the wordmark only ~120px — not enough for
                either line. Per feedback, hiding them wasn't acceptable
                (logos need to stay visible on mobile too), so instead:
                the logos+divider become their own compact row (shrunk
                down, `sm:contents` un-wraps them back into the shared
                row once there's width to spare) and the wordmark drops
                to a second row underneath on mobile only. The header's
                own height switches from a fixed h-20/h-24 to auto (via
                py-3) below sm so it can grow to fit two rows, then locks
                back to the fixed height at sm+ where it's a single row
                again. */}
            <span className="flex items-center gap-2 sm:contents">
              {identity.emblemUrl ? (
                <Image
                  src={identity.emblemUrl}
                  width={identity.emblemWidth}
                  height={identity.emblemHeight}
                  alt="Government of Tamil Nadu emblem"
                  priority
                  className={clsx(
                    "w-auto transition-[height] duration-200",
                    scrolled ? "h-10 sm:h-14" : "h-12 sm:h-[4.5rem]"
                  )}
                />
              ) : null}
              <span
                aria-hidden
                className={clsx(
                  "w-px shrink-0 bg-hairline-strong transition-[height] duration-200",
                  scrolled ? "h-8 sm:h-11" : "h-9 sm:h-14"
                )}
              />
              {identity.markUrl ? (
                <Image
                  src={identity.markUrl}
                  width={identity.markWidth}
                  height={identity.markHeight}
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
                    "w-auto shrink-0 transition-[height] duration-200",
                    scrolled ? "h-10 sm:h-14" : "h-12 sm:h-[4.5rem]"
                  )}
                />
              ) : null}
            </span>
            {/* min-w-0 lets this column actually shrink within the flex
                row instead of forcing the row wider than the header —
                without it the Tamil wordmark (several words, no short
                abbreviated form the way "TNeGA" was) wrapped across 3-4
                lines. gap on the Tamil line uses leading-[1.5] (not the
                tighter leading this shares with the English line below
                it) — Tamil's taller vowel signs were getting clipped at
                the top by too short a line box. Both lines always
                render — a smaller text-[11px] on mobile now that the
                logos sit on their own row above, stepping up at sm/md
                once the logos rejoin the row. */}
            <span className="flex min-w-0 flex-col gap-0.5 sm:gap-1">
              <span
                lang="ta"
                className="block truncate text-[11px] font-semibold leading-[1.5] text-[var(--color-primary-blue)] sm:text-[15px] sm:leading-[1.6] md:text-[16px]"
              >
                {identity.nameTamil}
              </span>
              <span className="block truncate text-[11px] font-semibold leading-[1.3] text-[var(--color-primary-blue)] sm:text-[15px] sm:leading-[1.4] md:text-[16px]">
                {identity.nameEnglish}
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="/"
              aria-label={isTa ? "முகப்பு" : "Home"}
              aria-current={pathname === "/" ? "page" : undefined}
              data-track="nav_Home"
              className={clsx(
                "flex items-center p-2 text-ink transition-colors hover:text-[var(--color-primary-blue)]",
                pathname === "/" && "text-[var(--color-primary-blue)]"
              )}
            >
              <HomeIcon className="h-5 w-5" />
            </a>

            <NavDropdown
              label={isTa ? "எங்களைப் பற்றி" : "About"}
              href="/about"
              locale={locale}
              panel={
                <div className="flex flex-col">
                  {nav.about.map((item) => (
                    <DropdownLink key={item.href} {...item} />
                  ))}
                </div>
              }
            />

            <NavDropdown
              label={isTa ? "சேவைகள்" : "Services"}
              locale={locale}
              panel={
                <div className="flex flex-col">
                  {nav.services.map((item) => (
                    <DropdownLink key={item.href} {...item} />
                  ))}
                </div>
              }
            />

            <NavDropdown
              label={isTa ? "பிற" : "Others"}
              iconTrigger={<MenuIcon className="h-5 w-5" />}
              panelClassName="grid w-[420px] max-w-[90vw] grid-cols-2 gap-4 p-5"
              locale={locale}
              panel={
                <>
                  <div>
                    <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">
                      {isTa ? "புதுப்பிப்புகள்" : "Updates"}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {nav.notificationsUpdates.map((item) => (
                        <DropdownLink key={item.href} {...item} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">
                      {isTa ? "ஆவணங்கள்" : "Documents"}
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
              data-track="contact_us"
              data-track-type="conversion"
              className="type-button btn-primary shadow-[0_4px_14px_rgba(29,63,143,0.35)]"
            >
              {isTa ? "எங்களை அணுகவும்" : "Contact us"}
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink lg:hidden"
            aria-label={isTa ? "மெனுவைத் திற" : "Open menu"}
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
          aria-label={isTa ? "அணுகல்தன்மை விருப்பங்கள்" : "Accessibility options"}
          aria-pressed={panelOpen}
          className={clsx(
            "flex h-11 items-center gap-2 rounded-full border px-4 text-ink shadow-[0_4px_14px_rgba(12,10,9,0.16)] transition-colors hover:bg-[var(--color-surface-strong)]",
            panelOpen ? "border-[var(--color-primary-blue)] bg-[var(--color-surface-strong)]" : "border-hairline bg-surface-card"
          )}
        >
          <AccessibilityIcon className="h-5 w-5 shrink-0" />
          <span className="type-body-sm font-medium">{isTa ? "அணுகல்தன்மை" : "Accessibility"}</span>
        </button>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={isTa ? "மெனுவைத் திற" : "Open menu"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-card text-ink shadow-[0_4px_14px_rgba(12,10,9,0.16)] transition-colors hover:bg-[var(--color-surface-strong)]"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      <MobileDrawer nav={nav} open={drawerOpen} onClose={() => setDrawerOpen(false)} locale={locale} />
    </>
  );
}
