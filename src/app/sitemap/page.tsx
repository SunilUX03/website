import type { Metadata } from "next";
import Link from "next/link";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Site Map | TNeGA",
  description: "A full list of pages on the Tamil Nadu e-Governance Agency website.",
};

const SITEMAP: { heading: string; links: { label: string; href: string }[] }[] = [
  { heading: "Home", links: [{ label: "Home", href: "/" }] },
  {
    heading: "About",
    links: [
      { label: "Overview", href: "/about" },
      { label: "Leadership", href: "/about#leadership" },
      { label: "Organisation structure", href: "/about#organisation-structure" },
      { label: "Careers", href: "/about/careers" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Citizen Services", href: "/services#citizen-services" },
      { label: "e-Governance Projects", href: "/services#e-governance-projects" },
      { label: "Services", href: "/services#services" },
    ],
  },
  {
    heading: "Notifications",
    links: [
      { label: "Announcements", href: "/notifications/announcements" },
      { label: "Media & Press", href: "/notifications/media-press" },
      { label: "RTI", href: "/notifications/rti" },
      { label: "Tenders", href: "/notifications/tenders" },
      { label: "Government Orders", href: "/notifications/government-orders" },
      { label: "Policies & Guidelines", href: "/notifications/policies-guidelines" },
    ],
  },
  {
    heading: "Help & Support",
    links: [
      { label: "Help", href: "/help" },
      { label: "Feedback", href: "/feedback" },
      { label: "Contact Us", href: "/reach-us" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Terms of Use", href: "/terms-of-use" },
      { label: "Site Map", href: "/sitemap" },
    ],
  },
];

export default function SiteMapPage() {
  return (
    <>
      <TopNav />
      <main className="flex-1" id="main-content">
        <Breadcrumb items={[{ label: "Site Map" }]} />
        <section className="bg-canvas">
          <Container className="py-xl md:py-xxl">
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Navigate</p>
            <h1 className="type-display-lg text-ink">Site Map</h1>
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
