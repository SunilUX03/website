"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { CmsFooterContent } from "@/lib/cms/footer-types";
import { Container } from "@/components/ui/Container";
import { formatIndianNumber, obfuscateEmail } from "@/lib/format";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/SocialIcons";
import { useAccessibilityPrefs } from "@/lib/accessibility";
import { WebInfoManagerModal } from "@/components/legal/WebInfoManagerModal";
import type { Locale } from "@/lib/locale";
import type { CmsSiteIdentity } from "@/lib/cms/site-identity";
import { openCookiePreferences } from "@/lib/consent";

const BOTTOM_LINKS: { label: string; labelTa: string; href?: string; action?: "accessibility" | "cookiePreferences" }[] = [
  { label: "Privacy Policy", labelTa: "தனியுரிமைக் கொள்கை", href: "/privacy-policy" },
  { label: "Cookie Policy", labelTa: "குக்கீக் கொள்கை", href: "/cookie-policy" },
  { label: "Disclaimer", labelTa: "பொறுப்புத் துறப்பு", href: "/disclaimer" },
  { label: "Terms of Use", labelTa: "பயன்பாட்டு விதிமுறைகள்", href: "/terms-of-use" },
  { label: "Accessibility", labelTa: "அணுகல்தன்மை", action: "accessibility" },
  { label: "Cookie Preferences", labelTa: "குக்கீ விருப்பத்தேர்வுகள்", action: "cookiePreferences" },
];

const BUILD_DATE = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const SOCIAL_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook: FacebookIcon,
  X: XIcon,
  YouTube: YouTubeIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
};

function VisitorCounter({ count }: { count: number }) {
  return <span>{formatIndianNumber(count)}</span>;
}

function DirectionsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
      <path
        d="M3 11 20 4l-7 17-2.5-7.5L3 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FooterClient({
  footer,
  locale = "en",
  identity,
  visitorCount,
}: {
  footer: CmsFooterContent;
  locale?: Locale;
  /** Emblem, mark, and bilingual org name — CMS-editable via
   * /cms/settings/site-identity, shared with MainNav so header and
   * footer branding can never go out of sync. */
  identity: CmsSiteIdentity;
  /** All-time pageview count, from the real analytics pipeline — see
   * getLifetimePageviewCount(). Replaces what used to be a hardcoded
   * placeholder number. */
  visitorCount: number;
}) {
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);
  const [webInfoOpen, setWebInfoOpen] = useState(false);
  const { openPanel } = useAccessibilityPrefs();
  const isTa = locale === "ta";

  return (
    <footer className="border-t border-hairline bg-[#ebedee]">
      <Container className="grid grid-cols-1 gap-10 py-xxl md:grid-cols-[2.4fr_1fr_1fr_1fr] md:gap-8">
        <div className="flex min-w-0 flex-col gap-4">
          {/* Identical mark composition to the top nav (MainNav): state
              emblem + divider + TNeGA icon + text label, so header and
              footer carry the exact same government identity rather than
              two different TNeGA logo files. Logos are always visible
              (never hidden below a breakpoint) at a smaller size on
              mobile, stepping up at sm/md — and the wordmark wraps
              instead of truncating, so the full name is always readable
              regardless of exactly how much width the column has. */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {identity.emblemUrl ? (
              <Image
                src={identity.emblemUrl}
                width={identity.emblemWidth}
                height={identity.emblemHeight}
                alt="Government of Tamil Nadu emblem"
                className="h-9 w-auto shrink-0 sm:h-14"
              />
            ) : null}
            <span aria-hidden className="h-7 w-px shrink-0 bg-hairline-strong sm:h-11" />
            {identity.markUrl ? (
              <Image
                src={identity.markUrl}
                width={identity.markWidth}
                height={identity.markHeight}
                alt=""
                aria-hidden
                // Same box height as the TN emblem, and now matches the top
                // nav's own (unscrolled) logo height exactly — see
                // MainNav.tsx for why a CSS scale-up was tried and reverted.
                className="h-9 w-auto shrink-0 sm:h-14"
              />
            ) : null}
            {/* Same bilingual wordmark as MainNav.tsx, not a separate
                "TNeGA" + caption treatment — header and footer now carry
                identical branding, not just the same logo files. Wraps
                rather than truncates — a fixed-width single line kept
                clipping "Tamil Nadu e-Governance Agency" even at desktop
                widths, since the grid column's available width is close
                to the text's natural width. */}
            <span className="flex min-w-0 flex-col gap-0.5">
              <span
                lang="ta"
                className="block text-[11px] font-semibold leading-[1.5] text-[var(--color-primary-blue)] sm:text-[15px] md:text-[16px]"
              >
                {identity.nameTamil}
              </span>
              <span className="block text-[11px] font-semibold leading-[1.4] text-[var(--color-primary-blue)] sm:text-[15px] md:text-[16px]">
                {identity.nameEnglish}
              </span>
            </span>
          </div>

          <p className="type-body-sm text-[var(--color-body)]">{footer.description}</p>
          <p className="type-body-sm whitespace-pre-line text-[var(--color-body)]">{footer.address}</p>

          <a
            href={footer.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="type-body-sm inline-flex w-fit items-center gap-1.5 font-medium text-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue-active)]"
          >
            <DirectionsIcon />
            {isTa ? "வழிகளைக் காண்க" : "View Directions"}
          </a>

          <p className="type-body-sm text-[var(--color-body)]">
            <a href={`tel:${footer.phone.replace(/\s|-/g, "")}`} className="hover:text-ink">
              {footer.phone}
            </a>
          </p>
          <p className="type-body-sm text-[var(--color-body)]">
            <a href={`mailto:${footer.email}`} className="hover:text-ink">
              {obfuscateEmail(footer.email)}
            </a>
          </p>

          <div className="flex gap-3 pt-1">
            {footer.socialLinks.map((link) => {
              const Icon = SOCIAL_ICON[link.label];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="voice-icon-circular flex h-8 w-8 items-center justify-center text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <p className="type-title-sm mb-4 text-ink">{isTa ? "விரைவு இணைப்புகள்" : "Quick Links"}</p>
          <ul className="flex flex-col gap-2">
            {footer.quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} data-track={`footer_${link.label}`} className="type-body-sm text-[var(--color-body)] hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="type-title-sm mb-4 text-ink">{isTa ? "குடிமக்கள் சேவைகள்" : "Citizen Services"}</p>
          <ul className="mb-6 flex flex-col gap-2">
            {footer.citizenServices.map((link, i) => {
              const external = link.href.startsWith("http");
              return (
                // Index, not href — e-Sevai and UMIS now both point to
                // /citizen-services (they're just cards on that one page,
                // not separate detail pages), so href isn't unique here.
                <li key={`${link.href}-${i}`}>
                  <a
                    href={link.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    data-track={`footer_${link.label}`}
                    data-track-type={external ? "conversion" : undefined}
                    className="type-body-sm text-[var(--color-body)] hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href="/services-to-government"
            data-track="footer_Services to Govt"
            className="type-title-sm mb-4 block text-ink hover:text-[var(--color-primary-blue)]"
          >
            {isTa ? "அரசுக்கான சேவைகள்" : "Services to Govt"}
          </a>

          <p className="type-title-sm mb-4 text-ink">{isTa ? "முயற்சிகள் & திட்டங்கள்" : "Initiatives & Projects"}</p>
          <ul className="flex flex-col gap-2">
            {footer.initiativesProjects.map((link, i) => (
              <li key={`${link.href}-${i}`}>
                <a href={link.href} data-track={`footer_${link.label}`} className="type-body-sm text-[var(--color-body)] hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="type-title-sm mb-4 text-ink">{isTa ? "உதவி & ஆதரவு" : "Help & Support"}</p>
          <ul className="flex flex-col gap-2">
            {footer.helpSupport.map((link) => (
              <li key={link.label}>
                <a href={link.href} data-track={`footer_${link.label}`} className="type-body-sm text-[var(--color-body)] hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-hairline">
        <Container className="flex flex-col gap-3 py-6 text-center md:flex-row md:flex-wrap md:items-center md:justify-between md:text-left">
          <p className="type-body-sm text-[var(--color-muted)]">
            {isTa
              ? `© ${year} தமிழ்நாடு மின்-ஆளுமை முகமை, தமிழ்நாடு அரசு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.`
              : `© ${year} Tamil Nadu e-Governance Agency, Government of Tamil Nadu. All rights reserved.`}
          </p>

          <p className="type-body-sm text-[var(--color-muted)]">
            {isTa ? "பார்வையாளர்கள்: " : "Visitors: "}
            <VisitorCounter count={visitorCount} />
          </p>

          <p className="type-body-sm text-[var(--color-muted)]">{isTa ? "கடைசியாகப் புதுப்பிக்கப்பட்டது: " : "Last Updated: "}{BUILD_DATE}</p>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 md:justify-end">
            {BOTTOM_LINKS.map((link) =>
              link.href ? (
                <a key={link.label} href={link.href} data-track={`footer_bottom_${link.label}`} className="type-body-sm text-[var(--color-muted)] hover:text-ink">
                  {isTa ? link.labelTa : link.label}
                </a>
              ) : (
                <button
                  key={link.label}
                  type="button"
                  onClick={(e) => (link.action === "cookiePreferences" ? openCookiePreferences() : openPanel(e.currentTarget))}
                  className="type-body-sm text-[var(--color-muted)] hover:text-ink"
                >
                  {isTa ? link.labelTa : link.label}
                </button>
              )
            )}
          </div>
        </Container>

        <Container className="pb-6 text-center md:text-left">
          {/* Standard line on Indian government sites naming who's
              responsible for the site's content — light blue per request,
              using a shade with enough contrast against the canvas
              background rather than the very pale sky token used for
              decorative gradient orbs elsewhere on the site. Now a real
              trigger for the Web Information Manager contact modal rather
              than plain static text. */}
          <button
            type="button"
            onClick={() => setWebInfoOpen(true)}
            className="type-body-sm underline-offset-2 hover:underline"
            style={{ color: "var(--color-primary-blue)" }}
          >
            {isTa ? "இணைய தகவல் மேலாளர்: தமிழ்நாடு மின்-ஆளுமை முகமை" : "Web Information Manager: Tamil Nadu e-Governance Agency"}
          </button>
        </Container>

        <WebInfoManagerModal open={webInfoOpen} onClose={() => setWebInfoOpen(false)} phone={footer.phone} email={footer.email} locale={locale} />
      </div>
    </footer>
  );
}
