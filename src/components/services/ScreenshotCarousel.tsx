"use client";

import { useState } from "react";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { CarouselImage } from "@/lib/service-detail-generator";
import type { Locale } from "@/lib/locale";

function ChevronIcon({ direction, className }: { direction: "left" | "right"; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScreenshotCarousel({
  images,
  aspect = "aspect-[16/8]",
  objectFit = "cover",
  locale = "en",
  showCaptions = false,
}: {
  images: CarouselImage[];
  /** Generated stock photos are landscape, so cover-cropping a wide
   * aspect works fine. Real submitted assets (a poster, a phone
   * screenshot) are usually portrait and have real content baked in edge
   * to edge — pass a taller aspect with objectFit="contain" for those so
   * nothing gets cropped off. */
  aspect?: string;
  objectFit?: "cover" | "contain";
  locale?: Locale;
  /** Shows each image's own `alt` text as a visible caption strip below
   * it — off by default, since generated stock photos carry a plain
   * filler alt ("X interface") not meant to be read as a caption. The
   * caller turns this on only for real, admin-uploaded photos, where the
   * "Describe this photo" field an editor fills in in the CMS is
   * otherwise invisible anywhere on the live site. */
  showCaptions?: boolean;
}) {
  const isTa = locale === "ta";
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);
  const currentAlt = images[index].alt;

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-canvas-soft">
      <div className="relative">
        <PhotoTile src={images[index].src} alt={currentAlt} aspect={aspect} objectFit={objectFit} sizes="100vw" />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={isTa ? "முந்தைய படம்" : "Previous image"}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-canvas/90 text-ink shadow-[0_4px_12px_rgba(12,10,9,0.16)] transition-colors hover:bg-canvas"
            >
              <ChevronIcon direction="left" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={isTa ? "அடுத்த படம்" : "Next image"}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-canvas/90 text-ink shadow-[0_4px_12px_rgba(12,10,9,0.16)] transition-colors hover:bg-canvas"
            >
              <ChevronIcon direction="right" className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((image, i) => (
                <span
                  key={image.src}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showCaptions && currentAlt ? (
        <p className="type-caption border-t border-hairline px-4 py-2.5 text-center text-[var(--color-muted)]">{currentAlt}</p>
      ) : null}
    </div>
  );
}
