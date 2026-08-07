import Image from "next/image";
import clsx from "clsx";

interface PhotoTileProps {
  src: string;
  alt: string;
  className?: string;
  aspect?: string;
  /** Use "fill" (default) for cards where the wrapper controls sizing,
   * or "intrinsic" when the image should size itself (e.g. absolute-fill
   * full-bleed slabs already sized by their parent). */
  sizes?: string;
  priority?: boolean;
  /** "cover" (default) crops to fill the box — right for candid photos
   * where losing some edge is fine. Use "contain" (letterboxed, no crop)
   * for images where the whole frame matters, like a poster or a phone
   * screenshot with real content baked in edge to edge. */
  objectFit?: "cover" | "contain";
}

/**
 * Real photo tile — either a locally sourced asset or a stable seeded
 * picsum.photos placeholder — never a debug gray box. See content.ts for
 * which slots use real vs. seeded-placeholder imagery.
 */
export function PhotoTile({
  src,
  alt,
  className,
  aspect = "aspect-[16/9]",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  objectFit = "cover",
}: PhotoTileProps) {
  return (
    <div className={clsx("relative overflow-hidden", aspect, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={objectFit === "contain" ? "object-contain" : "object-cover"}
      />
    </div>
  );
}
