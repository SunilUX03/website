import { ServiceItem } from "@/lib/services-content";
import { PhotoTile } from "@/components/ui/PhotoTile";

export function ServiceItemCard({ item, className }: { item: ServiceItem; className?: string }) {
  return (
    <div className={`card-feature group flex flex-col overflow-hidden !p-0 ${className ?? ""}`}>
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
        <p className="type-caption mt-4 text-[var(--color-muted)]">{item.stats}</p>

        <div className="mt-5 flex flex-wrap gap-3 pt-1">
          {item.accessPortalHref && (
            <a href={item.accessPortalHref} className="type-button btn-primary">
              Access Portal
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
