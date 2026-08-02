"use client";

import { useState } from "react";
import clsx from "clsx";

/**
 * ─────────────────────────────────────────────────────────────────────
 * NOTE — same situation as ApplicationForm.tsx: this validates on the
 * client and shows a success state, but doesn't submit anywhere yet.
 * Before this goes live, handleSubmit needs to POST to a real endpoint
 * (a Route Handler under src/app/api/, or a Server Action) and the
 * success panel should only render after that call resolves.
 * ─────────────────────────────────────────────────────────────────────
 */

type Errors = Partial<Record<"name" | "email" | "comments", string>>;

const inputBase =
  "h-11 w-full rounded-md border bg-surface-card px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-[var(--color-muted-soft)] focus:border-ink";

const SUBJECT_OPTIONS = ["Website", "A service or portal", "Content accuracy", "Other"];

export function FeedbackForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const comments = String(data.get("comments") ?? "").trim();

    if (!name) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address.";
    if (!comments) next.comments = "Please share your feedback.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO: send `data` to a real endpoint before showing success.
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
        <p className="type-title-md text-ink">Thank you for your feedback.</p>
        <p className="type-body-sm text-[var(--color-muted)]">We read every submission and will get back to you if a reply is needed.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Feedback form" className="flex flex-col gap-5 rounded-xl border border-hairline bg-surface-card p-6 md:p-8">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="type-caption-uppercase text-[var(--color-muted)]">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          aria-invalid={Boolean(errors.name)}
          className={clsx(inputBase, errors.name ? "border-[var(--color-error)]" : "border-hairline-strong")}
        />
        {errors.name && <p role="alert" className="type-caption text-[var(--color-error)]">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="type-caption-uppercase text-[var(--color-muted)]">
          Email address
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
          Subject
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
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="comments" className="type-caption-uppercase text-[var(--color-muted)]">
          Comments
        </label>
        <textarea
          id="comments"
          name="comments"
          rows={5}
          placeholder="Tell us what's on your mind"
          aria-invalid={Boolean(errors.comments)}
          className={clsx(
            "w-full rounded-md border bg-surface-card px-3.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-[var(--color-muted-soft)] focus:border-ink",
            errors.comments ? "border-[var(--color-error)]" : "border-hairline-strong"
          )}
        />
        {errors.comments && <p role="alert" className="type-caption text-[var(--color-error)]">{errors.comments}</p>}
      </div>

      <button type="submit" className="type-button btn-primary h-12 w-full text-base">
        Submit Feedback
      </button>
    </form>
  );
}
