"use client";

import { useState } from "react";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { CarouselImage } from "@/lib/service-detail-generator";

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
}: {
  images: CarouselImage[];
  /** Generated stock photos are landscape, so cover-cropping a wide
   * aspect works fine. Real submitted assets (a poster, a phone
   * screenshot) are usually portrait and have real content baked in edge
   * to edge — pass a taller aspect with objectFit="contain" for those so
   * nothing gets cropped off. */
  aspect?: string;
  objectFit?: "cover" | "contain";
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  return (
    <div className="relative overflow-hidden rounded-xl border border-hairline bg-canvas-soft">
      <PhotoTile src={images[index].src} alt={images[index].alt} aspect={aspect} objectFit={objectFit} sizes="100vw" />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-canvas/90 text-ink shadow-[0_4px_12px_rgba(12,10,9,0.16)] transition-colors hover:bg-canvas"
          >
            <ChevronIcon direction="left" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
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
  );
}
