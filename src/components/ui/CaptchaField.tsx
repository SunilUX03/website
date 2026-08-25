/** Plain arithmetic challenge — used on both the CMS login and Career
 * Portal login forms (see src/lib/captcha.ts). No client interactivity
 * of its own, so this renders fine from either a Server Component page
 * or as a child of a "use client" form. */
export function CaptchaField({
  question,
  token,
  inputClassName = "h-11 w-full rounded-md border border-hairline-strong bg-surface-card px-3.5 text-[15px] text-ink outline-none focus:border-ink",
  labelClassName = "type-caption-uppercase text-[var(--color-muted)]",
}: {
  question: string;
  token: string;
  /** Matches each login form's own input styling — the two forms this
   * is used in don't share a design system (CMS uses bg-canvas/rounded-
   * lg, Career Portal uses bg-surface-card/rounded-md/h-11). */
  inputClassName?: string;
  labelClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-xs">
      <label htmlFor="captchaAnswer" className={labelClassName}>
        What is {question}?
      </label>
      <input type="hidden" name="captchaToken" value={token} />
      <input id="captchaAnswer" name="captchaAnswer" type="text" inputMode="numeric" autoComplete="off" required className={inputClassName} />
    </div>
  );
}
