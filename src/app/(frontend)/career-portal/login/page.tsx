"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await signIn("credentials", { email, password, redirect: false });

    if (!res || res.error) {
      setError("Incorrect email or password.");
      setSubmitting(false);
      return;
    }

    router.push(searchParams.get("from") || "/career-portal/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-soft px-6">
      <div className="w-full max-w-[400px] rounded-xl border border-hairline bg-surface-card p-xl">
        <h1 className="type-title-md mb-1 text-ink">TNeGA Career Portal</h1>
        <p className="type-body-sm mb-lg text-[var(--color-muted)]">
          Sign in to manage openings and applications.
        </p>

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

          <div className="flex flex-col gap-xs">
            <label htmlFor="password" className="type-caption-uppercase text-[var(--color-muted)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-md border border-hairline-strong bg-surface-card px-3.5 text-[15px] text-ink outline-none focus:border-ink"
            />
          </div>

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
      </div>
    </div>
  );
}

export default function CareerPortalLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
