"use client";

import { useState } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/locale";
import { submitFeedback } from "@/app/(frontend)/feedback/actions";
import { trackConversion } from "@/lib/analytics-client";

type Errors = Partial<Record<"name" | "email" | "comments", string>>;

const inputBase =
  "h-11 w-full rounded-md border bg-surface-card px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-[var(--color-muted-soft)] focus:border-ink";

const SUBJECT_OPTIONS = ["Website", "A service or portal", "Content accuracy", "Other"];
const SUBJECT_OPTIONS_TA: Record<string, string> = {
  Website: "இணையதளம்",
  "A service or portal": "ஒரு சேவை அல்லது போர்ட்டல்",
  "Content accuracy": "உள்ளடக்க துல்லியம்",
  Other: "பிற",
};

export function FeedbackForm({ locale = "en" }: { locale?: Locale }) {
  const isTa = locale === "ta";
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const comments = String(data.get("comments") ?? "").trim();

    if (!name) next.name = isTa ? "உங்கள் பெயரை உள்ளிடவும்." : "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = isTa ? "செல்லுபடியாகும் மின்னஞ்சல் முகவரியை உள்ளிடவும்." : "Please enter a valid email address.";
    if (!comments) next.comments = isTa ? "உங்கள் கருத்தைப் பகிரவும்." : "Please share your feedback.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    const result = await submitFeedback({ name, email, subject, comments, locale });
    setSubmitting(false);
    if (!result.ok) {
      setSubmitError(
        isTa
          ? "உங்கள் கருத்தை அனுப்ப முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்."
          : "We couldn't submit your feedback. Please try again."
      );
      return;
    }
    trackConversion("feedback_submitted");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-hairline bg-surface-card px-6 py-12 text-center" aria-live="polite">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dcfce7]">
          <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 fill-none stroke-[#15803d] stroke-2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="type-title-md text-ink">{isTa ? "உங்கள் கருத்துக்கு நன்றி." : "Thank you for your feedback."}</p>
        <p className="type-body-sm text-[var(--color-muted)]">
          {isTa
            ? "ஒவ்வொரு பதிவையும் நாங்கள் படிக்கிறோம், பதில் தேவைப்பட்டால் உங்களைத் தொடர்பு கொள்வோம்."
            : "We read every submission and will get back to you if a reply is needed."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={isTa ? "கருத்துப் படிவம்" : "Feedback form"}
      className="flex flex-col gap-5 rounded-xl border border-hairline bg-surface-card p-6 md:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="type-caption-uppercase text-[var(--color-muted)]">
          {isTa ? "பெயர்" : "Name"}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={isTa ? "உங்கள் முழுப்பெயர்" : "Your full name"}
          aria-invalid={Boolean(errors.name)}
          className={clsx(inputBase, errors.name ? "border-[var(--color-error)]" : "border-hairline-strong")}
        />
        {errors.name && <p role="alert" className="type-caption text-[var(--color-error)]">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="type-caption-uppercase text-[var(--color-muted)]">
          {isTa ? "மின்னஞ்சல் முகவரி" : "Email address"}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          className={clsx(inputBase, errors.email ? "border-[var(--color-error)]" : "border-hairline-strong")}
        />
        {errors.email && <p role="alert" className="type-caption text-[var(--color-error)]">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="type-caption-uppercase text-[var(--color-muted)]">
          {isTa ? "பொருள்" : "Subject"}
        </label>
        <select
          id="subject"
          name="subject"
          defaultValue={SUBJECT_OPTIONS[0]}
          className={clsx(inputBase, "cursor-pointer appearance-none border-hairline-strong bg-[right_12px_center] bg-no-repeat pr-9")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23777169' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          }}
        >
          {SUBJECT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {isTa ? SUBJECT_OPTIONS_TA[option] : option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="comments" className="type-caption-uppercase text-[var(--color-muted)]">
          {isTa ? "கருத்துகள்" : "Comments"}
        </label>
        <textarea
          id="comments"
          name="comments"
          rows={5}
          placeholder={isTa ? "உங்கள் மனதில் உள்ளதைச் சொல்லுங்கள்" : "Tell us what's on your mind"}
          aria-invalid={Boolean(errors.comments)}
          className={clsx(
            "w-full rounded-md border bg-surface-card px-3.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-[var(--color-muted-soft)] focus:border-ink",
            errors.comments ? "border-[var(--color-error)]" : "border-hairline-strong"
          )}
        />
        {errors.comments && <p role="alert" className="type-caption text-[var(--color-error)]">{errors.comments}</p>}
      </div>

      {submitError ? (
        <p role="alert" className="type-caption text-[var(--color-error)]">{submitError}</p>
      ) : null}

      <button type="submit" disabled={submitting} className="type-button btn-primary h-12 w-full text-base disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? (isTa ? "அனுப்புகிறது…" : "Submitting…") : isTa ? "கருத்தைச் சமர்ப்பிக்கவும்" : "Submit Feedback"}
      </button>
    </form>
  );
}
