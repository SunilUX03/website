export function PublicationsGraphic() {
  return (
      <svg
        className="h-auto w-full max-w-[440px]"
        viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft blobs */}
      <ellipse cx="300" cy="95"  rx="95"  ry="62" fill="#c8b8e0" opacity="0.18"/>
      <ellipse cx="145" cy="290" rx="82"  ry="56" fill="#a8c8e8" opacity="0.18"/>
      {/* Dot grid */}
      <g opacity="0.11">
      <circle cx="40"  cy="40"  r="2.5" fill="#292524"/>
      <circle cx="100" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="160" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="340" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="400" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="40"  cy="100" r="2.5" fill="#292524"/>
      <circle cx="400" cy="100" r="2.5" fill="#292524"/>
      <circle cx="40"  cy="160" r="2.5" fill="#292524"/>
      <circle cx="400" cy="160" r="2.5" fill="#292524"/>
      <circle cx="40"  cy="220" r="2.5" fill="#292524"/>
      <circle cx="400" cy="220" r="2.5" fill="#292524"/>
      <circle cx="40"  cy="280" r="2.5" fill="#292524"/>
      <circle cx="100" cy="280" r="2.5" fill="#292524"/>
      <circle cx="400" cy="280" r="2.5" fill="#292524"/>
      <circle cx="40"  cy="340" r="2.5" fill="#292524"/>
      <circle cx="100" cy="340" r="2.5" fill="#292524"/>
      <circle cx="160" cy="340" r="2.5" fill="#292524"/>
      <circle cx="220" cy="340" r="2.5" fill="#292524"/>
      <circle cx="280" cy="340" r="2.5" fill="#292524"/>
      <circle cx="340" cy="340" r="2.5" fill="#292524"/>
      <circle cx="400" cy="340" r="2.5" fill="#292524"/>
      </g>
      {/* Book stack — back book */}
      <rect x="120" y="100" width="160" height="220" rx="6" fill="#ede9fe" stroke="#d8d0f5" strokeWidth="1.5"/>
      {/* Spine left */}
      <rect x="120" y="100" width="18" height="220" rx="6" fill="#c8b8e0"/>
      {/* Lines (back book pages) */}
      <rect x="148" y="120" width="120" height="6"  rx="2" fill="#d8d0f5"/>
      <rect x="148" y="134" width="96"  height="6"  rx="2" fill="#d8d0f5"/>
      <rect x="148" y="148" width="110" height="6"  rx="2" fill="#d8d0f5"/>
      {/* Book stack — front book */}
      <rect x="148" y="80" width="165" height="226" rx="6" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      {/* Spine left */}
      <rect x="148" y="80" width="18"  height="226" rx="6" fill="#a8c8e8"/>
      {/* Cover title band */}
      <rect x="148" y="80"  width="165" height="48" rx="6" fill="#f0f7ff"/>
      <rect x="148" y="112" width="165" height="16" fill="#f0f7ff"/>
      {/* Title lines on cover */}
      <rect x="174" y="92" width="80"  height="7" rx="2" fill="#075985" opacity="0.7"/>
      <rect x="174" y="106" width="56" height="5" rx="2" fill="#a8c8e8"/>
      {/* Body lines */}
      <rect x="174" y="142" width="128" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="174" y="154" width="104" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="174" y="166" width="118" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="174" y="178" width="90"  height="5" rx="2" fill="#e7e5e4"/>
      {/* Divider */}
      <line x1="174" y1="196" x2="300" y2="196" stroke="#f0efed" strokeWidth="1"/>
      <rect x="174" y="206" width="128" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="174" y="218" width="100" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="174" y="230" width="114" height="5" rx="2" fill="#e7e5e4"/>
      {/* Divider 2 */}
      <line x1="174" y1="248" x2="300" y2="248" stroke="#f0efed" strokeWidth="1"/>
      <rect x="174" y="258" width="80"  height="5" rx="2" fill="#d8d0f5" opacity="0.8"/>
      <rect x="174" y="270" width="60"  height="5" rx="2" fill="#e7e5e4"/>
      {/* Floating report card (top right) */}
      <rect x="316" y="58" width="94" height="74" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.95"/>
      <rect x="316" y="58" width="94" height="26" rx="8" fill="#ede9fe"/>
      <rect x="316" y="72" width="94" height="12" fill="#ede9fe"/>
      <rect x="326" y="64" width="48" height="6"  rx="2" fill="#5b21b6" opacity="0.5"/>
      <rect x="326" y="96"  width="64" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="326" y="107" width="50" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="326" y="118" width="58" height="5" rx="2" fill="#e7e5e4"/>
      {/* Floating small book (bottom left) */}
      <rect x="50" y="228" width="56" height="78" rx="5" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1" opacity="0.95"/>
      <rect x="50" y="228" width="10" height="78" rx="5" fill="#7dd3fc"/>
      <rect x="66" y="242" width="32" height="4"  rx="2" fill="#7dd3fc" opacity="0.7"/>
      <rect x="66" y="252" width="26" height="4"  rx="2" fill="#bae6fd"/>
      <rect x="66" y="262" width="30" height="4"  rx="2" fill="#bae6fd"/>
      <rect x="66" y="272" width="22" height="4"  rx="2" fill="#bae6fd"/>
      <rect x="66" y="285" width="28" height="4"  rx="2" fill="#bae6fd"/>
      {/* Bookmark ribbon */}
      <rect x="280" y="78" width="14" height="40" rx="0" fill="#c8b8e0" opacity="0.7"/>
      <polygon points="280,118 287,110 294,118" fill="#c8b8e0" opacity="0.7"/>
      {/* Connector lines */}
      <line x1="313" y1="95"  x2="313" y2="95"  stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="106" y1="264" x2="148" y2="240" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="313" y1="90"  x2="316" y2="90"  stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2"/>
      </svg>
  );
}
