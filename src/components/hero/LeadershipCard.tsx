interface LeadershipCardProps {
  name: string;
  title: string;
  quote?: string | null;
}

export function LeadershipCard({ name, title, quote }: LeadershipCardProps) {
  return (
    <div className="card-feature flex min-w-[220px] flex-1 flex-col gap-2 !p-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="voice-icon-circular h-10 w-10 shrink-0"
          title={`${name} (portrait pending)`}
        />
        <div className="min-w-0">
          <p className="type-title-sm text-ink">{name}</p>
          <p className="type-caption text-[var(--color-muted)]">{title}</p>
        </div>
      </div>
      {quote && <p className="type-body-sm text-[var(--color-body)]">&ldquo;{quote}&rdquo;</p>}
    </div>
  );
}
