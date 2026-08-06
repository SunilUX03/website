import Image from "next/image";
import { pexelsPhoto, STOCK } from "@/lib/stock-photos";

/**
 * Hero background, replacing the district-map + node-graph treatment:
 * real, already-vetted site photography (citizens across Tamil Nadu using
 * digital services) framing the edges, a faint kolam-inspired dot lattice
 * for the "culture" layer (pure pattern, no photography), and a center
 * vignette so the collage reads at the margins without ever competing with
 * the hero statement it sits behind.
 */
const TILES = [
  {
    src: pexelsPhoto(STOCK.ruralWomanPhone, 320, 320),
    className: "left-[3%] top-[10%] lg:left-[7%]",
    size: 132,
    rotate: -6,
  },
  {
    src: pexelsPhoto(STOCK.studentLaptop, 340, 340),
    className: "right-[3%] top-[14%] lg:right-[8%]",
    size: 156,
    rotate: 5,
  },
  {
    src: pexelsPhoto(STOCK.womanPhone, 300, 300),
    className: "bottom-[14%] left-[6%] lg:left-[13%]",
    size: 118,
    rotate: 4,
  },
  {
    src: pexelsPhoto(STOCK.elderlyManPhone, 320, 320),
    className: "bottom-[10%] right-[5%] lg:right-[12%]",
    size: 142,
    rotate: -5,
  },
] as const;

export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]">
        <defs>
          <pattern id="hero-kolam-lattice" width="64" height="64" patternUnits="userSpaceOnUse">
            <circle cx="32" cy="32" r="2" fill="var(--color-primary-blue)" />
            <circle cx="0" cy="0" r="2" fill="var(--color-primary-blue)" />
            <circle cx="64" cy="0" r="2" fill="var(--color-primary-blue)" />
            <circle cx="0" cy="64" r="2" fill="var(--color-primary-blue)" />
            <circle cx="64" cy="64" r="2" fill="var(--color-primary-blue)" />
            <path
              d="M32 32 32 0 M32 32 0 32 M32 32 64 32 M32 32 32 64"
              stroke="var(--color-primary-blue)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M0 0 Q32 18 64 0 M0 64 Q32 46 64 64"
              stroke="var(--color-primary-blue)"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-kolam-lattice)" />
      </svg>

      {/* Hidden below md — at phone widths these would sit directly on top
          of the badge pill and CTA row rather than framing them, so the
          collage is a desktop/tablet embellishment only; the pattern +
          vignette below still carry the background on mobile. */}
      {TILES.map((tile) => (
        <div
          key={tile.src}
          className={`absolute hidden overflow-hidden rounded-2xl border border-white/60 opacity-60 shadow-[0_18px_40px_rgba(12,10,9,0.14)] md:block lg:opacity-90 ${tile.className}`}
          style={{ width: tile.size, height: tile.size, transform: `rotate(${tile.rotate}deg)` }}
        >
          <Image src={tile.src} alt="" fill sizes="160px" className="object-cover" />
        </div>
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 62% 58% at 50% 46%, var(--color-canvas) 0%, var(--color-canvas) 38%, rgba(245,245,245,0.85) 55%, transparent 78%)",
        }}
      />
    </div>
  );
}
