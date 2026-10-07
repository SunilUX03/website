import type { Metadata } from "next";
import { ErrorPageLayout } from "@/components/errors/ErrorPageLayout";
import { ErrorTopBar } from "@/components/errors/ErrorTopBar";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Scheduled maintenance | TNeGA",
  robots: { index: false },
};

const COPY = {
  en: {
    eyebrow: "Scheduled maintenance",
    heading: "We'll be back shortly",
    lead: "We're making improvements to the TNeGA website, so it's temporarily unavailable. Nothing you did caused this.",
    boxTitle: "While you wait",
    items: [
      "Please check back in a short while.",
      "You don't need to do anything. This is a temporary notice.",
      "Refresh this page to see whether we're back.",
    ],
    check: "Check again",
    label: "A browser window with two gears turning and a progress bar filling.",
  },
  ta: {
    eyebrow: "திட்டமிடப்பட்ட பராமரிப்பு",
    heading: "விரைவில் மீண்டும் வருவோம்",
    lead: "TNeGA இணையதளத்தில் மேம்பாடுகளைச் செய்து வருகிறோம், எனவே இது தற்காலிகமாகக் கிடைக்கவில்லை. இதற்கு நீங்கள் காரணம் அல்ல.",
    boxTitle: "காத்திருக்கும்போது",
    items: [
      "சிறிது நேரம் கழித்து மீண்டும் பார்க்கவும்.",
      "நீங்கள் எதுவும் செய்ய வேண்டியதில்லை. இது ஒரு தற்காலிக அறிவிப்பு.",
      "நாங்கள் திரும்பி வந்துவிட்டோமா என்று பார்க்க இந்தப் பக்கத்தைப் புதுப்பிக்கவும்.",
    ],
    check: "மீண்டும் சரிபார்க்கவும்",
    label: "இரண்டு கியர்கள் சுழல, முன்னேற்றப் பட்டை நிரம்பும் உலாவி சாளரம்.",
  },
} as const;

// Shown (with a 503 status) by proxy.ts to every public page while
// MAINTENANCE_MODE=true. Deliberately uses no CMS data: maintenance is
// often exactly when the database is unavailable.
export default async function MaintenancePage() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <>
      <ErrorTopBar />
      <main className="flex-1">
        <ErrorPageLayout
          variant="503"
          eyebrow={t.eyebrow}
          heading={t.heading}
          lead={t.lead}
          boxTitle={t.boxTitle}
          boxItems={t.items}
          graphicLabel={t.label}
          actions={
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a href="/" className="type-button btn-primary">
              {t.check}
            </a>
          }
        />
      </main>
    </>
  );
}
