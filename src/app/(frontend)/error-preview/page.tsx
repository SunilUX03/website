import { notFound } from "next/navigation";

const PAGES = [
  { title: "404 Page not found (a mistyped address)", href: "/this-page-does-not-exist" },
  { title: "404 Page not found (a broken link inside a section)", href: "/notifications/announcements/does-not-exist" },
  { title: "500 Something went wrong (with Try again)", href: "/error-preview/500" },
  { title: "Global crash page (the whole layout failed)", href: "/error-preview/crash" },
  { title: "Maintenance / 503", href: "/maintenance" },
];

// Development-only index of every public error page, so they can all be
// reviewed without having to break anything. Returns a 404 in production.
export default function ErrorPreviewIndex() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="mx-auto max-w-[640px] px-6 py-xxl">
      <h1 className="type-display-sm mb-sm text-ink">Error pages</h1>
      <p className="type-body-sm mb-lg text-[var(--color-muted)]">Development only. Not available on the live site.</p>
      <ul role="list" className="flex flex-col gap-sm">
        {PAGES.map((p) => (
          <li key={p.href}>
            <a href={p.href} className="type-body-md text-[var(--color-primary-blue)] hover:underline">
              {p.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
