import { ServiceItem } from "@/lib/services-content";
import { PhotoTile } from "@/components/ui/PhotoTile";

export function ServiceItemCard({ item, className }: { item: ServiceItem; className?: string }) {
  return (
    // card-hover-lift so the whole card responds on hover (shadow lift),
    // not just the image scaling — h-full so every card in a grid row
    // matches height regardless of description length; the CTA row below
    // uses mt-auto against that full height so buttons land in the same
    // place across a row instead of trailing right after a short/long
    // description.
    <div className={`card-feature card-hover-lift group flex h-full flex-col overflow-hidden !p-0 ${className ?? ""}`}>
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
        <p className="type-body-sm text-[var(--color-body)]">{item.description}</p>
        <p className="type-caption mt-4 font-semibold text-[var(--color-primary-blue)]">{item.stats}</p>

        <div className="mt-auto flex flex-wrap gap-3 pt-5">
          {item.accessPortalHref ? (
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
