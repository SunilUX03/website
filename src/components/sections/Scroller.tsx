"use client";

import { useState } from "react";
import type { CmsAnnouncement } from "@/lib/cms/announcement-types";
import { useReducedMotion } from "@/lib/hooks";

function TickerItem({ item }: { item: CmsAnnouncement }) {
  return (
    <a
      href={item.href}
      className="type-body-sm shrink-0 whitespace-nowrap text-ink hover:text-[var(--color-primary-blue)]"
    >
      {item.heading}
    </a>
  );
}

export function Scroller({ items }: { items: CmsAnnouncement[] }) {
  const reducedMotion = useReducedMotion();
  const [userPaused, setUserPaused] = useState(false);
  const paused = reducedMotion || userPaused;

  if (items.length === 0) return null;
  const track = [...items, ...items];

  return (
    <div className="w-full border-b border-hairline bg-canvas-soft">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-4 px-6 py-2.5 md:px-10">
        <span className="type-caption-uppercase flex shrink-0 items-center gap-1.5 text-[var(--color-primary-blue)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary-blue)] opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-primary-blue)]" />
          </span>
          Live
        </span>

        <div
          className="relative flex-1 overflow-hidden"
          onMouseEnter={() => setUserPaused(true)}
          onMouseLeave={() => setUserPaused(false)}
        >
          <div
            className="flex w-max gap-10"
            style={{
              animation: "ticker-scroll 32s linear infinite",
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {track.map((item, i) => (
              <TickerItem key={i} item={item} />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--color-canvas-soft)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--color-canvas-soft)] to-transparent" />
        </div>

        <button
          type="button"
          onClick={() => setUserPaused((v) => !v)}
          aria-pressed={paused}
          aria-label={paused ? "Play announcement ticker" : "Pause announcement ticker"}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline-strong text-ink"
        >
          {paused ? (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <path d="M4 2.5v11l10-5.5-10-5.5Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <rect x="4" y="2.5" width="3" height="11" />
              <rect x="9" y="2.5" width="3" height="11" />
            </svg>
          )}
        </button>

        <a
          href="/notifications/announcements"
          className="type-body-sm shrink-0 whitespace-nowrap font-medium text-ink hover:text-[var(--color-primary-blue)]"
        >
          View all →
        </a>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
