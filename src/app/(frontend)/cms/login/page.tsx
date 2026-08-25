import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession, login } from "@/lib/portal/auth";
import { PasswordField } from "@/components/ui/PasswordField";
import { CaptchaField } from "@/components/ui/CaptchaField";
import { getSiteIdentity } from "@/lib/cms/site-identity";
import { generateCaptcha, verifyCaptcha } from "@/lib/captcha";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getSession();
  if (user) redirect("/cms");
  const { error } = await searchParams;
  const identity = await getSiteIdentity();
  // Regenerated on every render — a failed submit redirects back here
  // (see loginAction below), which naturally issues a fresh question
  // rather than accepting a second guess against the same one.
  const captcha = generateCaptcha();

  async function loginAction(formData: FormData) {
    "use server";
    if (!verifyCaptcha(formData.get("captchaToken"), formData.get("captchaAnswer"))) {
      redirect(`/cms/login?error=${encodeURIComponent("That answer wasn't right — try the new question below.")}`);
    }
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
          {identity.emblemUrl ? (
            <Image src={identity.emblemUrl} width={identity.emblemWidth} height={identity.emblemHeight} alt="Government of Tamil Nadu emblem" className="h-11 w-auto" />
          ) : null}
          {identity.markUrl ? (
            <Image src={identity.markUrl} width={identity.markWidth} height={identity.markHeight} alt="" aria-hidden className="h-11 w-auto" />
          ) : null}
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
          <PasswordField id="password" name="password" autoComplete="current-password" />
          <CaptchaField
            question={captcha.question}
            token={captcha.token}
            inputClassName="w-full rounded-lg border border-hairline-strong bg-canvas px-3.5 py-2.5 text-ink outline-none focus:border-[var(--color-primary-blue)]"
            labelClassName="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]"
          />
          <button type="submit" className="type-button btn-primary mt-2 w-full justify-center">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
