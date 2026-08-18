"use client";

import { useRef, useState } from "react";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" aria-hidden>
      <path d="M6 2h9l5 5v15H6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 2v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const MAX_FILE_BYTES = 4 * 1024 * 1024;

/** Single-PDF upload — same interaction shape as ImageUploadField (a "+"
 * button opens the file picker, a live "selected — will replace on save"
 * confirmation, a client-side size cap so an oversized file is caught
 * before submit rather than failing silently against Vercel's request
 * body limit) but for documents: shows a filename chip instead of an
 * image preview. */
export function DocumentUploadField({
  name,
  currentName,
  currentUrl,
}: {
  name: string;
  currentName?: string;
  currentUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const displayName = fileName ?? currentName;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3 rounded-lg border border-hairline bg-canvas-soft px-3 py-2.5">
        <DocIcon />
        <div className="min-w-0 flex-1">
          {displayName ? (
            currentUrl && !fileName ? (
              <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="type-body-sm truncate text-[var(--color-primary-blue)] hover:underline">
                {displayName}
              </a>
            ) : (
              <p className="type-body-sm truncate text-ink">{displayName}</p>
            )
          ) : (
            <p className="type-body-sm text-[var(--color-muted)]">No PDF yet</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={displayName ? "Replace PDF" : "Add PDF"}
          title={displayName ? "Replace PDF" : "Add PDF"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-blue)] text-white"
        >
          <PlusIcon />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > MAX_FILE_BYTES) {
            setSizeError(`"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB — please choose a PDF under ${MAX_FILE_BYTES / (1024 * 1024)}MB.`);
            e.target.value = "";
            return;
          }
          setSizeError(null);
          setFileName(file.name);
        }}
      />

      {fileName ? (
        <p className="type-caption font-medium text-[var(--color-primary-blue)]">
          Selected &quot;{fileName}&quot; — will replace the current PDF when you save.
        </p>
      ) : null}
      {sizeError ? <p className="type-caption font-medium text-[var(--color-error)]">{sizeError}</p> : null}
      <p className="type-caption text-[var(--color-muted)]">PDF only. Maximum file size 4MB.</p>
    </div>
  );
}
