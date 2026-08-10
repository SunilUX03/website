"use client";

import { useRef, useState } from "react";
import Image from "next/image";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Single-image upload used for both the hero photo and each Product Tour
 * slot: the existing image (or an empty placeholder) with a "+" overlay
 * button that opens the file picker, a live preview of whatever was just
 * picked (before the form is even submitted), and a small confirmation
 * line so "I successfully chose a new photo" doesn't require guessing.
 * The actual upload only happens server-side on submit (see
 * lib/portal/upload.ts) — this component only ever emits a normal
 * `<input type="file" name={name}>` for the server action to read. */
export function ImageUploadField({
  name,
  currentUrl,
  idealSize,
  required = false,
  aspect = "h-32 w-52",
}: {
  name: string;
  currentUrl?: string;
  idealSize?: string;
  required?: boolean;
  /** Tailwind height/width classes for the preview box — defaults to a
   * 13:8-ish landscape box that suits both the hero photo and product
   * tour slots. */
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const displayUrl = previewUrl ?? currentUrl;

  return (
    <div className="flex flex-col gap-1.5">
      <div className={`group relative overflow-hidden rounded-lg border border-hairline bg-canvas-soft ${aspect}`}>
        {displayUrl ? (
          <Image src={displayUrl} alt="" fill unoptimized={Boolean(previewUrl)} className="object-cover" />
        ) : (
          <div className="type-caption flex h-full items-center justify-center text-[var(--color-muted)]">No photo yet</div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={displayUrl ? "Replace photo" : "Add photo"}
          title={displayUrl ? "Replace photo" : "Add photo"}
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-blue)] text-white shadow-[0_2px_8px_rgba(12,10,9,0.3)] transition-transform hover:scale-105"
        >
          <PlusIcon />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setPreviewUrl((old) => {
            if (old) URL.revokeObjectURL(old);
            return URL.createObjectURL(file);
          });
          setFileName(file.name);
        }}
      />

      {fileName ? (
        <p className="type-caption font-medium text-[var(--color-primary-blue)]">
          Selected &quot;{fileName}&quot; — will replace the current photo when you save.
        </p>
      ) : null}
      {idealSize ? <p className="type-caption text-[var(--color-muted)]">Ideal size: {idealSize}</p> : null}
      {required && !displayUrl ? <p className="type-caption text-[var(--color-error)]">Required</p> : null}
    </div>
  );
}
