import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Tamil } from "next/font/google";
import { AccessibilityProvider } from "@/lib/accessibility";
import { AccessibilityPanel } from "@/components/nav/AccessibilityPanel";
import { CookieConsentBanner } from "@/components/consent/CookieConsentBanner";
import { AnalyticsPageviewTracker } from "@/components/consent/AnalyticsPageviewTracker";
import { AnalyticsClickTracker } from "@/components/consent/AnalyticsClickTracker";
import { getLocale } from "@/lib/locale";
import { getSiteIdentity } from "@/lib/cms/site-identity";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const notoSansTamil = Noto_Sans_Tamil({
  variable: "--font-noto-sans-tamil",
  subsets: ["tamil"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

/** The favicon has its own CMS field (Site Identity → Favicon,
 * /cms/settings/site-identity), separate from the TNeGA mark used in the
 * header/footer — a favicon often needs a simplified/higher-contrast
 * crop to stay legible at tab-icon size, so it isn't forced to always be
 * the exact same file as the full logo. Falls back to the mark if no
 * dedicated favicon has been uploaded (see lib/cms/site-identity.ts).
 * `generateMetadata` (not a static `metadata` export) so this is fetched
 * per-request rather than baked in at build time. */
export async function generateMetadata(): Promise<Metadata> {
  const identity = await getSiteIdentity();
  return {
    title: "TNeGA | Tamil Nadu e-Governance Agency",
    description:
      "Tamil Nadu e-Governance Agency designs, builds and manages large-scale digital platforms that deliver essential government services to citizens and departments, transparently, efficiently and at scale.",
    icons: identity.faviconUrl ? { icon: identity.faviconUrl } : undefined,
    verification: { google: "T3h1q_037F3I2PRWKS6sfMH1rXIMw9UTVqndcl9nap4" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${notoSansTamil.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <AccessibilityProvider>
          {children}
          <AccessibilityPanel />
        </AccessibilityProvider>
        <CookieConsentBanner locale={locale} />
        <AnalyticsPageviewTracker />
        <AnalyticsClickTracker />
      </body>
    </html>
  );
}
