"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type ToastState = { type: "success" | "error"; message: string } | null;

const AUTO_CLOSE_MS = 3000;

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
      <path d="M20 6 9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
      <path d="M12 8v5M12 16h.01" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M6 4.5v15l13-7.5-13-7.5Z" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Mounted once in the portal's shared layout — watches every page's own
 * `?saved=1` / `?error=<message>` redirect params (the existing pattern
 * every CMS form's server action already uses) and surfaces them as a
 * popup toast instead of a static inline banner, then strips the param
 * so a refresh or back-navigation doesn't re-trigger it. No changes
 * needed to any individual form or action to pick this up.
 *
 * Success toasts always auto-close after 3s. Error toasts also auto-close
 * after 3s by default, but hovering pauses the countdown (resuming on
 * mouse-leave), and a dedicated pause button gives keyboard/touch users
 * the same control without needing hover — once paused that way, only
 * the close button dismisses it. */
export function ToastListener() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<ToastState>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const saved = searchParams.get("saved");
    const error = searchParams.get("error");
    if (!saved && !error) return;

    setToast(error ? { type: "error", message: error } : { type: "success", message: "Saved." });
    setPaused(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("saved");
    params.delete("error");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!toast || paused) return;
    const timer = setTimeout(() => setToast(null), AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [toast, paused]);

  if (!toast) return null;
  const isError = toast.type === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[200] flex w-[min(380px,calc(100vw-3rem))] items-start gap-3 rounded-xl border px-4 py-3 shadow-[0_12px_32px_rgba(12,10,9,0.18)]"
      style={{
        borderColor: isError ? "var(--color-error)" : "#bbf7d0",
        background: isError ? "rgba(220,38,38,0.06)" : "#f0fdf4",
      }}
      onMouseEnter={() => isError && setPaused(true)}
      onMouseLeave={() => isError && setPaused(false)}
    >
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ background: isError ? "var(--color-error)" : "#15803d" }}
      >
        {isError ? <ErrorIcon /> : <CheckIcon />}
      </span>
      <p className="type-body-sm flex-1 font-medium" style={{ color: isError ? "var(--color-error)" : "#15803d" }}>
        {toast.message}
      </p>
      <div className="flex shrink-0 items-center gap-1">
        {isError ? (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume auto-close" : "Pause auto-close"}
            title={paused ? "Resume auto-close" : "Pause auto-close"}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-error)] hover:bg-black/5"
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setToast(null)}
          aria-label="Close"
          className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/5"
          style={{ color: isError ? "var(--color-error)" : "#15803d" }}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
