import type { Locale } from "@/lib/locale";

export type ServiceCta = { label: string; href: string; external: boolean };

type CtaSource = {
  accessPortalHref?: string;
  knowMoreHref: string;
  real?: { ctaLabel?: string; comingSoon?: boolean; gatedAccess?: boolean };
};

/** The two buttons a service/project card shows: a primary one (custom
 * CTA label, Coming Soon, Access Portal, or Avail Service) and Know More.
 * One definition shared by the Initiatives & Projects cards and the Home
 * Spotlight so the two always show the same buttons. */
export function getServiceCtas(item: CtaSource, locale: Locale = "en"): ServiceCta[] {
  const isTa = locale === "ta";
  let primary: ServiceCta;

  if (item.real?.ctaLabel) {
    primary = { label: item.real.ctaLabel, href: item.accessPortalHref || "/reach-us", external: true };
  } else if (item.real?.comingSoon) {
    primary = { label: isTa ? "விரைவில்" : "Coming Soon", href: item.knowMoreHref, external: false };
  } else if (item.accessPortalHref && !item.real?.gatedAccess) {
    primary = { label: isTa ? "போர்ட்டலை அணுகவும்" : "Access Portal", href: item.accessPortalHref, external: true };
  } else {
    primary = { label: isTa ? "சேவையைப் பெறவும்" : "Avail Service", href: "/reach-us", external: false };
  }

  return [primary, { label: isTa ? "மேலும் அறிக" : "Know More", href: item.knowMoreHref, external: false }];
}
