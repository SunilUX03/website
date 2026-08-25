import type { Metadata } from "next";
import Link from "next/link";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { getLocale } from "@/lib/locale";
import { getSiteMap } from "@/lib/cms/site-map";

export const metadata: Metadata = {
  title: "Site Map | TNeGA",
  description: "A full list of pages on the Tamil Nadu e-Governance Agency website.",
};

export default async function SiteMapPage() {
  const locale = await getLocale();
  const isTa = locale === "ta";
  const SITEMAP = await getSiteMap(locale);

  return (
    <>
      <TopNav />
      <main className="flex-1" id="main-content">
        <Breadcrumb items={[{ label: isTa ? "தள வரைபடம்" : "Site Map" }]} locale={locale} />
        <section className="bg-canvas">
          <Container className="py-xl md:py-xxl">
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">{isTa ? "வழிசெலுத்தல்" : "Navigate"}</p>
            <h1 className="type-display-lg text-ink">{isTa ? "தள வரைபடம்" : "Site Map"}</h1>
          </Container>
        </section>
        <section className="bg-canvas-soft">
          <Container className="py-xxl md:py-section">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {SITEMAP.map((group) => (
                <div key={group.heading} className="card-feature">
                  <h2 className="type-title-md mb-4 text-ink">{group.heading}</h2>
                  <ul className="flex flex-col gap-2">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="type-body-sm text-[var(--color-body)] hover:text-[var(--color-primary-blue)]">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
