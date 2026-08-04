"use client";

import { useEffect, useRef, useState } from "react";
import {
  citizenServices,
  interdepartmentalProjects,
  sharedServices,
  ServiceItem,
} from "@/lib/services-content";
import { pillars } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { ServiceItemCard } from "./ServiceItemCard";
import { MobileCardStack } from "@/components/ui/MobileCardStack";
import { useIsDesktop, useReducedMotion } from "@/lib/hooks";

// Reuses Home's governance-band copy verbatim (see `pillars` in
// lib/content.ts) so this intro never drifts out of sync with what Home
// already says about the same 3 sections — one source of truth.
const TINT_COLOR = {
  sky: "var(--color-gradient-sky)",
  peach: "var(--color-gradient-peach)",
  mint: "var(--color-gradient-mint)",
} as const;

const TABS = [
  {
    id: "citizen-services",
    label: "Citizen Services",
    items: citizenServices,
    tint: "sky" as const,
  },
  {
    id: "interdepartmental-projects",
    label: "Interdepartmental Projects",
    items: interdepartmentalProjects,
    tint: "peach" as const,
  },
  { id: "services", label: "Services", items: sharedServices, tint: "mint" as const },
] as const;

type TabId = (typeof TABS)[number]["id"];

function isTabId(value: string): value is TabId {
  return TABS.some((tab) => tab.id === value);
}

function getIntroDescription(label: string) {
  return pillars.find((p) => p.title === label)?.description ?? "";
}

function SectionIntro({ description, tint }: { description: string; tint: keyof typeof TINT_COLOR }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-hairline bg-surface-card p-6 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${TINT_COLOR[tint]} 0%, transparent 70%)`, opacity: 0.55 }}
      />
      <p className="type-body-md relative max-w-[70ch] text-[var(--color-body)]">{description}</p>
    </div>
  );
}

function ServiceGridDesktop({ items }: { items: readonly ServiceItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {items.map((item) => (
        <ServiceItemCard key={item.name + item.stats} item={item} />
      ))}
    </div>
  );
}

// Services' own vertical card-deck scroll — kept distinct from the
// horizontal AutoCarousel used elsewhere (Awards, Governing Board Members,
// Home's PillarCards) per explicit instruction: this page's mobile grid
// stays on the stacking mechanic, not a carousel.
function ServiceGridMobile({ items, topPx }: { items: readonly ServiceItem[]; topPx: number }) {
  return (
    <MobileCardStack
      items={items as ServiceItem[]}
      getKey={(item) => item.name + item.stats}
      renderCard={(item) => <ServiceItemCard item={item} />}
      topPx={topPx}
    />
  );
}

const FADE_MS = 150;

export function ServicesTabs() {
  const [active, setActive] = useState<TabId>("citizen-services");
  // The tab actually rendered — swaps at the crossfade midpoint so content
  // never changes mid-fade-out (plain state + CSS transition, not
  // AnimatePresence: its exit/enter choreography got stuck under React
  // Strict Mode's double-invoked effects in dev, leaving one panel frozen
  // at opacity 0 and the other never animating in).
  const [displayed, setDisplayed] = useState<TabId>("citizen-services");
  const [fading, setFading] = useState(false);
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Still tracked (not the tab bar itself anymore — that's no longer
  // sticky) because MobileCardStack's own internal sticky viewport needs
  // to know the nav's real height to sit flush below it.
  const [navHeight, setNavHeight] = useState(80);
  const navHeightRef = useRef(navHeight);
  useEffect(() => {
    navHeightRef.current = navHeight;
  }, [navHeight]);
  useEffect(() => {
    const stickyNav = document.querySelector("header .sticky.z-50");
    if (!stickyNav) return;
    const ro = new ResizeObserver((entries) => setNavHeight(entries[0].contentRect.height));
    ro.observe(stickyNav);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // Scrolls to the tab bar itself (not just the card grid) so a link
    // straight into a section — e.g. Home's "View all Citizen Services" —
    // always lands with all 3 tabs AND the cards in view, never just the
    // cards with no context for which tab is active. Programmatic, not a
    // native #hash jump: the tabpanel used to carry the hash as its own
    // `id`, but that id doesn't exist in the DOM for any tab besides the
    // default one until this effect has already run, so the browser's own
    // anchor-scroll had nothing reliable to land on for the other two.
    const syncFromHash = (instant: boolean) => {
      const hash = window.location.hash.replace("#", "");
      if (!isTabId(hash)) return;
      setActive(hash);
      setDisplayed(hash);
      requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - navHeightRef.current - 16;
        window.scrollTo({ top, behavior: instant || reducedMotion ? "auto" : "smooth" });
      });
    };
    syncFromHash(true);
    const onHashChange = () => syncFromHash(false);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  }, []);

  const selectTab = (id: TabId) => {
    if (id === active) return;
    setActive(id);
    // replaceState (not location.hash=) so switching tabs doesn't jump-scroll
    // the page or spam browser history — the hash still ends up shareable.
    history.replaceState(null, "", `#${id}`);

    if (reducedMotion) {
      setDisplayed(id);
      return;
    }
    setFading(true);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setDisplayed(id);
      setFading(false);
    }, FADE_MS);
  };

  const displayedTab = TABS.find((tab) => tab.id === displayed) ?? TABS[0];

  return (
    <section ref={sectionRef} className="bg-canvas">
      {/* Not sticky — tried twice, caused more problems than it solved
          (gaps, overlap, footer bleeding in). Just a normal in-flow bar. */}
      <div className="border-b border-hairline bg-canvas">
        <Container>
          <div role="tablist" aria-label="Service sections" className="flex gap-3 py-5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active === tab.id}
                onClick={() => selectTab(tab.id)}
                className={`type-button ${active === tab.id ? "btn-primary" : "btn-outline"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="pb-xxl pt-lg md:pb-section md:pt-xl">
        <div
          role="tabpanel"
          className="transition-opacity ease-in-out"
          style={{
            opacity: fading ? 0 : 1,
            transitionDuration: reducedMotion ? "0ms" : `${FADE_MS}ms`,
          }}
        >
          <SectionIntro description={getIntroDescription(displayedTab.label)} tint={displayedTab.tint} />
          {isDesktop === true && <ServiceGridDesktop items={displayedTab.items} />}
          {isDesktop === false && <ServiceGridMobile items={displayedTab.items} topPx={navHeight} />}
        </div>
      </Container>
    </section>
  );
}
