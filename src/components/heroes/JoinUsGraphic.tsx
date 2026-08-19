/** Same wireframe illustration language as the other hero/section
 * graphics (CitizenServicesGraphic, ServicesToGovernmentGraphic, ...) —
 * soft dot grid, two translucent blobs, a primary bordered card behind a
 * secondary one, a floating badge — re-themed around joining the team: a
 * profile/application card (avatar + role lines + an "Apply" button) and
 * an "Open Role" badge. Shown in JoinUs.tsx's right column only when
 * there are currently no listed openings, so that space isn't blank. */
export function JoinUsGraphic() {
  return (
    <svg
      className="h-auto w-full max-w-[360px]"
      viewBox="0 0 360 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blobs */}
      <ellipse cx="270" cy="80" rx="88" ry="60" fill="#a7e5d3" opacity="0.16" />
      <ellipse cx="90" cy="250" rx="80" ry="52" fill="#f3c8a0" opacity="0.16" />
      {/* Dot grid */}
      <g opacity="0.09">
        <circle cx="32" cy="32" r="2.5" fill="#292524" /><circle cx="90" cy="32" r="2.5" fill="#292524" />
        <circle cx="328" cy="32" r="2.5" fill="#292524" /><circle cx="32" cy="90" r="2.5" fill="#292524" />
        <circle cx="328" cy="90" r="2.5" fill="#292524" /><circle cx="32" cy="230" r="2.5" fill="#292524" />
        <circle cx="328" cy="230" r="2.5" fill="#292524" /><circle cx="32" cy="288" r="2.5" fill="#292524" />
        <circle cx="140" cy="288" r="2.5" fill="#292524" /><circle cx="328" cy="288" r="2.5" fill="#292524" />
      </g>
      {/* Secondary card (background) — team/org tile */}
      <rect x="34" y="110" width="120" height="88" rx="10" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.9" />
      <circle cx="60" cy="138" r="14" fill="#eefaf5" stroke="#a7e5d3" strokeWidth="1" />
      <circle cx="60" cy="134" r="4.5" fill="#a7e5d3" />
      <path d="M52 145c1.5-5 15-5 16 0" stroke="#a7e5d3" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <rect x="82" y="128" width="58" height="5" rx="2" fill="#292524" opacity="0.6" />
      <rect x="82" y="140" width="44" height="4" rx="2" fill="#d6d3d1" />
      <rect x="46" y="164" width="94" height="14" rx="7" fill="#eaf2fb" stroke="#a8c8e8" strokeWidth="1" />
      <rect x="56" y="169" width="52" height="4" rx="2" fill="#1d3f8f" opacity="0.7" />

      {/* Application/profile card (foreground) */}
      <rect x="128" y="46" width="150" height="228" rx="14" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" />
      {/* Avatar row */}
      <circle cx="156" cy="80" r="12" fill="#fdf0e2" stroke="#f3c8a0" strokeWidth="1" />
      <circle cx="156" cy="76" r="4" fill="#f3c8a0" />
      <path d="M147 88c2-6 16-6 18 0" stroke="#f3c8a0" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <rect x="178" y="73" width="66" height="5" rx="2" fill="#292524" opacity="0.65" />
      <rect x="178" y="84" width="44" height="4" rx="2" fill="#d6d3d1" />
      {/* Role tiles */}
      <rect x="146" y="106" width="114" height="4" rx="2" fill="#e7e5e4" />
      <rect x="146" y="106" width="66" height="4" rx="2" fill="#a7e5d3" opacity="0.85" />
      <rect x="146" y="118" width="114" height="4" rx="2" fill="#e7e5e4" />
      <rect x="146" y="130" width="88" height="4" rx="2" fill="#e7e5e4" />
      {/* Checklist rows (eligibility-style) */}
      <circle cx="150" cy="154" r="5" fill="none" stroke="#a8c8e8" strokeWidth="1.4" />
      <polyline points="147.5,154 149.5,156 153,151.5" stroke="#a8c8e8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="162" y="151" width="82" height="4" rx="2" fill="#d6d3d1" />
      <circle cx="150" cy="170" r="5" fill="none" stroke="#a8c8e8" strokeWidth="1.4" />
      <polyline points="147.5,170 149.5,172 153,167.5" stroke="#a8c8e8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="162" y="167" width="64" height="4" rx="2" fill="#d6d3d1" />
      {/* Apply button */}
      <rect x="146" y="230" width="114" height="26" rx="13" fill="#0c0a09" />
      <rect x="178" y="240" width="50" height="6" rx="3" fill="#ffffff" opacity="0.9" />

      {/* Floating "Open Role" badge */}
      <rect x="236" y="14" width="100" height="34" rx="17" fill="#0c0a09" />
      <path d="M254 24h12v6h-12z M258 24v-3a2 2 0 0 1 4 0v3" stroke="#ffffff" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <rect x="274" y="26" width="52" height="10" rx="3" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}
