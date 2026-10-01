"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { trackConversion } from "@/lib/analytics-client";
import type { Locale } from "@/lib/locale";

export type ApplicationRole = { id: string; label: string };

// Kept under Vercel's ~4.5MB serverless request-body ceiling, since
// that's where this runs until handover — raise this once the app is
// self-hosted on a plain Node server, which has no such limit.
const MAX_RESUME_BYTES = 4 * 1024 * 1024;

// Indian 10-digit mobile numbers only — what the OTP gateway's "91" +
// 10-digit `to` format expects.
const PHONE_RE = /^[6-9]\d{9}$/;

type Errors = Partial<
  Record<"fullName" | "email" | "phone" | "role" | "resume", string>
>;

// The role list itself comes from a separate Prisma-backed HR system
// (db.jobRole), not the Payload CMS this localization work otherwise
// covers — no schema there to mark `localized`. Translating the known
// role labels here is a display-only lookup, it doesn't touch that
// database, so a role added later with no entry here just shows in
// English until this map is updated.
const ROLE_LABELS_TA: Record<string, string> = {
  "Project Manager, e-Governance": "திட்ட மேலாளர், மின்-ஆளுமை",
  "Data Analyst": "தரவு பகுப்பாய்வாளர்",
  "GIS Specialist": "GIS நிபுணர்",
  "AI / ML Engineer": "AI / ML பொறியாளர்",
  "Software Security Analyst": "மென்பொருள் பாதுகாப்பு பகுப்பாய்வாளர்",
};

function Field({
  label,
  htmlFor,
  error,
  helper,
  optional,
  optionalLabel,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  helper?: string;
  optional?: boolean;
  optionalLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-xs">
      <label
        htmlFor={htmlFor}
        className="type-caption-uppercase text-[var(--color-muted)]"
      >
        {label}
        {optional ? (
          <span className="ml-1 text-[10px] font-normal normal-case tracking-normal">
            ({optionalLabel ?? "Optional"})
          </span>
        ) : (
          <span className="ml-0.5 text-[var(--color-error)]" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {helper && !error ? (
        <p id={`${htmlFor}-helper`} className="text-xs text-[var(--color-muted)]">
          {helper}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-xs text-[var(--color-error)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputBase =
  "h-11 w-full rounded-md border bg-surface-card px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-[var(--color-muted-soft)] focus:border-ink";

export function ApplicationForm({
  roles,
  section,
  locale = "en",
}: {
  roles: ApplicationRole[];
  section: { heading: string; sub: string };
  locale?: Locale;
}) {
  const isTa = locale === "ta";
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [phoneValue, setPhoneValue] = useState("");
  const [otpStage, setOtpStage] = useState<"idle" | "sent" | "verified">("idle");
  const [otpCode, setOtpCode] = useState("");
  const [otpPendingToken, setOtpPendingToken] = useState<string | null>(null);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  function resetOtp() {
    setOtpStage("idle");
    setOtpPendingToken(null);
    setVerifiedToken(null);
    setOtpCode("");
    setOtpError(null);
    setCooldown(0);
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhoneValue(e.target.value);
    if (otpStage !== "idle") resetOtp();
  }

  async function handleSendOtp() {
    setOtpError(null);
    if (!PHONE_RE.test(phoneValue)) {
      setOtpError(isTa ? "சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்." : "Enter a valid 10-digit mobile number.");
      return;
    }
    setOtpSending(true);
    try {
      const res = await fetch("/api/careers/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneValue }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setOtpError(body?.error ?? (isTa ? "OTP அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்." : "Could not send OTP. Please try again."));
        return;
      }
      setOtpPendingToken(body.token);
      setOtpCode("");
      setOtpStage("sent");
      setCooldown(60);
    } catch {
      setOtpError(isTa ? "ஏதோ தவறு நடந்தது. உங்கள் இணைய இணைப்பைச் சரிபார்க்கவும்." : "Something went wrong. Please check your connection and try again.");
    } finally {
      setOtpSending(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otpPendingToken) return;
    setOtpError(null);
    setOtpVerifying(true);
    try {
      const res = await fetch("/api/careers/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneValue, otp: otpCode, token: otpPendingToken }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setOtpError(body?.error ?? (isTa ? "தவறான அல்லது காலாவதியான OTP." : "Incorrect or expired OTP."));
        return;
      }
      setVerifiedToken(body.verifiedToken);
      setOtpStage("verified");
    } catch {
      setOtpError(isTa ? "ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்." : "Something went wrong. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};

    const fullName = String(data.get("fullName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const role = String(data.get("role") ?? "");
    const resume = fileRef.current?.files?.[0];

    if (!fullName) next.fullName = isTa ? "தயவுசெய்து உங்கள் முழுப்பெயரை உள்ளிடவும்." : "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = isTa ? "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்." : "Please enter a valid email address.";
    if (!PHONE_RE.test(phoneValue)) {
      next.phone = isTa ? "சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்." : "Enter a valid 10-digit mobile number.";
    } else if (otpStage !== "verified" || !verifiedToken) {
      next.phone = isTa ? "OTP மூலம் உங்கள் தொலைபேசி எண்ணைச் சரிபார்க்கவும்." : "Please verify your phone number with the OTP.";
    }
    if (!role) next.role = isTa ? "தயவுசெய்து ஒரு பணியைத் தேர்ந்தெடுக்கவும்." : "Please select a role.";

    if (!resume) {
      next.resume = isTa ? "உங்கள் விண்ணப்பத்தை (PDF மட்டும்) பதிவேற்றவும்." : "Please upload your resume (PDF only).";
    } else if (resume.type !== "application/pdf") {
      next.resume = isTa ? "விண்ணப்பம் PDF கோப்பாக இருக்க வேண்டும்." : "Resume must be a PDF file.";
    } else if (resume.size > MAX_RESUME_BYTES) {
      next.resume = isTa ? "விண்ணப்பம் 4MB அல்லது அதற்கும் குறைவாக இருக்க வேண்டும்." : "Resume must be 4MB or smaller.";
    }

    setErrors(next);
    setSubmitError(null);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body: data });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setSubmitError(body?.error ?? (isTa ? "ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்." : "Something went wrong. Please try again."));
        return;
      }
      trackConversion("job_application_submitted");
      setSubmitted(true);
    } catch {
      setSubmitError(isTa ? "ஏதோ தவறு நடந்தது. உங்கள் இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்." : "Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-xxl md:py-section" id="apply">
      <Container>
        <SectionHead
          heading={section.heading}
          sub={section.sub}
          id="form-heading"
          align="center"
        />

        <div className="mx-auto w-full max-w-[640px]">
          <div className="rounded-xl border border-hairline bg-surface-card p-lg md:p-xl">
            {submitted ? (
              <div className="flex flex-col items-center gap-sm py-xl text-center" aria-live="polite">
                <div className="flex h-12 w-12 items-center justify-center rounded-pill bg-[#dcfce7]">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="h-6 w-6 fill-none stroke-[#15803d] stroke-2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="type-title-md text-ink">{isTa ? "விண்ணப்பித்ததற்கு நன்றி." : "Thank you for applying."}</p>
                <p className="type-body-sm text-[var(--color-muted)]">
                  {isTa ? "நாங்கள் விரைவில் தொடர்பு கொள்வோம்." : "We will be in touch soon."}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label={isTa ? "வேலை விண்ணப்பப் படிவம்" : "Job application form"}
                className="flex flex-col gap-lg"
              >
                <Field label={isTa ? "முழுப்பெயர்" : "Full Name"} htmlFor="fullName" error={errors.fullName}>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder={isTa ? "உங்கள் முழுப்பெயரை உள்ளிடவும்" : "Enter your full name"}
                    aria-required
                    aria-invalid={Boolean(errors.fullName)}
                    className={clsx(
                      inputBase,
                      errors.fullName
                        ? "border-[var(--color-error)]"
                        : "border-hairline-strong"
                    )}
                  />
                </Field>

                <Field label={isTa ? "மின்னஞ்சல் முகவரி" : "Email Address"} htmlFor="email" error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={isTa ? "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்" : "Enter your email address"}
                    aria-required
                    aria-invalid={Boolean(errors.email)}
                    className={clsx(
                      inputBase,
                      errors.email
                        ? "border-[var(--color-error)]"
                        : "border-hairline-strong"
                    )}
                  />
                </Field>

                <Field label={isTa ? "தொலைபேசி எண்" : "Phone Number"} htmlFor="phone" error={errors.phone}>
                  <input type="hidden" name="phoneVerifiedToken" value={verifiedToken ?? ""} />
                  <div className="flex gap-2">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phoneValue}
                      onChange={handlePhoneChange}
                      disabled={otpStage === "verified"}
                      placeholder={isTa ? "உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்" : "Enter your phone number"}
                      aria-required
                      aria-invalid={Boolean(errors.phone)}
                      className={clsx(
                        inputBase,
                        "flex-1 disabled:bg-canvas-soft disabled:text-[var(--color-muted)]",
                        errors.phone
                          ? "border-[var(--color-error)]"
                          : "border-hairline-strong"
                      )}
                    />
                    {otpStage === "verified" ? (
                      <button
                        type="button"
                        onClick={resetOtp}
                        className="type-button btn-outline h-11 shrink-0 px-4 text-sm"
                      >
                        {isTa ? "மாற்று" : "Change"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpSending || cooldown > 0 || !PHONE_RE.test(phoneValue)}
                        className="type-button btn-outline h-11 shrink-0 whitespace-nowrap px-4 text-sm disabled:opacity-60"
                      >
                        {otpSending
                          ? isTa ? "அனுப்புகிறது…" : "Sending…"
                          : cooldown > 0
                            ? isTa ? `${cooldown} வி.` : `Resend in ${cooldown}s`
                            : otpStage === "sent"
                              ? isTa ? "மீண்டும் அனுப்பு" : "Resend OTP"
                              : isTa ? "OTP அனுப்பவும்" : "Send OTP"}
                      </button>
                    )}
                  </div>

                  {otpStage === "verified" ? (
                    <p className="flex items-center gap-1 text-xs font-medium text-[#15803d]">
                      <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-none stroke-[#15803d] stroke-[2.5]">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {isTa ? "தொலைபேசி எண் சரிபார்க்கப்பட்டது" : "Phone number verified"}
                    </p>
                  ) : otpStage === "sent" ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder={isTa ? "6 இலக்க OTP" : "Enter 6-digit OTP"}
                        aria-label={isTa ? "OTP உள்ளிடவும்" : "Enter OTP"}
                        className={clsx(inputBase, "flex-1 border-hairline-strong tracking-widest")}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpVerifying || otpCode.length !== 6}
                        className="type-button btn-primary h-11 shrink-0 px-4 text-sm disabled:opacity-60"
                      >
                        {otpVerifying ? (isTa ? "சரிபார்க்கிறது…" : "Verifying…") : isTa ? "சரிபார்" : "Verify"}
                      </button>
                    </div>
                  ) : null}

                  {otpError ? (
                    <p role="alert" className="text-xs text-[var(--color-error)]">
                      {otpError}
                    </p>
                  ) : null}
                </Field>

                <Field label={isTa ? "விண்ணப்பிக்கும் பணி" : "Role Applied For"} htmlFor="role" error={errors.role}>
                  <select
                    id="role"
                    name="role"
                    defaultValue=""
                    aria-required
                    aria-invalid={Boolean(errors.role)}
                    className={clsx(
                      inputBase,
                      "cursor-pointer appearance-none bg-[right_12px_center] bg-no-repeat pr-9",
                      errors.role
                        ? "border-[var(--color-error)]"
                        : "border-hairline-strong"
                    )}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23777169' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                    }}
                  >
                    <option value="">{isTa ? "ஒரு பணியைத் தேர்ந்தெடுக்கவும்" : "Select a role"}</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {isTa ? ROLE_LABELS_TA[r.label] ?? r.label : r.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label={isTa ? "விண்ணப்பத்தை பதிவேற்றவும்" : "Upload Resume"}
                  htmlFor="resume"
                  error={errors.resume}
                  helper={isTa ? "PDF மட்டும். அதிகபட்ச கோப்பு அளவு 4MB." : "PDF only. Maximum file size 4MB."}
                >
                  <div className="relative">
                    <input
                      ref={fileRef}
                      id="resume"
                      name="resume"
                      type="file"
                      accept="application/pdf"
                      aria-required
                      aria-describedby="resume-helper"
                      onChange={(e) =>
                        setFileName(e.target.files?.[0]?.name ?? null)
                      }
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <div
                      aria-hidden
                      className={clsx(
                        "flex h-11 items-center gap-xs rounded-md border bg-surface-card px-3.5",
                        errors.resume
                          ? "border-[var(--color-error)]"
                          : "border-hairline-strong"
                      )}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 shrink-0 fill-none stroke-[var(--color-muted)] stroke-[1.5]"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span
                        className={clsx(
                          "truncate text-[15px]",
                          fileName ? "text-ink" : "text-[var(--color-muted-soft)]"
                        )}
                      >
                        {fileName ?? (isTa ? "PDF கோப்பைத் தேர்ந்தெடுக்கவும்…" : "Choose PDF file…")}
                      </span>
                    </div>
                  </div>
                </Field>

                <Field label={isTa ? "அட்டைக் கடிதம்" : "Cover Letter"} htmlFor="coverLetter" optional optionalLabel={isTa ? "விருப்பத்தேர்வு" : "Optional"}>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={4}
                    placeholder={isTa ? "TNeGA-வில் ஏன் பணிபுரிய விரும்புகிறீர்கள் என்று எங்களிடம் கூறுங்கள்" : "Tell us why you want to work at TNeGA"}
                    className="w-full rounded-md border border-hairline-strong bg-surface-card px-3.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-[var(--color-muted-soft)] focus:border-ink"
                  />
                </Field>

                {submitError ? (
                  <p role="alert" className="text-sm text-[var(--color-error)]">
                    {submitError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="type-button btn-primary h-12 w-full text-base disabled:opacity-60"
                >
                  {submitting ? (isTa ? "சமர்ப்பிக்கிறது…" : "Submitting…") : isTa ? "விண்ணப்பத்தைச் சமர்ப்பிக்கவும்" : "Submit Application"}
                </button>
              </form>
            )}
          </div>

          <p className="type-body-sm mt-base text-center text-[var(--color-muted)]">
            {isTa ? (
              <>
                இந்தப் படிவத்தைச் சமர்ப்பிப்பதன் மூலம் நீங்கள் எங்கள்{" "}
                <a href="/privacy-policy" className="text-ink underline underline-offset-2">
                  தனியுரிமைக் கொள்கை
                </a>{" "}
                மற்றும்{" "}
                <a href="/terms-of-use" className="text-ink underline underline-offset-2">
                  பயன்பாட்டு விதிமுறைகளை
                </a>{" "}
                ஏற்றுக்கொள்கிறீர்கள்.
              </>
            ) : (
              <>
                By submitting this form you agree to our{" "}
                <a href="/privacy-policy" className="text-ink underline underline-offset-2">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms-of-use" className="text-ink underline underline-offset-2">
                  Terms of Use
                </a>
                .
              </>
            )}
          </p>
        </div>
      </Container>
    </section>
  );
}
