"use client";

import { useState } from "react";

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden>
      <path
        d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden>
      <path
        d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Labeled password input with a show/hide toggle — used on both the
 * CMS login (a plain uncontrolled `name`-only input posted via a server
 * action) and the Career Portal login (a controlled input tied to React
 * state, since that form calls next-auth's `signIn()` in JS rather than
 * submitting natively) — pass `value`/`onChange` for the latter, omit
 * both for the former. Either way, toggling `visible` only changes how
 * the input renders; the underlying value/submission is unaffected. */
export function PasswordField({
  id,
  name,
  autoComplete,
  value,
  onChange,
  label = "Password",
  inputClassName = "w-full rounded-lg border border-hairline-strong bg-canvas px-3.5 py-2.5 pr-10 text-ink outline-none focus:border-[var(--color-primary-blue)]",
  labelClassName = "type-caption-uppercase mb-1.5 block text-[var(--color-muted)]",
}: {
  id: string;
  name?: string;
  autoComplete?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  /** Matches each login form's own input styling — the CMS and Career
   * Portal forms don't share a design system. */
  inputClassName?: string;
  labelClassName?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={inputClassName}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-[var(--color-muted)] hover:text-ink"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}
