import Link from "next/link";
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
    missing: "This page",
    nodes: { services: "Services", projects: "Projects", announcements: "Announcements", contact: "Contact" },
    graphicLabel: "Network of TNeGA services. One connection, to the page you asked for, is missing.",
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
    missing: "இந்தப் பக்கம்",
    nodes: { services: "சேவைகள்", projects: "திட்டங்கள்", announcements: "அறிவிப்புகள்", contact: "தொடர்பு" },
    graphicLabel: "TNeGA சேவைகளின் வலையமைப்பு. நீங்கள் கேட்ட பக்கத்திற்கான ஒரு இணைப்பு மட்டும் விடுபட்டுள்ளது.",
  },
} as const;

const LINKS = {
  en: [
    { label: "Services", href: "/services" },
    { label: "Initiatives & Projects", href: "/initiatives-projects" },
    { label: "Announcements", href: "/notifications/announcements" },
    { label: "Contact", href: "/reach-us" },
  ],
  ta: [
    { label: "சேவைகள்", href: "/services" },
    { label: "முயற்சிகள் & திட்டங்கள்", href: "/initiatives-projects" },
    { label: "அறிவிப்புகள்", href: "/notifications/announcements" },
    { label: "எங்களை அணுகவும்", href: "/reach-us" },
  ],
} as const;

/** The 404 page's illustration: TNeGA's connected services as a small
 * network, with the page the visitor asked for as the one node whose
 * connection is dashed and unlit. The packets flowing along the live links
 * (CSS, off under prefers-reduced-motion) make it read as "the system is
 * running fine, just not to this address". */
function ServiceNetwork({ copy }: { copy: (typeof COPY)[keyof typeof COPY] }) {
  const nodes = [
    { x: 95, y: 150, label: copy.nodes.services },
    { x: 385, y: 150, label: copy.nodes.projects },
    { x: 95, y: 330, label: copy.nodes.announcements },
    { x: 385, y: 330, label: copy.nodes.contact },
  ];
  return (
    <svg viewBox="0 0 480 420" role="img" aria-label={copy.graphicLabel} className="h-auto w-full max-w-[460px]">
      {nodes.map((n, i) => (
        <line
          key={`l${i}`}
          x1="240"
          y1="240"
          x2={n.x}
          y2={n.y}
          stroke="var(--color-primary-blue)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 9"
          className="nf-flow"
          style={{ animationDelay: `${i * -0.6}s` }}
        />
      ))}

      {/* The missing connection: dashed, unlit, ends before the node. */}
      <line x1="240" y1="240" x2="240" y2="96" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" opacity="0.55" />

      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          <circle cx={n.x} cy={n.y} r="30" fill="var(--color-canvas, #fff)" stroke="var(--color-primary-blue)" strokeWidth="2" />
          <circle cx={n.x} cy={n.y} r="7" fill="var(--color-primary-blue)" />
          <text x={n.x} y={n.y + 52} textAnchor="middle" fontSize="15" fontWeight="500" fill="var(--color-body-strong, #1c1917)">
            {n.label}
          </text>
        </g>
      ))}

      {/* Hub */}
      <circle cx="240" cy="240" r="46" fill="var(--color-primary-blue)" className="nf-hub" />
      <text x="240" y="247" textAnchor="middle" fontSize="20" fontWeight="600" fill="#fff" letterSpacing="1">
        TNeGA
      </text>

      {/* The page that isn't there */}
      <circle cx="240" cy="62" r="34" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeDasharray="4 6" opacity="0.7" className="nf-missing" />
      <text x="240" y="72" textAnchor="middle" fontSize="28" fontWeight="600" fill="var(--color-muted)">
        404
      </text>
      <text x="240" y="118" textAnchor="middle" fontSize="13" fill="var(--color-muted)">
        {copy.missing}
      </text>
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
              <Link href="/" className="type-button btn-primary">
                {copy.home}
              </Link>
              <Link href="/reach-us" className="type-button btn-outline">
                {copy.contact}
              </Link>
            </div>

            <p className="type-caption-uppercase mb-sm text-[var(--color-muted)]">{copy.jump}</p>
            <ul role="list" className="mb-lg flex flex-wrap gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="type-body-sm inline-flex rounded-pill border border-hairline-strong px-4 py-1.5 font-medium text-[var(--color-body-strong)] transition-colors hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="type-caption max-w-[520px] text-[var(--color-muted)]">{copy.note}</p>
          </div>

          <div className="flex items-center justify-center" aria-hidden={false}>
            <ServiceNetwork copy={copy} />
          </div>
        </div>
      </Container>
    </section>
  );
}
