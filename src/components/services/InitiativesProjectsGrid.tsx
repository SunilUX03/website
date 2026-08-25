"use client";

import { useEffect, useState } from "react";
import type { CmsServiceItemDetail as ServiceItem } from "@/lib/cms/service-types";
import { ServiceItemCard } from "./ServiceItemCard";
import { MobileCardStack } from "@/components/ui/MobileCardStack";
import { useIsDesktop } from "@/lib/hooks";
import type { Locale } from "@/lib/locale";

// Desktop stays a static grid; mobile keeps the Services page's own
// vertical card-deck scroll mechanic (MobileCardStack) — distinct from
// the horizontal AutoCarousel used elsewhere, per standing instruction.
export function InitiativesProjectsGrid({ items, locale = "en" }: { items: ServiceItem[]; locale?: Locale }) {
  const isDesktop = useIsDesktop();

  // MobileCardStack sits flush below the nav and needs the nav's real,
  // scroll-dependent height for its sticky viewport offset.
  const [navHeight, setNavHeight] = useState(80);
  useEffect(() => {
    const stickyNav = document.querySelector("header .sticky.z-50");
    if (!stickyNav) return;
    const ro = new ResizeObserver((entries) => setNavHeight(entries[0].contentRect.height));
    ro.observe(stickyNav);
    return () => ro.disconnect();
  }, []);

  if (isDesktop === true) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {items.map((item) => (
          <ServiceItemCard key={item.name + item.stats} item={item} locale={locale} />
        ))}
      </div>
    );
  }

  if (isDesktop === false) {
    return (
      <MobileCardStack
        items={items}
        getKey={(item) => item.name + item.stats}
        renderCard={(item) => <ServiceItemCard item={item} locale={locale} />}
        topPx={navHeight}
      />
    );
  }

  return null;
}
