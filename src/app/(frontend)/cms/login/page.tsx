import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession, login } from "@/lib/portal/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getSession();
  if (user) redirect("/cms");
  const { error } = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const result = await login(email, password);
    if ("error" in result) {
      redirect(`/cms/login?error=${encodeURIComponent(result.error)}`);
    }
    redirect("/cms");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-soft px-6">
      <div className="w-full max-w-[400px] rounded-2xl border border-hairline bg-surface-card p-8 shadow-[0_10px_30px_rgba(12,10,9,0.06)]">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/images/tn-emblem.png" alt="" width={44} height={46} />
          <div>
            <p className="type-title-sm text-ink">TNeGA Content Portal</p>
            <p className="type-caption text-[var(--color-muted)]">Sign in to manage site content</p>
          </div>
        </div>

        {error ? (
          <p className="type-body-sm mb-4 rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
            {error}
          </p>
        ) : null}

        <form action={loginAction} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3.5 py-2.5 text-ink outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label htmlFor="password" className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3.5 py-2.5 text-ink outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <button type="submit" className="type-button btn-primary mt-2 w-full justify-center">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
