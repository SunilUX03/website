"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { CaptchaField } from "@/components/ui/CaptchaField";
import { PasswordField } from "@/components/ui/PasswordField";
import type { Captcha } from "@/lib/captcha";

function LoginForm({ captcha }: { captcha: Captcha }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const captchaAnswer = String(new FormData(e.currentTarget).get("captchaAnswer") ?? "");
    const res = await signIn("credentials", {
      email,
      password,
      captchaToken: captcha.token,
      captchaAnswer,
      redirect: false,
    });

    if (!res || res.error) {
      setError("Incorrect email/password, or the captcha answer was wrong.");
      setSubmitting(false);
      // The submitted token is spent either way — router.refresh()
      // re-runs the server page and hands the still-mounted form a
      // fresh question via props, without losing what's already typed.
      router.refresh();
      return;
    }

    router.push(searchParams.get("from") || "/career-portal/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-base">
      <div className="flex flex-col gap-xs">
        <label htmlFor="email" className="type-caption-uppercase text-[var(--color-muted)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-md border border-hairline-strong bg-surface-card px-3.5 text-[15px] text-ink outline-none focus:border-ink"
        />
      </div>

      <PasswordField
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        labelClassName="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]"
        inputClassName="h-11 w-full rounded-md border border-hairline-strong bg-surface-card px-3.5 pr-10 text-[15px] text-ink outline-none focus:border-ink"
      />

      {/* Keyed on the token so a fresh challenge (after a failed
          attempt triggers router.refresh() above) remounts this input
          un-filled, instead of leaving a stale, now-wrong answer sitting
          in it. */}
      <CaptchaField key={captcha.token} question={captcha.question} token={captcha.token} />

      {error ? (
        <p role="alert" className="text-sm text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="type-button btn-primary mt-xs h-11 w-full disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export function CareerLoginForm({ captcha }: { captcha: Captcha }) {
  return (
    <Suspense fallback={null}>
      <LoginForm captcha={captcha} />
    </Suspense>
  );
}
