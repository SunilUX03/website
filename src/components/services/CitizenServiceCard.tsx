import { PhotoTile } from "@/components/ui/PhotoTile";
import type { PillarLinkItem } from "@/lib/content";

export type CitizenServiceItem = PillarLinkItem & { image: string };

/** Deliberately minimal — per feedback, Citizen Services on /services is
 * now just these 2 external portals (e-Sevai, UMIS), each a plain
 * image + heading + description + CTA card. No stats, no detail page,
 * no "avail service" mechanics like the richer ServiceItemCard used on
 * the Initiatives & Projects tab — "thats it nothing else is required". */
export function CitizenServiceCard({ item }: { item: CitizenServiceItem }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-[0_10px_30px_rgba(12,10,9,0.06)]">
      <PhotoTile src={item.image} alt="" aspect="aspect-[16/9]" sizes="(min-width: 768px) 45vw, 90vw" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="type-title-md mb-2 text-ink">{item.name}</h3>
        <p className="type-body-sm mb-5 text-[var(--color-body)]">{item.description}</p>
        <a
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          className="type-button btn-primary mt-auto self-start"
        >
          Open {item.name}
        </a>
      </div>
    </div>
  );
}
