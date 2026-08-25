import { PhotoTile } from "@/components/ui/PhotoTile";
import { ExternalLinkIcon } from "@/components/ui/ExternalLinkIcon";
import type { CmsCitizenService } from "@/lib/cms/citizen-services";
import type { Locale } from "@/lib/locale";

/** Deliberately minimal — per feedback, Citizen Services cards are just
 * a photo + heading + description + CTA, no stats, no detail page, no
 * "avail service" mechanics like the richer ServiceItemCard used on the
 * Initiatives & Projects tab — "thats it nothing else is required". */
export function CitizenServiceCard({ item, locale = "en" }: { item: CmsCitizenService; locale?: Locale }) {
  const isTa = locale === "ta";
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-[0_10px_30px_rgba(12,10,9,0.06)]">
      <PhotoTile src={item.image} alt="" aspect="aspect-[16/9]" sizes="(min-width: 768px) 45vw, 90vw" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="type-title-md mb-2 text-ink">{item.name}</h3>
        <p className="type-body-sm mb-5 text-[var(--color-body)]">{item.description}</p>
        <a
          href={item.buttonHref}
          target={item.externalLink ? "_blank" : undefined}
          rel={item.externalLink ? "noopener noreferrer" : undefined}
          data-track={`citizen_service_${item.name}`}
          data-track-type="conversion"
          className="type-button btn-primary mt-auto inline-flex items-center gap-1.5 self-start"
        >
          {item.buttonLabel || (isTa ? `${item.name}-ஐத் திறக்கவும்` : `Open ${item.name}`)}
          {item.externalLink ? <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" /> : null}
        </a>
      </div>
    </div>
  );
}
