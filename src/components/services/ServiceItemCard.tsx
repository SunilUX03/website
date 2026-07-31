import { ServiceItem } from "@/lib/services-content";
import { PhotoTile } from "@/components/ui/PhotoTile";

export function ServiceItemCard({ item }: { item: ServiceItem }) {
  return (
    <div className="card-feature group flex h-full flex-col overflow-hidden !p-0">
      <div className="overflow-hidden">
        <PhotoTile
          src={item.image}
          alt={item.name}
          aspect="aspect-[4/3]"
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
