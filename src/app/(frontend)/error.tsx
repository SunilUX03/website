"use client";

import { ErrorPageLayout } from "@/components/errors/ErrorPageLayout";
import { ErrorTopBar } from "@/components/errors/ErrorTopBar";
import { useClientLocale } from "@/components/errors/useClientLocale";

const COPY = {
  en: {
    eyebrow: "Error 500",
    heading: "Something went wrong on our side",
    lead: "This isn't something you did. The website ran into a problem while loading this page. Please try again in a moment.",
    boxTitle: "What you can do",
    items: [
      "Try again. It often works on the second attempt.",
      "Go back to the home page and open the page again.",
      "If it keeps happening, contact us and tell us when it happened.",
    ],
    retry: "Try again",
    contact: "Contact us",
    home: "Go to Home",
    reference: "Reference code",
    label: "A browser window showing a 500 error while a gear turns unsteadily.",
  },
  ta: {
    eyebrow: "பிழை 500",
    heading: "எங்கள் பக்கத்தில் ஏதோ தவறு நேர்ந்துவிட்டது",
    lead: "இது நீங்கள் செய்த தவறு அல்ல. இந்தப் பக்கத்தை ஏற்றும்போது இணையதளத்தில் சிக்கல் ஏற்பட்டது. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.",
    boxTitle: "நீங்கள் என்ன செய்யலாம்",
    items: [
      "மீண்டும் முயற்சிக்கவும். இரண்டாவது முயற்சியில் பெரும்பாலும் சரியாகிவிடும்.",
      "முகப்புப் பக்கத்திற்குச் சென்று, பக்கத்தை மீண்டும் திறக்கவும்.",
      "தொடர்ந்து நடந்தால், எங்களை அணுகி, அது நடந்த நேரத்தைத் தெரிவிக்கவும்.",
    ],
    retry: "மீண்டும் முயற்சிக்கவும்",
    contact: "எங்களை அணுகவும்",
    home: "முகப்புக்குச் செல்லவும்",
    reference: "குறிப்பு எண்",
    label: "500 பிழையைக் காட்டும் உலாவி சாளரம்; ஒரு கியர் நிலையற்றுச் சுழல்கிறது.",
  },
} as const;

/** Public-site error boundary. Catches an error thrown while rendering any
 * public page, so visitors see a calm explanation and a retry instead of
 * Next.js's bare crash screen. Uses ErrorTopBar rather than the full nav
 * because the nav reads the CMS, which may be what failed. */
export default function PublicError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const locale = useClientLocale();
  const t = COPY[locale];

  return (
    <>
      <ErrorTopBar />
      <main className="flex-1">
        <ErrorPageLayout
          variant="500"
          eyebrow={t.eyebrow}
          heading={t.heading}
          lead={t.lead}
          boxTitle={t.boxTitle}
          boxItems={t.items}
          graphicLabel={t.label}
          actions={
            <>
              <button type="button" onClick={() => unstable_retry()} className="type-button btn-primary">
                {t.retry}
              </button>
              <a href="/reach-us" className="type-button btn-outline">
                {t.contact}
              </a>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" className="type-button btn-outline">
                {t.home}
              </a>
            </>
          }
          after={
            error.digest ? (
              <p className="type-caption text-[var(--color-muted)]">
                {t.reference}: <span className="font-mono">{error.digest}</span>
              </p>
            ) : null
          }
        />
      </main>
    </>
  );
}
