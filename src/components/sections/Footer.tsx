"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { footer, ecosystem } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { formatIndianNumber } from "@/lib/format";

const BUILD_DATE = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function VisitorCounter() {
  // No real analytics backend wired up yet — deterministic placeholder
  // count so it doesn't reshuffle on every render/hydration.
  const [count] = useState(1731316);
  return <span>{formatIndianNumber(count)}</span>;
}

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="border-t border-hairline bg-canvas">
      <Container className="grid grid-cols-1 gap-10 py-xxl md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-8">
        <div className="flex flex-col gap-4">
          <Image
            src="/images/tnega-logo.png"
            alt="Government of Tamil Nadu emblem and TNeGA — Tamil Nadu e-Governance Agency"
            width={980}
            height={186}
            className="h-14 w-auto"
          />
          <p className="type-body-sm text-[var(--color-body)]">{footer.description}</p>
          <p className="type-body-sm text-[var(--color-body)]">{footer.address}</p>
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
            {["Facebook", "X", "YouTube"].map((label) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="voice-icon-circular flex h-8 w-8 items-center justify-center text-[10px] font-medium text-ink"
              >
                {label[0]}
              </a>
            ))}
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
          <p className="type-title-sm mb-4 text-ink">Ecosystem</p>
          <div className="grid grid-cols-2 gap-3">
            {ecosystem
              .filter((org) => org.name !== "TNeGA")
              .map((org) => (
                <a
                  key={org.name}
                  href={org.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-20 items-center justify-center rounded-2xl border border-hairline p-2 transition-colors hover:border-hairline-strong"
                >
                  <Image
                    src={org.logo}
                    alt={org.name}
                    width={192}
                    height={192}
                    className="h-full w-full object-contain"
                  />
                </a>
              ))}
          </div>
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

          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
            <span className="type-caption rounded border border-hairline-strong px-2 py-1 text-[var(--color-muted)]">
              WCAG 2.1 AA
            </span>
            <span className="type-caption rounded border border-hairline-strong px-2 py-1 text-[var(--color-muted)]">
              W3C
            </span>
          </div>

          <p className="type-body-sm text-[var(--color-muted)]">Last Updated: {BUILD_DATE}</p>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 md:justify-end">
            {["Privacy Policy", "Disclaimer", "Terms of Use", "Accessibility"].map((label) => (
              <a
                key={label}
                href="#"
                className="type-body-sm text-[var(--color-muted)] hover:text-ink"
              >
                {label}
              </a>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
