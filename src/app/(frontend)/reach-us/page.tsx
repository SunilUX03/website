import type { Metadata } from "next";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { getFooterContent } from "@/lib/cms/footer";
import { getSiteCopy } from "@/lib/cms/site-copy";
import { obfuscateEmail } from "@/lib/format";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Contact Us | TNeGA",
  description: "Get in touch with Tamil Nadu e-Governance Agency: helpline, email and office address.",
};

export const revalidate = 60;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path d="M4 5h16v11H8l-4 4V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path
        d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default async function ReachUs() {
  const locale = await getLocale();
  const [footer, siteCopy] = await Promise.all([getFooterContent(locale), getSiteCopy(locale)]);
  const isTa = locale === "ta";

  return (
    <>
      <TopNav />
      <main className="flex-1" id="main-content">
        <Breadcrumb items={[{ label: isTa ? "எங்களைத் தொடர்பு கொள்ளுங்கள்" : "Contact Us" }]} locale={locale} />

        <section className="relative overflow-hidden bg-canvas">
          <div
            aria-hidden
            className="orb-drift-a pointer-events-none absolute -left-32 -top-20 h-[420px] w-[420px] rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)",
              opacity: 0.4,
            }}
          />
          <Container className="relative py-xl md:py-xxl">
            <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">{siteCopy.reachUsHero.eyebrow}</p>
            <h1 className="type-display-lg mb-4 text-ink">{siteCopy.reachUsHero.heading}</h1>
            <p className="type-body-md md:whitespace-nowrap text-[var(--color-body)]">{siteCopy.reachUsHero.body}</p>
          </Container>
        </section>

        <section className="bg-canvas-soft">
          <Container className="py-xxl md:py-section">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="card-feature">
                <span className="voice-icon-circular mb-4 flex h-12 w-12 items-center justify-center text-ink">
                  <PhoneIcon />
                </span>
                <p className="type-caption-uppercase mb-1.5 text-[var(--color-muted)]">{isTa ? "உதவி எண்" : "Helpline"}</p>
                <a href={`tel:${footer.phone.replace(/\s|-/g, "")}`} className="type-title-md text-ink hover:text-[var(--color-primary-blue)]">
                  {footer.phone}
                </a>
              </div>

              <div className="card-feature">
                <span className="voice-icon-circular mb-4 flex h-12 w-12 items-center justify-center text-ink">
                  <MailIcon />
                </span>
                <p className="type-caption-uppercase mb-1.5 text-[var(--color-muted)]">{isTa ? "மின்னஞ்சல்" : "Email"}</p>
                <a href={`mailto:${footer.email}`} className="type-title-md text-ink hover:text-[var(--color-primary-blue)]">
                  {obfuscateEmail(footer.email)}
                </a>
              </div>

              <div className="card-feature">
                <span className="voice-icon-circular mb-4 flex h-12 w-12 items-center justify-center text-ink">
                  <PinIcon />
                </span>
                <p className="type-caption-uppercase mb-1.5 text-[var(--color-muted)]">
                  {isTa ? "பதிவு செய்யப்பட்ட அலுவலகம்" : "Registered Office"}
                </p>
                <p className="type-body-md mb-3 whitespace-pre-line text-ink">{footer.address}</p>
                <a
                  href={footer.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-body-sm font-medium text-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue-active)]"
                >
                  {isTa ? "வழிகளைக் காண்க →" : "View Directions →"}
                </a>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-canvas">
          <Container className="py-xxl md:py-section">
            <div className="mx-auto max-w-[640px] rounded-xl border border-hairline bg-surface-card p-6 text-center md:p-8">
              <h2 className="type-title-md mb-2 text-ink">
                {isTa ? "குறிப்பிட்ட ஒன்றைத் தேடுகிறீர்களா?" : "Looking for something specific?"}
              </h2>
              <p className="type-body-sm mb-5 text-[var(--color-muted)]">
                {isTa
                  ? "பொது கேள்விகள் மற்றும் கருத்துகளை கீழே உள்ள சேனல்கள் மூலமும் அனுப்பலாம்."
                  : "General queries and feedback can also go through the channels below."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="/feedback" className="type-button btn-primary">
                  {isTa ? "கருத்து பகிரவும்" : "Share Feedback"}
                </a>
                <a href="/help" className="type-button btn-outline">
                  {isTa ? "உதவி மையத்தைப் பார்வையிடவும்" : "Visit Help Centre"}
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
