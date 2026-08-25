/** Small diagonal arrow marking a link that leaves the site (opens in a
 * new tab) — shown next to the gov.in link in AccessibilityBar and next
 * to any card CTA whose `externalLink` is set (e.g. CitizenServiceCard),
 * so it's visually obvious before the click that it's headed off-site. */
export function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
