"use client";

import { useEffect, useRef, useState } from "react";
import { citizenServices, govtDigitalServices, ServiceItem } from "@/lib/services-content";
import { Container } from "@/components/ui/Container";
import { ServiceItemCard } from "./ServiceItemCard";
import { StackedScrollCards } from "@/components/ui/StackedScrollCards";
import { useIsDesktop, useReducedMotion } from "@/lib/hooks";

const TABS = [
  { id: "citizen-services", label: "Citizen Services", items: citizenServices },
  { id: "govt-digital-services", label: "Govt Digital Services", items: govtDigitalServices },
] as const;

type TabId = (typeof TABS)[number]["id"];

function isTabId(value: string): value is TabId {
  return TABS.some((tab) => tab.id === value);
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

// Nav (scrolled height, matches its `top-20`) + this page's own sticky tab
// bar (py-5 padding + the 40px btn height + border) sit above the mobile
// card stack, so it needs to stick below *both* — not just the nav, like
// Home/About's (only) sticky layer.
const NAV_HEIGHT_PX = 80;
const TAB_BAR_HEIGHT_PX = 81;

// Same card-stack-scroll interaction as Home's PillarCards / About's Awards,
// generalized to N items — see StackedScrollCards.
function ServiceGridMobile({ items }: { items: readonly ServiceItem[] }) {
  return (
    <StackedScrollCards
      items={items as ServiceItem[]}
      getKey={(item) => item.name + item.stats}
      renderCard={(item, className) => <ServiceItemCard item={item} className={className} />}
      topPx={NAV_HEIGHT_PX + TAB_BAR_HEIGHT_PX}
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

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (isTabId(hash)) {
        setActive(hash);
        setDisplayed(hash);
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
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
    <section className="bg-canvas">
      {/* Shadow (not just an opaque bg) so this reads as a floating layer
          above the cards it scrolls over, instead of looking flush/stuck
          onto whatever row happens to be scrolled underneath it. */}
      <div className="sticky top-20 z-40 border-b border-hairline bg-canvas shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
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

      <Container className="py-xxl md:py-section">
        <div
          id={displayedTab.id}
          role="tabpanel"
          className="transition-opacity ease-in-out"
          style={{
            opacity: fading ? 0 : 1,
            transitionDuration: reducedMotion ? "0ms" : `${FADE_MS}ms`,
          }}
        >
          {isDesktop === true && <ServiceGridDesktop items={displayedTab.items} />}
          {isDesktop === false && <ServiceGridMobile items={displayedTab.items} />}
        </div>
      </Container>
    </section>
  );
}
