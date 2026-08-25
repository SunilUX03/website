import Link from "next/link";
import type { Locale } from "@/lib/locale";

/** English/Tamil switch for a CMS edit page — each tab is a plain link to
 * the same page with `?locale=en` / `?locale=ta`, so switching re-fetches
 * the document server-side in that locale rather than juggling client
 * state. The page reads `locale` from its own searchParams, threads it
 * into the form's `values`, and the form's own hidden `locale` input
 * (see ServiceForm.tsx) tells the server action which locale to write
 * when saved — English and Tamil content live and save independently. */
export function LocaleTabs({ basePath, current }: { basePath: string; current: Locale }) {
  return (
    <div className="mb-6">
      <div className="inline-flex rounded-full border border-hairline-strong bg-canvas-soft p-1">
        {(
          [
            { value: "en" as const, label: "English" },
            { value: "ta" as const, label: "தமிழ்" },
          ]
        ).map((tab) => (
          <Link
            key={tab.value}
            href={`${basePath}?locale=${tab.value}`}
            className={`type-body-sm rounded-full px-4 py-1.5 font-semibold transition-colors ${
              current === tab.value
                ? "bg-[var(--color-primary-blue)] text-white"
                : "text-[var(--color-muted)] hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <p className="type-caption mt-2 text-[var(--color-muted)]">
        English and Tamil are saved separately — editing one does not translate or update the other. Remember to update both languages.
      </p>
    </div>
  );
}
