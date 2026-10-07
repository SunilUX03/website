import { ErrorPageLayout } from "./ErrorPageLayout";
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

export async function NotFoundContent() {
  const locale = await getLocale();
  const copy = locale === "ta" ? COPY.ta : COPY.en;
  const links = locale === "ta" ? LINKS.ta : LINKS.en;

  return (
    <ErrorPageLayout
      variant="404"
      eyebrow={copy.eyebrow}
      heading={copy.heading}
      lead={copy.lead}
      boxTitle={copy.whyTitle}
      boxItems={copy.reasons}
      graphicLabel={copy.graphicLabel}
      actions={
        <>
          <a href="/reach-us" className="type-button btn-outline">
            {copy.contact}
          </a>
          {/* Plain anchors on purpose: a full page load is the most reliable way out of an error page. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="type-button btn-primary">
            {copy.home}
          </a>
        </>
      }
      after={
        <>
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
        </>
      }
    />
  );
}
