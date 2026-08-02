"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { roleOptions } from "@/lib/careers-content";

/**
 * ─────────────────────────────────────────────────────────────────────
 * NOTE — this form does not submit anywhere yet.
 *
 * The HTML prototype validated on the client and then swapped in a
 * "Thank you for applying" panel without ever sending the data. That
 * behaviour is reproduced here so nothing is lost in the port, but it
 * means an applicant currently sees a success message for an application
 * that was never received.
 *
 * Before this page goes live, `handleSubmit` needs to POST to a real
 * endpoint (a Route Handler under src/app/api/, or a Server Action) that
 * stores the resume and notifies HR — and the success panel should only
 * render after that call resolves.
 * ─────────────────────────────────────────────────────────────────────
 */

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

type Errors = Partial<
  Record<"fullName" | "email" | "phone" | "role" | "resume", string>
>;

function Field({
  label,
  htmlFor,
  error,
  helper,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  helper?: string;
  optional?: boolean;
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
            (Optional)
          </span>
        ) : null}
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

export function ApplicationForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};

    const fullName = String(data.get("fullName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const role = String(data.get("role") ?? "");
    const resume = fileRef.current?.files?.[0];

    if (!fullName) next.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (!phone) next.phone = "Please enter your phone number.";
    if (!role) next.role = "Please select a role.";

    if (!resume) {
      next.resume = "Please upload your resume (PDF only).";
    } else if (resume.type !== "application/pdf") {
      next.resume = "Resume must be a PDF file.";
    } else if (resume.size > MAX_RESUME_BYTES) {
      next.resume = "Resume must be 5MB or smaller.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO: send `data` to a real endpoint before showing success.
    setSubmitted(true);
  }

  return (
    <section className="py-xxl md:py-section" id="apply">
      <Container>
        <SectionHead
          heading="Apply Now"
          sub="Fill in your details below and we will get back to you."
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
                <p className="type-title-md text-ink">Thank you for applying.</p>
                <p className="type-body-sm text-[var(--color-muted)]">
                  We will be in touch soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Job application form"
                className="flex flex-col gap-lg"
              >
                <Field label="Full Name" htmlFor="fullName" error={errors.fullName}>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
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

                <Field label="Email Address" htmlFor="email" error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
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

                <Field label="Phone Number" htmlFor="phone" error={errors.phone}>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Enter your phone number"
                    aria-required
                    aria-invalid={Boolean(errors.phone)}
                    className={clsx(
                      inputBase,
                      errors.phone
                        ? "border-[var(--color-error)]"
                        : "border-hairline-strong"
                    )}
                  />
                </Field>

                <Field label="Role Applied For" htmlFor="role" error={errors.role}>
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
                    <option value="">Select a role</option>
                    {roleOptions.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Upload Resume"
                  htmlFor="resume"
                  error={errors.resume}
                  helper="PDF only. Maximum file size 5MB."
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
                        {fileName ?? "Choose PDF file…"}
                      </span>
                    </div>
                  </div>
                </Field>

                <Field label="Cover Letter" htmlFor="coverLetter" optional>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={4}
                    placeholder="Tell us why you want to work at TNeGA"
                    className="w-full rounded-md border border-hairline-strong bg-surface-card px-3.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-[var(--color-muted-soft)] focus:border-ink"
                  />
                </Field>

                <button
                  type="submit"
                  className="type-button btn-primary h-12 w-full text-base"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>

          <p className="type-body-sm mt-base text-center text-[var(--color-muted)]">
            By submitting this form you agree to our{" "}
            <a href="/privacy-policy" className="text-ink underline underline-offset-2">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms-of-use" className="text-ink underline underline-offset-2">
              Terms of Use
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
