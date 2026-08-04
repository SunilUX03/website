"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { footer } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { formatIndianNumber } from "@/lib/format";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/SocialIcons";
import { toggleAccessibilityWidget } from "@/components/nav/AccessibilityBar";
import { WebInfoManagerModal } from "@/components/legal/WebInfoManagerModal";

const BOTTOM_LINKS: { label: string; href?: string }[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Accessibility" },
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

function VisitorCounter() {
  // No real analytics backend wired up yet — deterministic placeholder
  // count so it doesn't reshuffle on every render/hydration.
  const [count] = useState(1731316);
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

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);
  const [webInfoOpen, setWebInfoOpen] = useState(false);

  return (
    <footer className="border-t border-hairline bg-canvas">
      <Container className="grid grid-cols-1 gap-10 py-xxl md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-8">
        <div className="flex flex-col gap-4">
          {/* Identical mark composition to the top nav (MainNav): state
              emblem + divider + TNeGA icon + text label, so header and
              footer carry the exact same government identity rather than
              two different TNeGA logo files. */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/tn-emblem.png"
              alt="Government of Tamil Nadu emblem"
              width={178}
              height={186}
              className="h-12 w-auto"
            />
            <span aria-hidden className="h-11 w-px shrink-0 bg-hairline-strong" />
            <Image
              src="/images/logos/tnega-mark.png"
              alt=""
              aria-hidden
              width={512}
              height={512}
              className="h-12 w-auto shrink-0"
            />
            <span className="leading-tight">
              <span className="type-title-md block font-semibold text-[var(--color-primary-blue)] md:text-lg">
                TNeGA
              </span>
              <span className="type-caption text-[var(--color-muted)]">
                Tamil Nadu e-Governance Agency
              </span>
            </span>
          </div>

          <p className="type-body-sm text-[var(--color-body)]">{footer.description}</p>
          <p className="type-body-sm text-[var(--color-body)]">{footer.address}</p>

          <a
            href={footer.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="type-body-sm inline-flex w-fit items-center gap-1.5 font-medium text-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue-active)]"
          >
            <DirectionsIcon />
            View Directions
          </a>

          <p className="type-body-sm text-[var(--color-body)]">
            <a href={`tel:${footer.phone.replace(/\s|-/g, "")}`} className="hover:text-ink">
              {footer.phone}
            </a>
          </p>
          <p className="type-body-sm text-[var(--color-body)]">
            <a href={`mailto:${footer.email}`} className="hover:text-ink">
              {footer.email}
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
          <p className="type-title-sm mb-4 text-ink">Quick Links</p>
          <ul className="flex flex-col gap-2">
            {footer.quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="type-body-sm text-[var(--color-body)] hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="type-title-sm mb-4 text-ink">Citizen Services</p>
          <ul className="flex flex-col gap-2">
            {footer.citizenServices.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="type-body-sm text-[var(--color-body)] hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="type-title-sm mb-4 text-ink">Help &amp; Support</p>
          <ul className="flex flex-col gap-2">
            {footer.helpSupport.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="type-body-sm text-[var(--color-body)] hover:text-ink">
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
            © {year} Tamil Nadu e-Governance Agency, Government of Tamil Nadu. All rights reserved.
          </p>

          <p className="type-body-sm text-[var(--color-muted)]">
            Visitors: <VisitorCounter />
          </p>

          <p className="type-body-sm text-[var(--color-muted)]">Last Updated: {BUILD_DATE}</p>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 md:justify-end">
            {BOTTOM_LINKS.map((link) =>
              link.href ? (
                <a key={link.label} href={link.href} className="type-body-sm text-[var(--color-muted)] hover:text-ink">
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.label}
                  type="button"
                  onClick={toggleAccessibilityWidget}
                  className="type-body-sm text-[var(--color-muted)] hover:text-ink"
                >
                  {link.label}
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
            style={{ color: "#0284c7" }}
          >
            Web Information Manager: Tamil Nadu e-Governance Agency
          </button>
        </Container>

        <WebInfoManagerModal open={webInfoOpen} onClose={() => setWebInfoOpen(false)} />
      </div>
    </footer>
  );
}
