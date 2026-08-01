import type { BadgeTone, DocumentCell } from "./types";

/**
 * Tone palette carried over verbatim from the prototypes' badge rules
 * (.dept-badge--*, .cat-badge--*, .badge--*). These are intentionally
 * literal hex pairs rather than theme tokens: they're a categorical
 * colour scale for departments/categories/status, not brand colour.
 */
const TONE: Record<BadgeTone, string> = {
  sky: "bg-[#e0f2fe] text-[#075985]",
  amber: "bg-[#fef3c7] text-[#92400e]",
  pink: "bg-[#fce7f3] text-[#9d174d]",
  green: "bg-[#dcfce7] text-[#15803d]",
  violet: "bg-[#ede9fe] text-[#5b21b6]",
  lime: "bg-[#ecfccb] text-[#3f6212]",
  yellow: "bg-[#fef9c3] text-[#854d0e]",
  deepSky: "bg-[#e0f2fe] text-[#0c4a6e]",
  neutral: "bg-surface-strong text-[var(--color-muted)]",
  ink: "bg-ink text-[var(--color-on-primary)]",
};

export function Badge({ text, tone }: { text: string; tone: BadgeTone }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-[0.4px] ${TONE[tone]}`}
    >
      {text}
    </span>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-3.5 w-3.5 shrink-0 fill-none stroke-current stroke-[1.5]"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="12" x2="12" y2="18" />
      <polyline points="9 15 12 18 15 15" />
    </svg>
  );
}

export function DownloadLink({
  href,
  label,
  ariaLabel,
}: {
  href: string;
  label: string;
  ariaLabel: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className="type-body-sm inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border border-hairline-strong px-2.5 py-1.5 font-medium text-[var(--color-body-strong)] transition-colors hover:border-[var(--color-body-strong)] hover:bg-canvas hover:text-ink"
    >
      <FileIcon />
      {label}
    </a>
  );
}

/** Renders one <td> body according to the cell's kind. */
export function Cell({ cell }: { cell: DocumentCell }) {
  switch (cell.kind) {
    case "title":
      return (
        <span className="font-medium text-[var(--color-body-strong)]">
          {cell.text}
        </span>
      );
    case "ref":
      return (
        <span className="whitespace-nowrap text-xs tracking-[0.2px] text-[var(--color-muted)]">
          {cell.text}
        </span>
      );
    case "date":
      return (
        <span className="whitespace-nowrap text-[13px] text-[var(--color-body)]">
          {cell.text}
        </span>
      );
    case "badge":
      return <Badge text={cell.text} tone={cell.tone} />;
    case "download":
      return (
        <DownloadLink
          href={cell.href}
          label={cell.label}
          ariaLabel={cell.ariaLabel}
        />
      );
  }
}
