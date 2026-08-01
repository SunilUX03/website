/**
 * About-page hero graphic.
 *
 * Restyled to match the notifications-page hero illustrations
 * (PublicationsGraphic et al.): 440x380 viewBox, two soft gradient blobs,
 * a faint dot grid, white cards with #e7e5e4 hairlines and pale header
 * bands, plus floating accent cards and dashed connectors. Themed for
 * "digital governance": a central TNeGA platform card wired to smaller
 * service cards, rather than the document/book motif the other pages use.
 *
 * Static (no animation) so it reads as clean and composed like the others.
 */
export function AboutHeroGraphic() {
  return (
    <svg
      className="h-auto w-full max-w-[440px]"
      viewBox="0 0 440 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of TNeGA's digital governance platform and connected services"
    >
      {/* Soft blobs */}
      <ellipse cx="300" cy="95" rx="95" ry="62" fill="#a8c8e8" opacity="0.18" />
      <ellipse cx="145" cy="290" rx="82" ry="56" fill="#c8b8e0" opacity="0.18" />

      {/* Dot grid */}
      <g opacity="0.11">
        <circle cx="40" cy="40" r="2.5" fill="#292524" />
        <circle cx="100" cy="40" r="2.5" fill="#292524" />
        <circle cx="160" cy="40" r="2.5" fill="#292524" />
        <circle cx="340" cy="40" r="2.5" fill="#292524" />
        <circle cx="400" cy="40" r="2.5" fill="#292524" />
        <circle cx="40" cy="100" r="2.5" fill="#292524" />
        <circle cx="400" cy="100" r="2.5" fill="#292524" />
        <circle cx="40" cy="160" r="2.5" fill="#292524" />
        <circle cx="400" cy="160" r="2.5" fill="#292524" />
        <circle cx="40" cy="220" r="2.5" fill="#292524" />
        <circle cx="400" cy="220" r="2.5" fill="#292524" />
        <circle cx="40" cy="280" r="2.5" fill="#292524" />
        <circle cx="100" cy="280" r="2.5" fill="#292524" />
        <circle cx="400" cy="280" r="2.5" fill="#292524" />
        <circle cx="40" cy="340" r="2.5" fill="#292524" />
        <circle cx="100" cy="340" r="2.5" fill="#292524" />
        <circle cx="160" cy="340" r="2.5" fill="#292524" />
        <circle cx="220" cy="340" r="2.5" fill="#292524" />
        <circle cx="280" cy="340" r="2.5" fill="#292524" />
        <circle cx="340" cy="340" r="2.5" fill="#292524" />
        <circle cx="400" cy="340" r="2.5" fill="#292524" />
      </g>

      {/* Dashed connectors from the hub to each service card (drawn first so
          cards sit on top of the lines) */}
      <g stroke="#cbd5e1" strokeWidth="1.3" strokeDasharray="4 3">
        <line x1="220" y1="150" x2="96" y2="96" />
        <line x1="260" y1="180" x2="360" y2="96" />
        <line x1="270" y1="215" x2="372" y2="232" />
        <line x1="200" y1="235" x2="96" y2="290" />
      </g>

      {/* Central TNeGA platform card */}
      <rect x="150" y="150" width="140" height="86" rx="10" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" />
      <rect x="150" y="150" width="140" height="30" rx="10" fill="#1d3f8f" />
      <rect x="150" y="168" width="140" height="12" fill="#1d3f8f" />
      <rect x="166" y="160" width="70" height="8" rx="3" fill="#ffffff" opacity="0.85" />
      {/* Body content lines */}
      <rect x="166" y="192" width="108" height="6" rx="2" fill="#e7e5e4" />
      <rect x="166" y="204" width="86" height="6" rx="2" fill="#e7e5e4" />
      <rect x="166" y="216" width="96" height="6" rx="2" fill="#a8c8e8" opacity="0.7" />

      {/* Service card — top left (e-Sevai) */}
      <rect x="52" y="60" width="88" height="66" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" />
      <rect x="52" y="60" width="88" height="22" rx="8" fill="#e0f2fe" />
      <rect x="52" y="74" width="88" height="8" fill="#e0f2fe" />
      <rect x="62" y="66" width="44" height="6" rx="2" fill="#075985" opacity="0.55" />
      <rect x="62" y="92" width="60" height="5" rx="2" fill="#e7e5e4" />
      <rect x="62" y="102" width="48" height="5" rx="2" fill="#e7e5e4" />
      <rect x="62" y="112" width="54" height="5" rx="2" fill="#e7e5e4" />

      {/* Service card — top right (GIS / maps) */}
      <rect x="316" y="60" width="88" height="66" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" />
      <rect x="316" y="60" width="88" height="22" rx="8" fill="#ede9fe" />
      <rect x="316" y="74" width="88" height="8" fill="#ede9fe" />
      <rect x="326" y="66" width="44" height="6" rx="2" fill="#5b21b6" opacity="0.5" />
      <rect x="326" y="92" width="60" height="5" rx="2" fill="#e7e5e4" />
      <rect x="326" y="102" width="46" height="5" rx="2" fill="#e7e5e4" />
      <rect x="326" y="112" width="52" height="5" rx="2" fill="#e7e5e4" />

      {/* Service card — bottom right (AI) */}
      <rect x="332" y="200" width="80" height="64" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" />
      <rect x="332" y="200" width="80" height="20" rx="8" fill="#e0f2fe" />
      <rect x="332" y="212" width="80" height="8" fill="#e0f2fe" />
      <rect x="342" y="205" width="40" height="6" rx="2" fill="#075985" opacity="0.5" />
      <rect x="342" y="230" width="54" height="5" rx="2" fill="#e7e5e4" />
      <rect x="342" y="240" width="44" height="5" rx="2" fill="#e7e5e4" />
      <rect x="342" y="250" width="50" height="5" rx="2" fill="#e7e5e4" />

      {/* Service card — bottom left (Cloud / data) */}
      <rect x="48" y="256" width="84" height="64" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" />
      <rect x="48" y="256" width="84" height="20" rx="8" fill="#ede9fe" />
      <rect x="48" y="268" width="84" height="8" fill="#ede9fe" />
      <rect x="58" y="261" width="42" height="6" rx="2" fill="#5b21b6" opacity="0.5" />
      <rect x="58" y="286" width="56" height="5" rx="2" fill="#e7e5e4" />
      <rect x="58" y="296" width="46" height="5" rx="2" fill="#e7e5e4" />
      <rect x="58" y="306" width="52" height="5" rx="2" fill="#e7e5e4" />

      {/* Small accent nodes on the hub corners */}
      <circle cx="150" cy="150" r="5" fill="#1d3f8f" />
      <circle cx="290" cy="236" r="5" fill="#a8c8e8" />
    </svg>
  );
}
