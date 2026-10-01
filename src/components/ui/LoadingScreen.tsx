/** Shared loading-state screen — wired in via loading.tsx at the site
 * root, /cms, and /career-portal, so Next.js shows this instead of a
 * blank tab during any slow navigation/data fetch in each of those three
 * areas. Pure CSS animation (conic-gradient ring + the same word-shine
 * sweep the Hero headline uses on its accent word) — no images, no data
 * fetching, so this never itself becomes the thing someone's waiting on.
 */
export function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 py-section">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, var(--color-gradient-sky) 15%, var(--color-primary-blue) 55%, #c026d3 85%, transparent 100%)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
            animation: "loading-ring-spin 1.1s linear infinite",
          }}
          aria-hidden
        />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="loading-word-shine type-title-sm font-semibold tracking-tight">TNeGA</p>
        <p className="type-caption text-[var(--color-muted)]">{label}</p>
      </div>
    </div>
  );
}
