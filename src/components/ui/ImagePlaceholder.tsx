import clsx from "clsx";

const GRADIENTS: Record<string, string> = {
  mint: "var(--color-gradient-mint)",
  peach: "var(--color-gradient-peach)",
  lavender: "var(--color-gradient-lavender)",
  sky: "var(--color-gradient-sky)",
  rose: "var(--color-gradient-rose)",
};

interface ImagePlaceholderProps {
  label: string;
  gradient?: keyof typeof GRADIENTS;
  className?: string;
  aspect?: string;
  /** Where the "pending asset" label sits — "top" keeps it clear of a
   * bottom text-scrim overlay (e.g. Projects Spotlight, Gallery). */
  labelPosition?: "center" | "top";
}

/**
 * Stand-in for a pending real photo/logo asset. Renders a soft gradient
 * tile with a visible "PENDING ASSET" flag rather than a fabricated image,
 * per the brief's instruction to flag missing final content clearly.
 */
export function ImagePlaceholder({
  label,
  gradient = "sky",
  className,
  aspect = "aspect-[16/9]",
  labelPosition = "center",
}: ImagePlaceholderProps) {
  return (
    <div
      className={clsx(
        "relative flex overflow-hidden",
        labelPosition === "top" ? "items-start justify-center pt-8" : "items-center justify-center",
        aspect,
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${GRADIENTS[gradient]}33, var(--color-surface-strong))`,
      }}
    >
      <div className="absolute inset-0 border border-dashed border-[var(--color-hairline-strong)]" />
      <div className="relative flex flex-col items-center gap-1 px-4 text-center">
        <span className="type-caption-uppercase rounded-full bg-white/70 px-2 py-0.5 text-[var(--color-muted)]">
          Pending asset
        </span>
        <span className="type-body-sm text-[var(--color-muted)]">{label}</span>
      </div>
    </div>
  );
}
