/**
 * Hero graphic for /notifications/announcements.
 *
 * The other seven pages inherited their hero illustrations from the HTML
 * prototypes; there was no prototype for Announcements, so this one is
 * drawn to match the established idiom exactly — 440x380 viewBox, two
 * soft gradient blobs, a dot grid at low opacity, a white card stack with
 * #e7e5e4 hairlines and #f5f5f5 header bands, plus floating accent cards
 * and dashed connectors.
 */
export function AnnouncementsGraphic() {
  return (
    <svg
      className="h-auto w-full max-w-[440px]"
      viewBox="0 0 440 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Atmospheric blobs */}
      <ellipse cx="312" cy="82" rx="104" ry="68" fill="#c8b8e0" opacity="0.15" />
      <ellipse cx="140" cy="298" rx="86" ry="58" fill="#a7e5d3" opacity="0.16" />

      {/* Dot grid */}
      <g opacity="0.10">
        <circle cx="40" cy="40" r="2.5" fill="#292524" />
        <circle cx="100" cy="40" r="2.5" fill="#292524" />
        <circle cx="160" cy="40" r="2.5" fill="#292524" />
        <circle cx="400" cy="40" r="2.5" fill="#292524" />
        <circle cx="40" cy="100" r="2.5" fill="#292524" />
        <circle cx="400" cy="100" r="2.5" fill="#292524" />
        <circle cx="40" cy="160" r="2.5" fill="#292524" />
        <circle cx="400" cy="160" r="2.5" fill="#292524" />
        <circle cx="40" cy="220" r="2.5" fill="#292524" />
        <circle cx="400" cy="220" r="2.5" fill="#292524" />
        <circle cx="40" cy="280" r="2.5" fill="#292524" />
        <circle cx="400" cy="280" r="2.5" fill="#292524" />
        <circle cx="40" cy="340" r="2.5" fill="#292524" />
        <circle cx="160" cy="340" r="2.5" fill="#292524" />
        <circle cx="280" cy="340" r="2.5" fill="#292524" />
        <circle cx="400" cy="340" r="2.5" fill="#292524" />
      </g>

      {/* Main announcements panel */}
      <rect x="100" y="80" width="240" height="220" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" />

      {/* Header band */}
      <rect x="100" y="80" width="240" height="44" rx="8" fill="#f5f5f5" />
      <rect x="100" y="110" width="240" height="14" fill="#f5f5f5" />
      <rect x="120" y="97" width="88" height="6" rx="2" fill="#292524" opacity="0.7" />

      {/* Bell */}
      <circle cx="314" cy="102" r="14" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" />
      <path
        d="M314 95a5 5 0 0 0-5 5v4l-1.5 2h13l-1.5-2v-4a5 5 0 0 0-5-5z"
        fill="#c8b8e0"
        opacity="0.75"
      />
      <path d="M312 108a2 2 0 0 0 4 0" stroke="#a8a29e" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Row 1 — newest, accented */}
      <rect x="120" y="142" width="44" height="4" rx="2" fill="#a8a29e" />
      <rect x="120" y="153" width="152" height="6" rx="2" fill="#292524" opacity="0.65" />
      <rect x="120" y="167" width="118" height="4" rx="2" fill="#e7e5e4" />
      <rect x="284" y="140" width="36" height="14" rx="7" fill="#dcfce7" />
      <rect x="292" y="145" width="20" height="4" rx="2" fill="#15803d" opacity="0.55" />
      <line x1="120" y1="184" x2="320" y2="184" stroke="#f0efed" strokeWidth="1" />

      {/* Row 2 */}
      <rect x="120" y="196" width="40" height="4" rx="2" fill="#a8a29e" />
      <rect x="120" y="207" width="136" height="6" rx="2" fill="#292524" opacity="0.5" />
      <rect x="120" y="221" width="104" height="4" rx="2" fill="#e7e5e4" />
      <line x1="120" y1="238" x2="320" y2="238" stroke="#f0efed" strokeWidth="1" />

      {/* Row 3 */}
      <rect x="120" y="250" width="48" height="4" rx="2" fill="#a8a29e" />
      <rect x="120" y="261" width="144" height="6" rx="2" fill="#292524" opacity="0.4" />
      <rect x="120" y="275" width="96" height="4" rx="2" fill="#e7e5e4" />

      {/* Floating "new" card, top right */}
      <rect x="322" y="50" width="94" height="56" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.96" />
      <rect x="322" y="50" width="94" height="22" rx="8" fill="#ede9fe" />
      <rect x="322" y="60" width="94" height="12" fill="#ede9fe" />
      <rect x="332" y="55" width="52" height="5" rx="2" fill="#5b21b6" opacity="0.5" />
      <rect x="332" y="82" width="42" height="9" rx="3" fill="#0c0a09" />
      <rect x="332" y="96" width="62" height="4" rx="2" fill="#e7e5e4" />

      {/* Floating date card, bottom left */}
      <rect x="28" y="232" width="72" height="60" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.96" />
      <rect x="28" y="232" width="72" height="22" rx="8" fill="#f0fdf4" />
      <rect x="28" y="242" width="72" height="12" fill="#f0fdf4" />
      <rect x="38" y="236" width="36" height="5" rx="2" fill="#15803d" opacity="0.5" />
      <rect x="36" y="261" width="10" height="10" rx="2" fill="#f0efed" />
      <rect x="50" y="261" width="10" height="10" rx="2" fill="#292524" opacity="0.8" />
      <rect x="64" y="261" width="10" height="10" rx="2" fill="#f0efed" />
      <rect x="36" y="275" width="10" height="10" rx="2" fill="#f0efed" />
      <rect x="50" y="275" width="10" height="10" rx="2" fill="#f0efed" />
      <rect x="64" y="275" width="10" height="10" rx="2" fill="#f0efed" />

      {/* Connectors */}
      <line x1="100" y1="258" x2="86" y2="248" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="340" y1="106" x2="352" y2="106" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
}
