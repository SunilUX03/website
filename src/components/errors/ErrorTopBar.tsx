/** A slim header for error pages that can't use the full TopNav (error.tsx
 * is a Client Component and TopNav is an async server component that
 * reads the CMS, which may be exactly what's failing). Plain text, no data
 * fetching. */
export function ErrorTopBar() {
  return (
    <header className="border-b border-hairline bg-canvas">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-3 px-6 py-4 md:px-10">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="flex flex-col leading-tight">
          <span className="text-[15px] font-semibold text-[var(--color-primary-blue)]">தமிழ்நாடு மின்-ஆளுமை முகமை</span>
          <span className="text-[13px] font-medium text-[var(--color-body)]">Tamil Nadu e-Governance Agency</span>
        </a>
      </div>
    </header>
  );
}
