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
        "card-feature flex flex-1 items-center gap-3 !p-3",
        isPrimary ? "min-w-[240px]" : "min-w-[210px] opacity-95"
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
      <div className="min-w-0">
        <p
          className={clsx(
            "whitespace-nowrap text-ink",
            isPrimary ? "type-title-sm" : "type-body-strong"
          )}
        >
          {name}
        </p>
        <p className="type-caption text-[var(--color-muted)]">{title}</p>
        {quote && <p className="type-body-sm mt-1 text-[var(--color-body)]">&ldquo;{quote}&rdquo;</p>}
      </div>
    </div>
  );
}
