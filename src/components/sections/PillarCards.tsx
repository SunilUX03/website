import Link from "next/link";
import type { PillarLinkItem } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export type PillarCardData = {
  title: string;
  href: string;
  bannerImage: string | null;
  // Set on Services to Government and Initiatives & Projects (not Citizen
  // Services) — both link out to more than what's shown on the card:
  // the former to its own full page, the latter to /services, where its
  // item list is a deliberately trimmed subset of the full catalogue.
  seeAllLabel?: string;
};
type Pillar = PillarCardData;

function ItemRow({ item }: { item: PillarLinkItem }) {
  // Heading only, no per-item description — per feedback, the card
  // should read as a scannable list of project names. No `truncate` —
  // it was clipping "Software Development / Procurement" mid-word;
  // wrapping to 2 lines instead keeps the full name readable.
  const content = (
    <>
      <span className="type-body-strong min-w-0 text-ink">{item.name}</span>
      <span aria-hidden className="mt-0.5 shrink-0 text-[var(--color-muted)]">
        →
      </span>
    </>
  );
  const className = "flex items-start justify-between gap-3 py-3 first:pt-0";

  // External links (e-Sevai, UMIS) navigate straight to the destination
  // site rather than an internal detail page, so they're plain anchors,
  // not next/link — and open in a new tab, since this is a request for
  // just these two, not a site-wide default (an earlier global new-tab
  // mechanism was tried and reverted per feedback: it made every link
  // on the site open in a new tab, which was frustrating, not helpful).
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}

/** A pillar card: photo, heading, then its items listed directly —
 * no flip, no hover-to-reveal. All three cards stay the same size. */
function PillarCard({ pillar, items, bannerImage }: {
  pillar: Pillar;
  items: PillarLinkItem[];
  bannerImage: string | undefined;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-[0_10px_30px_rgba(12,10,9,0.06)]">
      {/* Natural aspect ratio, not a fixed 16:9 crop — these banner
          graphics each have their own baked-in heading text ("CITIZEN
          SERVICES", "SERVICES FOR GOVERNMENT"...) positioned differently
          within the source image, and a fixed crop box was slicing into
          that text on cards where it sits closer to an edge. */}
      {bannerImage && (
        <img src={bannerImage} alt="" loading="lazy" className="block h-auto w-full shrink-0" />
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="type-title-md mb-2 text-ink">{pillar.title}</h3>
        {/* Plain stacked block, not spread across the available height —
            an earlier justify-around pass (to avoid dead space under a
            short 2-item list) put visibly more air between Citizen
            Services' rows than the 4-item cards, so the three cards read
            as inconsistent with each other. Per feedback, matching item
            spacing across all three cards wins over filling that gap;
            any leftover height just sits quietly below the last row. */}
        <div className="divide-y divide-hairline">
          {items.map((item) => (
            <ItemRow key={item.name} item={item} />
          ))}
        </div>
        {pillar.seeAllLabel && (
          // mt-auto (not mt-3) — pins this to the bottom edge of the card
          // regardless of item count or this card's banner height, so it
          // lands on the same line across all three cards. Citizen
          // Services has no seeAllLabel yet, but the moment it gets one
          // this same mechanism lines it up with the other two too.
          <Link
            href={pillar.href}
            className="type-caption mt-auto shrink-0 border-t border-hairline pt-3 text-center font-semibold text-[var(--color-primary-blue)] underline-offset-4 hover:underline"
          >
            {pillar.seeAllLabel}
            <span aria-hidden>{" →"}</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export function PillarCards({ pillars, pillarItems }: { pillars: Pillar[]; pillarItems: PillarLinkItem[][] }) {
  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          Enabling Digital Governance
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-balance text-ink">
          How TNeGA powers governance across Tamil Nadu
        </h2>

        <div className="flex flex-col gap-4 md:flex-row">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.title} pillar={pillar} items={pillarItems[i]} bannerImage={pillar.bannerImage ?? undefined} />
          ))}
        </div>
      </Container>
    </section>
  );
}
