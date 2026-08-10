"use client";

/** Route-level error boundary for the whole CMS portal. Without this,
 * any uncaught error during a page render (e.g. an unwhitelisted image
 * host, a failed upload) fell through to Next.js's generic crash screen,
 * whose only recovery affordance is a full page reload — losing whatever
 * the admin was doing. `reset()` retries the failed render in place. */
export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="type-title-sm text-ink">Something went wrong</p>
      <p className="type-body max-w-md text-[var(--color-muted)]">
        {error.message || "This page hit an unexpected error."}
      </p>
      <button type="button" onClick={() => reset()} className="type-button btn-outline !h-9 !px-4">
        Try again
      </button>
    </div>
  );
}
