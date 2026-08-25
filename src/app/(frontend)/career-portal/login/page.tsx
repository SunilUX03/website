import Image from "next/image";
import { CareerLoginForm } from "./CareerLoginForm";
import { getSiteIdentity } from "@/lib/cms/site-identity";
import { generateCaptcha } from "@/lib/captcha";

export default async function CareerPortalLoginPage() {
  const identity = await getSiteIdentity();
  const captcha = generateCaptcha();

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-soft px-6">
      <div className="w-full max-w-[400px] rounded-xl border border-hairline bg-surface-card p-xl">
        <div className="mb-6 flex items-center gap-3">
          {identity.emblemUrl ? (
            <Image src={identity.emblemUrl} width={identity.emblemWidth} height={identity.emblemHeight} alt="Government of Tamil Nadu emblem" className="h-11 w-auto" />
          ) : null}
          {identity.markUrl ? (
            <Image src={identity.markUrl} width={identity.markWidth} height={identity.markHeight} alt="" aria-hidden className="h-11 w-auto" />
          ) : null}
        </div>
        <h1 className="type-title-md mb-1 text-ink">TNeGA Career Portal</h1>
        <p className="type-body-sm mb-lg text-[var(--color-muted)]">
          Sign in to manage openings and applications.
        </p>

        <CareerLoginForm captcha={captcha} />
      </div>
    </div>
  );
}
