import { Container } from "@/components/ui/Container";
import { getLocale } from "@/lib/locale";

const COPY = {
  en: {
    eyebrow: "Error 404",
    heading: "We can't find that page",
    lead: "Don't worry. Nothing is wrong with your device or your request. The link you followed doesn't lead anywhere right now.",
    whyTitle: "Why this might have happened",
    reasons: [
      "The link is old, or has a typing mistake.",
      "The page was moved or renamed.",
      "The page was removed after its content was updated.",
    ],
    home: "Go to Home",
    contact: "Contact us",
    jump: "Or jump straight to",
    note: "If you reached this page from a link on another website, please tell us through Contact us so we can fix it.",
    graphicLabel: "A browser window showing a 404 while a magnifying glass searches for the page.",
  },
  ta: {
    eyebrow: "பிழை 404",
    heading: "அந்தப் பக்கத்தைக் காண முடியவில்லை",
    lead: "கவலைப்பட வேண்டாம். உங்கள் சாதனத்திலோ உங்கள் கோரிக்கையிலோ எந்தத் தவறும் இல்லை. நீங்கள் பின்தொடர்ந்த இணைப்பு தற்போது எங்கும் இட்டுச் செல்லவில்லை.",
    whyTitle: "இது ஏன் நடந்திருக்கலாம்",
    reasons: [
      "இணைப்பு பழையதாக இருக்கலாம் அல்லது எழுத்துப்பிழை இருக்கலாம்.",
      "பக்கம் இடம் மாற்றப்பட்டிருக்கலாம் அல்லது பெயர் மாற்றப்பட்டிருக்கலாம்.",
      "உள்ளடக்கம் புதுப்பிக்கப்பட்ட பிறகு பக்கம் நீக்கப்பட்டிருக்கலாம்.",
    ],
    home: "முகப்புக்குச் செல்லவும்",
    contact: "எங்களை அணுகவும்",
    jump: "அல்லது நேரடியாகச் செல்லவும்",
    note: "வேறொரு இணையதளத்தில் உள்ள இணைப்பிலிருந்து இங்கு வந்திருந்தால், அதைச் சரிசெய்ய எங்களை அணுகி தெரிவிக்கவும்.",
    graphicLabel: "404 காட்டும் உலாவி சாளரம்; ஒரு உருப்பெருக்கி கண்ணாடி பக்கத்தைத் தேடுகிறது.",
  },
} as const;

const LINKS = {
  en: [
    { label: "Citizen Services", href: "/citizen-services" },
    { label: "Services to Government", href: "/services-to-government" },
    { label: "Initiatives & Projects", href: "/initiatives-projects" },
    { label: "Announcements", href: "/notifications/announcements" },
  ],
  ta: [
    { label: "குடிமக்கள் சேவைகள்", href: "/citizen-services" },
    { label: "அரசுக்கான சேவைகள்", href: "/services-to-government" },
    { label: "முயற்சிகள் & திட்டங்கள்", href: "/initiatives-projects" },
    { label: "அறிவிப்புகள்", href: "/notifications/announcements" },
  ],
} as const;

/** The 404 page's illustration: a browser window showing a soft "404" while
 * a magnifying glass gently searches it, with shield, document and
 * location badges floating around it for the e-governance feel. All
 * motion is CSS and switched off under prefers-reduced-motion. */
function ErrorIllustration({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 480 420" role="img" aria-label={label} className="h-auto w-full max-w-[480px]">
      <defs>
        <radialGradient id="nfGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-gradient-sky)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--color-gradient-mint)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nfNumber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d3f8f" />
          <stop offset="100%" stopColor="#5b8bd9" />
        </linearGradient>
        <filter id="nfShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#1d3f8f" floodOpacity="0.16" />
        </filter>
      </defs>

      <ellipse cx="240" cy="215" rx="228" ry="192" fill="url(#nfGlow)" />

      {/* Browser window */}
      <g className="nf-float" filter="url(#nfShadow)">
        <rect x="80" y="70" width="320" height="250" rx="18" fill="#fff" stroke="#d9e0ee" />
        <path d="M80 110V88a18 18 0 0 1 18-18h284a18 18 0 0 1 18 18v22Z" fill="#eef2f9" />
        <circle cx="104" cy="90" r="5" fill="#c3cde3" />
        <circle cx="122" cy="90" r="5" fill="#c3cde3" />
        <circle cx="140" cy="90" r="5" fill="#c3cde3" />
        <rect x="165" y="80" width="215" height="20" rx="10" fill="#fff" />
        <text x="178" y="94" fontSize="11" fill="#8a93a8">tnega.tn.gov.in/…</text>

        <text x="240" y="212" textAnchor="middle" fontSize="88" fontWeight="700" fill="url(#nfNumber)" letterSpacing="2">404</text>

        <rect x="150" y="238" width="180" height="8" rx="4" fill="#e3e8f3" className="nf-line" />
        <rect x="178" y="256" width="124" height="8" rx="4" fill="#e3e8f3" className="nf-line nf-line-b" />
        <rect x="205" y="274" width="70" height="8" rx="4" fill="#e3e8f3" className="nf-line nf-line-c" />

        {/* Magnifying glass, searching */}
        <g className="nf-search">
          <circle cx="292" cy="226" r="27" fill="#fff" fillOpacity="0.4" stroke="#1d3f8f" strokeWidth="5" />
          <path d="M278 214a15 15 0 0 1 12-6" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
          <line x1="311" y1="246" x2="334" y2="270" stroke="#1d3f8f" strokeWidth="8" strokeLinecap="round" />
        </g>
      </g>

      {/* Floating badges */}
      <g transform="translate(412 96)">
        <g className="nf-float nf-float-b">
        <circle r="26" fill="#fff" stroke="#d9e0ee" />
        <circle r="19" fill="var(--color-gradient-mint)" />
        <path d="M0-11 9-7v7c0 6-4 10-9 12-5-2-9-6-9-12v-7Z" fill="#fff" stroke="#1d3f8f" strokeWidth="2" strokeLinejoin="round" />
        <path d="m-4 0 3 3 6-6" stroke="#1d3f8f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </g>
      <g transform="translate(52 208)">
        <g className="nf-float nf-float-c">
        <circle r="24" fill="#fff" stroke="#d9e0ee" />
        <circle r="17" fill="var(--color-gradient-peach)" />
        <path d="M-7-10h9l7 7v13H-7Z" fill="#fff" stroke="#1d3f8f" strokeWidth="2" strokeLinejoin="round" />
        <path d="M-3 2h8M-3 6h8" stroke="#1d3f8f" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </g>
      <g transform="translate(420 322)">
        <g className="nf-float nf-float-d">
        <circle r="24" fill="#fff" stroke="#d9e0ee" />
        <circle r="17" fill="var(--color-gradient-lavender)" />
        <path d="M0 11C-7 3-8-1-8-4a8 8 0 0 1 16 0c0 3-1 7-8 15Z" fill="#fff" stroke="#1d3f8f" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="0" cy="-4" r="3" fill="#1d3f8f" />
        </g>
      </g>

      {/* Sparkles */}
      <circle cx="58" cy="96" r="4" fill="var(--color-gradient-sky)" className="nf-twinkle" />
      <circle cx="120" cy="352" r="5" fill="var(--color-gradient-mint)" className="nf-twinkle nf-twinkle-b" />
      <circle cx="372" cy="372" r="3.5" fill="var(--color-gradient-rose)" className="nf-twinkle nf-twinkle-c" />
    </svg>
  );
}

export async function NotFoundContent() {
  const locale = await getLocale();
  const copy = locale === "ta" ? COPY.ta : COPY.en;
  const links = locale === "ta" ? LINKS.ta : LINKS.en;

  return (
    <section className="relative overflow-hidden bg-canvas" id="main-content">
      <div
        aria-hidden
        className="orb-drift-a pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)", opacity: 0.5 }}
      />
      <div
        aria-hidden
        className="orb-drift-b pointer-events-none absolute -bottom-20 right-10 h-[360px] w-[360px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gradient-mint) 0%, transparent 70%)", opacity: 0.5 }}
      />

      <Container className="relative py-xxl md:py-section">
        <div className="grid items-center gap-xxl md:grid-cols-2">
          <div>
            <p className="type-caption-uppercase mb-md text-[var(--color-muted)]">{copy.eyebrow}</p>
            <h1 className="type-display-xl mb-lg text-ink">{copy.heading}</h1>
            <p className="type-body-md mb-xl max-w-[520px] text-[var(--color-body)]">{copy.lead}</p>

            <div className="mb-xl max-w-[520px] rounded-xl border border-hairline bg-surface-card p-lg">
              <p className="type-caption-uppercase mb-sm text-[var(--color-muted)]">{copy.whyTitle}</p>
              <ul role="list" className="flex flex-col gap-xs">
                {copy.reasons.map((r) => (
                  <li key={r} className="type-body-sm flex gap-sm text-[var(--color-body)]">
                    <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-blue)]" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-xl flex flex-wrap gap-3">
              <a href="/reach-us" className="type-button btn-outline">
                {copy.contact}
              </a>
              {/* Plain anchors on purpose: a full page load is the most reliable way out of an error page. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" className="type-button btn-primary">
                {copy.home}
              </a>
            </div>

            <p className="type-caption-uppercase mb-sm text-[var(--color-muted)]">{copy.jump}</p>
            <ul role="list" className="mb-lg flex flex-wrap gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="type-body-sm inline-flex rounded-pill border border-hairline-strong px-4 py-1.5 font-medium text-[var(--color-body-strong)] transition-colors hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="type-caption max-w-[520px] text-[var(--color-muted)]">{copy.note}</p>
          </div>

          <div className="flex items-center justify-center">
            <ErrorIllustration label={copy.graphicLabel} />
          </div>
        </div>
      </Container>
    </section>
  );
}
