"use client";

import { useEffect, useRef, useState } from "react";
import { citizenServices, govtDigitalServices, ServiceItem } from "@/lib/services-content";
import { Container } from "@/components/ui/Container";
import { ServiceItemCard } from "./ServiceItemCard";
import { MobileCardStack } from "@/components/ui/MobileCardStack";
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

// Same card-deck interaction as Home's PillarCards / About's Awards —
// MobileCardStack is the one shared implementation all three now use.
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

  // Still tracked (not the tab bar itself anymore — that's no longer
  // sticky) because MobileCardStack's own internal sticky viewport needs
  // to know the nav's real height to sit flush below it, same as Home's
  // PillarCards / About's Awards.
  const [navHeight, setNavHeight] = useState(80);
  useEffect(() => {
    const stickyNav = document.querySelector("header .sticky.z-50");
    if (!stickyNav) return;
    const ro = new ResizeObserver((entries) => setNavHeight(entries[0].contentRect.height));
    ro.observe(stickyNav);
    return () => ro.disconnect();
  }, []);

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
          id={displayedTab.id}
          role="tabpanel"
          className="transition-opacity ease-in-out"
          style={{
            opacity: fading ? 0 : 1,
            transitionDuration: reducedMotion ? "0ms" : `${FADE_MS}ms`,
          }}
        >
          {isDesktop === true && <ServiceGridDesktop items={displayedTab.items} />}
          {isDesktop === false && <ServiceGridMobile items={displayedTab.items} topPx={navHeight} />}
        </div>
      </Container>
    </section>
  );
}
