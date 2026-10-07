import type { Metadata } from "next";
import { AccessibilityProvider } from "@/lib/accessibility";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { NotFoundContent } from "@/components/errors/NotFoundContent";
import "./(frontend)/globals.css";
import { notoSans, notoSansTamil } from "./(frontend)/fonts";

export const metadata: Metadata = {
  title: "Page not found | TNeGA",
  robots: { index: false },
};

// Shown for URLs that match no page at all (a plain typo like /abuot).
// Bypasses the normal layout, so it brings its own html/body, fonts and
// providers; a not-found raised from inside a real route uses
// (frontend)/not-found.tsx instead.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoSansTamil.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <AccessibilityProvider>
          <TopNav />
          <main className="flex-1">
            <NotFoundContent />
          </main>
          <Footer />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
