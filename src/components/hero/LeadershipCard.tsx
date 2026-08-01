import Image from "next/image";
import clsx from "clsx";

interface LeadershipCardProps {
  name: string;
  title: string;
  photo: string;
  quote?: string | null;
  role: "primary" | "secondary";
}

export function LeadershipCard({ name, title, photo, quote, role }: LeadershipCardProps) {
  const isPrimary = role === "primary";

  return (
    <div
      className={clsx(
        "card-feature flex w-full max-w-full shrink items-center gap-3 !p-3 sm:w-auto",
        isPrimary ? "sm:min-w-[240px]" : "opacity-95 sm:min-w-[210px]"
      )}
    >
      <div
        className={clsx(
          "relative shrink-0 overflow-hidden rounded-lg",
          isPrimary ? "h-16 w-16" : "h-12 w-12"
        )}
      >
        <Image src={photo} alt={name} fill sizes="64px" className="object-cover" />
      </div>
      {/* min-w-0 lets the text column shrink inside a width-capped card so
          a long name truncates instead of pushing the card past the hero
          frame. Names/titles still prefer nowrap; truncate is the safety
          net at the narrowest widths. */}
      <div className="min-w-0">
        <p
          className={clsx(
            "truncate text-ink",
            isPrimary ? "type-title-sm" : "type-body-strong"
          )}
        >
          {name}
        </p>
        <p className="type-caption truncate text-[var(--color-muted)]">{title}</p>
        {quote && <p className="type-body-sm mt-1 max-w-[32ch] whitespace-normal text-[var(--color-body)]">&ldquo;{quote}&rdquo;</p>}
      </div>
    </div>
  );
}
