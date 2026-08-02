import Image from "next/image";

interface LeadershipCardProps {
  name: string;
  title: string;
  photo: string;
  quote?: string | null;
}

// Both cards render at the same size/weight now — CM and Minister sitting
// side by side with one visibly larger and the other dimmed read as an
// unintended hierarchy rather than a design choice.
export function LeadershipCard({ name, title, photo, quote }: LeadershipCardProps) {
  return (
    <div className="card-feature flex w-full max-w-full shrink items-center gap-3 !p-3 sm:w-auto sm:min-w-[225px]">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
        <Image src={photo} alt={name} fill sizes="56px" className="object-cover" />
      </div>
      {/* min-w-0 lets the text column shrink inside a width-capped card so
          a long name truncates instead of pushing the card past the hero
          frame. Names/titles still prefer nowrap; truncate is the safety
          net at the narrowest widths. */}
      <div className="min-w-0">
        <p className="type-body-strong truncate text-ink">{name}</p>
        <p className="type-caption truncate text-[var(--color-muted)]">{title}</p>
        {quote && <p className="type-body-sm mt-1 max-w-[32ch] whitespace-normal text-[var(--color-body)]">&ldquo;{quote}&rdquo;</p>}
      </div>
    </div>
  );
}
