import Link from "next/link";
import { ServiceItem } from "@/lib/services-content";
import { PhotoTile } from "@/components/ui/PhotoTile";

export function ServiceItemCard({
  item,
  className,
  compact = false,
}: {
  item: ServiceItem;
  className?: string;
  /** Clamps the description so cards keep a predictable height in
   * fixed-width contexts (Home's carousels), where descriptions range from
   * one line to five. The /services grids leave it off and show copy in
   * full. */
  compact?: boolean;
}) {
  return (
    // Whole-card hover — noticeably lifts (translateY + real shadow), not
    // just the image scaling inside it. card-hover-lift's own shadow was
    // too faint (0.04 alpha) to read as "the card" responding, so this
    // overrides it with a stronger, visible treatment. h-full so every
    // card in a grid row matches height regardless of description length;
    // the CTA row below uses mt-auto against that full height so buttons
    // land in the same place across a row instead of trailing right after
    // a short/long description.
    <div
      className={`card-feature group relative flex h-full flex-col overflow-hidden !p-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(12,10,9,0.14)] ${className ?? ""}`}
    >
      {/* Whole card is a "Know More" target — absolute + z-0 so it sits
          behind the CTA buttons below (they get their own z-10 stacking
          context to stay independently clickable) but above the plain
          image/text, which have no competing stacking of their own and so
          fall through to this by default CSS rules. */}
      <Link
        href={item.knowMoreHref}
        className="absolute inset-0 z-0"
        aria-label={`View details about ${item.name}`}
      />

      <div className="overflow-hidden">
        <PhotoTile
          src={item.image}
          alt={item.name}
          // 3:2 — close to the reused project images' native ratio (3:2 for
          // e-Sevai, 17:10 for the rest) so the same source images crop the
          // same way here as on Home's Spotlight, instead of the tighter
          // 4:3 crop this used before clipping their edges (QR codes, logos).
          aspect="aspect-[3/2]"
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="type-title-md mb-2 text-ink">{item.name}</h3>
        <p className={`type-body-sm text-[var(--color-body)] ${compact ? "line-clamp-3" : ""}`}>
          {item.description}
        </p>
        {/* Lighter than --color-primary-blue (#1d3f8f) on purpose — that
            read as too dark/heavy for a caption-sized line; this matches
            the mid-tone blue already used for the "sky" badge tint. */}
        <p className="type-caption mt-4 font-semibold" style={{ color: "#2f6fb0" }}>
          {item.real?.relatedCardStats ?? item.stats}
        </p>

        <div className="relative z-10 mt-auto flex flex-wrap justify-center gap-3 pt-5">
          {item.real?.comingSoon ? (
            <a href={item.knowMoreHref} className="type-button btn-primary">
              Coming Soon
            </a>
          ) : item.accessPortalHref ? (
            <a href={item.accessPortalHref} className="type-button btn-primary">
              Access Portal
            </a>
          ) : (
            // Service-type items (no direct self-service portal) route to
            // Reach Us to avail the service instead — every card now has
            // exactly 2 CTAs, matching the Project-type Access Portal pair.
            <a href="/reach-us" className="type-button btn-primary">
              Avail Service
            </a>
          )}
          <a href={item.knowMoreHref} className="type-button btn-outline">
            Know More
          </a>
        </div>
      </div>
    </div>
  );
}
