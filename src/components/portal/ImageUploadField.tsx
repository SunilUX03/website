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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Vercel Functions hard-reject any request body over 4.5MB at the
// platform level (before the app even runs) — a form combining several
// of these fields (see ServiceForm's product tour) must stay well under
// that per file, so catch an oversized photo here instead of letting the
// submit silently 413.
const MAX_FILE_BYTES = 4 * 1024 * 1024;

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
  shape = "rounded",
}: {
  name: string;
  currentUrl?: string;
  idealSize?: string;
  required?: boolean;
  /** Tailwind height/width classes for the preview box — defaults to a
   * 13:8-ish landscape box that suits both the hero photo and product
   * tour slots. */
  aspect?: string;
  /** "circle" for a round avatar crop (team member / leader photos) —
   * kept as a separate prop rather than baked into `aspect` since the
   * corner-radius class needs to fully replace, not just append to, the
   * default rounded-lg. */
  shape?: "rounded" | "circle";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  // Tracks an explicit "remove" click, distinct from simply never having
  // picked a file — the server action needs to tell "admin didn't touch
  // this field" (keep whatever's saved) apart from "admin cleared it"
  // (null the field out), which a bare empty file input can't express on
  // its own. Reset to false the moment a new file is chosen, since
  // picking a replacement supersedes the removal.
  const [removed, setRemoved] = useState(false);

  const displayUrl = previewUrl ?? (removed ? null : currentUrl);

  return (
    <div className="flex flex-col gap-1.5">
      <div className={`group relative overflow-hidden ${shape === "circle" ? "rounded-full" : "rounded-lg"} border border-hairline bg-canvas-soft ${aspect}`}>
        {displayUrl ? (
          <Image src={displayUrl} alt="" fill unoptimized={Boolean(previewUrl)} className="object-cover" />
        ) : (
          <div className="type-caption flex h-full items-center justify-center text-[var(--color-muted)]">No photo yet</div>
        )}
        {displayUrl ? (
          <button
            type="button"
            onClick={() => {
              setPreviewUrl((old) => {
                if (old) URL.revokeObjectURL(old);
                return null;
              });
              setFileName(null);
              setSizeError(null);
              setRemoved(true);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label="Remove photo"
            title="Remove photo"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white shadow-[0_2px_8px_rgba(12,10,9,0.3)] transition-colors hover:bg-black/80"
          >
            <CloseIcon />
          </button>
        ) : null}
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
          if (file.size > MAX_FILE_BYTES) {
            setSizeError(`"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB — please choose a photo under ${MAX_FILE_BYTES / (1024 * 1024)}MB.`);
            e.target.value = "";
            return;
          }
          setSizeError(null);
          setRemoved(false);
          setPreviewUrl((old) => {
            if (old) URL.revokeObjectURL(old);
            return URL.createObjectURL(file);
          });
          setFileName(file.name);
        }}
      />
      {/* Read by the server action alongside the file input: a new file
          always wins, otherwise this tells it to null the field out
          instead of leaving the existing photo untouched. */}
      <input type="hidden" name={`${name}Removed`} value={removed && !previewUrl ? "1" : ""} />

      {fileName ? (
        <p className="type-caption font-medium text-[var(--color-primary-blue)]">
          Selected &quot;{fileName}&quot; — will replace the current photo when you save.
        </p>
      ) : removed ? (
        <p className="type-caption font-medium text-[var(--color-error)]">Photo will be removed when you save.</p>
      ) : null}
      {sizeError ? <p className="type-caption font-medium text-[var(--color-error)]">{sizeError}</p> : null}
      {idealSize ? <p className="type-caption text-[var(--color-muted)]">Ideal size: {idealSize}</p> : null}
      {required && !displayUrl ? <p className="type-caption text-[var(--color-error)]">Required</p> : null}
    </div>
  );
}
