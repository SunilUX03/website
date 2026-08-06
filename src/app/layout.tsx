import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Tamil } from "next/font/google";
import { AccessibilityProvider } from "@/lib/accessibility";
import { AccessibilityPanel } from "@/components/nav/AccessibilityPanel";
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

export const metadata: Metadata = {
  title: "TNeGA — Tamil Nadu e-Governance Agency",
  description:
    "Tamil Nadu e-Governance Agency designs, builds and manages large-scale digital platforms that deliver essential government services to citizens and departments — transparently, efficiently and at scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      </body>
    </html>
  );
}
