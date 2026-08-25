"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getConsent,
  setConsent,
  acceptAllConsent,
  rejectAllConsent,
  onConsentChange,
  onOpenCookiePreferencesRequest,
  type ConsentState,
} from "@/lib/consent";
import { clearVisitorId } from "@/lib/analytics-client";
import type { Locale } from "@/lib/locale";

/** Off/On labelled switch, matching the pattern from the reference site
 * this was modelled on — clearer at a glance than a bare switch, since
 * the current state reads as a word, not just a color/position. */
function CookieToggle({
  on,
  disabled,
  onChange,
  isTa,
}: {
  on: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
  isTa: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className={`type-caption-uppercase ${!on ? "text-ink" : "text-[var(--color-muted)]"}`}>{isTa ? "ஆஃப்" : "Off"}</span>
      <label className={`relative inline-flex h-6 w-11 items-center ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}>
        <input
          type="checkbox"
          checked={on}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-hairline-strong transition-colors peer-checked:bg-[var(--color-primary-blue)]" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </label>
      <span className={`type-caption-uppercase ${on ? "text-ink" : "text-[var(--color-muted)]"}`}>{isTa ? "ஆன்" : "On"}</span>
    </div>
  );
}

function CookieCard({
  name,
  description,
  qualifier,
  bullets,
  toggle,
}: {
  name: string;
  description: string;
  qualifier?: string;
  bullets?: string[];
  toggle: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-hairline bg-canvas-soft p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div>
        <p className="type-body-sm font-semibold text-ink">{name}</p>
        <p className="type-caption mt-0.5 text-[var(--color-muted)]">{description}</p>
        {bullets ? (
          <ul className="type-caption mt-1.5 list-disc pl-4 text-[var(--color-muted)]">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        ) : null}
        {qualifier ? <p className="type-caption mt-1.5 italic text-[var(--color-muted)]">{qualifier}</p> : null}
      </div>
      {toggle}
    </div>
  );
}

/** Site-wide cookie consent banner — mounted once in the root layout,
 * hidden on the CMS/Career Portal admin areas (those aren't "visitors"
 * being tracked, they're staff already signed in). Shows until a choice
 * is recorded; a persistent "Cookie Preferences" link in the footer
 * (see FooterClient.tsx) reopens the same panel afterward so withdrawing
 * consent is exactly as easy as giving it. The expanded "manage" panel's
 * shape — named individual cookies with their own Off/On switch, plain-
 * language descriptions, itemized bullets for what an optional cookie
 * actually enables — follows a reference layout the site owner asked to
 * match, rather than this project's earlier two-broad-category version. */
export function CookieConsentBanner({ locale = "en" }: { locale?: Locale }) {
  const pathname = usePathname();
  const [state, setState] = useState<ConsentState | null>(null);
  const [managing, setManaging] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);

  useEffect(() => {
    const sync = () => setState(getConsent());
    sync();
    return onConsentChange(sync);
  }, []);

  function openManaging() {
    setAnalyticsChoice(getConsent().analytics);
    setManaging(true);
  }

  useEffect(() => onOpenCookiePreferencesRequest(openManaging), []);

  const isTa = locale === "ta";
  const isAdminArea = pathname?.startsWith("/cms") || pathname?.startsWith("/career-portal");

  if (isAdminArea || state === null) return null;
  if (state.decided && !managing) return null;

  function handleAccept() {
    acceptAllConsent();
    setManaging(false);
  }

  function handleReject() {
    rejectAllConsent();
    clearVisitorId();
    setManaging(false);
  }

  function handleSave() {
    setConsent({ functional: false, analytics: analyticsChoice });
    if (!analyticsChoice) clearVisitorId();
    setManaging(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] max-h-[85vh] overflow-y-auto border-t border-hairline bg-surface-card shadow-[0_-8px_30px_rgba(12,10,9,0.12)]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-6 py-5 md:px-10">
        {!managing ? (
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <p className="type-body-sm max-w-[640px] text-[var(--color-body)]">
              {isTa
                ? "இந்தத் தளத்தைப் பாதுகாப்பாகவும் சரியாகவும் இயக்க அத்தியாவசிய குக்கீகளைப் பயன்படுத்துகிறோம். நீங்கள் ஒப்புக்கொண்டால், அதை மேம்படுத்த உதவ அநாமதேய பகுப்பாய்வையும் பயன்படுத்துவோம்."
                : "We use essential cookies to keep this site secure and working properly. If you agree, we'll also use anonymous analytics to help improve it."}{" "}
              <Link href="/cookie-policy" className="font-semibold text-[var(--color-primary-blue)] hover:underline">
                {isTa ? "குக்கீக் கொள்கையைப் படிக்கவும்" : "Read our Cookie Policy"}
              </Link>
            </p>
            <div className="flex w-full shrink-0 flex-wrap items-center gap-2.5 md:w-auto">
              <button type="button" onClick={handleReject} className="type-button btn-outline !h-10 flex-1 !px-5 md:flex-none">
                {isTa ? "அனைத்தையும் நிராகரி" : "Reject All"}
              </button>
              <button
                type="button"
                onClick={openManaging}
                className="type-button !h-10 flex-1 !px-5 text-[var(--color-primary-blue)] underline underline-offset-2 md:flex-none md:no-underline md:hover:underline"
              >
                {isTa ? "விருப்பங்களை நிர்வகி" : "Manage Preferences"}
              </button>
              <button type="button" onClick={handleAccept} className="type-button btn-primary !h-10 flex-1 !px-5 md:flex-none">
                {isTa ? "அனைத்தையும் ஏற்று" : "Accept All"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <p className="type-title-sm text-ink">{isTa ? "குக்கீ அமைப்புகள்" : "Cookie Settings"}</p>
              <p className="type-body-sm mt-1 max-w-[680px] text-[var(--color-muted)]">
                {isTa
                  ? "உங்கள் உலாவல் அனுபவத்தை நீங்களே வடிவமைக்கலாம். நாங்கள் பயன்படுத்தும் குக்கீகள் பற்றிய விரிவான தகவல் இங்கே உள்ளது, \"அத்தியாவசியம்\" மற்றும் \"விருப்பமானது\" என வகைப்படுத்தப்பட்டுள்ளது. உங்கள் தனியுரிமை விருப்பத்திற்கு ஏற்ப தகவலறிந்த தேர்வுகளைச் செய்யுங்கள்."
                  : "Here's the power to shape your own browsing experience. Below is exactly what each cookie we use does, grouped as \"Essential\" and \"Optional\" — pick what feels right for you."}
              </p>
            </div>

            <div>
              <p className="type-caption-uppercase mb-2.5 text-[var(--color-muted)]">{isTa ? "அத்தியாவசிய குக்கீகள்" : "Essential Cookies"}</p>
              <div className="flex flex-col gap-3">
                <CookieCard
                  name={isTa ? "அமர்வு குக்கீ" : "Session Cookie"}
                  description={
                    isTa
                      ? "இது உங்கள் உள்நுழைவு அமர்வை நிர்வகிக்கிறது, நீங்கள் வெளியேறும்போது அல்லது தளத்தை விட்டு வெளியேறும்போது நீக்கப்படும்."
                      : "This cookie manages your login session and is removed the moment you sign out or leave the site."
                  }
                  qualifier={isTa ? "(தள செயல்பாட்டிற்கு அத்தியாவசியம்)" : "(Essential for site functionality)"}
                  toggle={<CookieToggle on disabled isTa={isTa} />}
                />
                <CookieCard
                  name={isTa ? "மொழி & அணுகல்தன்மை குக்கீ" : "Language & Accessibility Cookie"}
                  description={
                    isTa
                      ? "இது உங்கள் மொழி விருப்பத்தையும் அணுகல்தன்மை அமைப்புகளையும் நினைவில் வைத்திருக்கப் பயன்படுகிறது, அதனால் ஒவ்வொரு முறையும் அவற்றை மீண்டும் அமைக்க வேண்டியதில்லை."
                      : "This keeps your language choice and accessibility settings remembered, so you don't have to set them again on your next visit."
                  }
                  qualifier={isTa ? "(தள செயல்பாட்டிற்கு அத்தியாவசியம்)" : "(Essential for site functionality)"}
                  toggle={<CookieToggle on disabled isTa={isTa} />}
                />
              </div>
            </div>

            <div>
              <p className="type-caption-uppercase mb-2.5 text-[var(--color-muted)]">{isTa ? "விருப்பமான குக்கீகள்" : "Optional Cookies"}</p>
              <CookieCard
                name={isTa ? "பகுப்பாய்வு குக்கீ" : "Analytics Cookie"}
                description={
                  isTa
                    ? "இது உங்கள் விருப்பத்தின் அடிப்படையில் மட்டுமே இயங்கும், முழுமையாக அநாமதேயமானது. இது பின்வருவற்றை இயக்குகிறது:"
                    : "This optional cookie only runs if you allow it, and is fully anonymous. It enables things like:"
                }
                bullets={
                  isTa
                    ? [
                        "அநாமதேய வருகைகள் மற்றும் பக்க பார்வைகளைக் கணக்கிடுதல்.",
                        "எந்தப் பட்டன்கள் மற்றும் இணைப்புகள் அதிகம் பயன்படுத்தப்படுகின்றன என்பதைப் பார்த்தல்.",
                        "மக்கள் எந்த மொழி மற்றும் சாதனத்தைப் பயன்படுத்துகிறார்கள் என்பதைப் புரிந்துகொள்ளுதல்.",
                      ]
                    : [
                        "Counting anonymous visits and page views.",
                        "Seeing which buttons and links get used most.",
                        "Understanding which language and device people use.",
                      ]
                }
                toggle={<CookieToggle on={analyticsChoice} onChange={setAnalyticsChoice} isTa={isTa} />}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button type="button" onClick={handleReject} className="type-button btn-outline !h-10 !px-5">
                {isTa ? "அனைத்தையும் நிராகரி" : "Reject All"}
              </button>
              <button type="button" onClick={handleSave} className="type-button btn-primary !h-10 !px-5">
                {isTa ? "விருப்பங்களைச் சேமி" : "Save Preferences"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
