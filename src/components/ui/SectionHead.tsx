import clsx from "clsx";

/**
 * The `.section__head` / `.section__heading` / `.section__sub` trio that
 * repeated across the source prototypes, expressed once against the
 * project's existing type scale.
 */
export function SectionHead({
  heading,
  sub,
  id,
  align = "left",
  className,
}: {
  heading: string;
  sub?: string;
  id?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "mb-xxl",
        align === "center" && "text-center",
        className
      )}
    >
      <h2 id={id} className="type-display-md mb-sm text-ink">
        {heading}
      </h2>
      {sub ? (
        <p
          className={clsx(
            "type-body-md text-[var(--color-muted)]",
            align === "center" && "mx-auto max-w-[60ch]"
          )}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}
