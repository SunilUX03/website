export function GovernmentOrdersGraphic() {
  return (
      <svg
        className="h-auto w-full max-w-[440px]"
        viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft blobs */}
      <ellipse cx="305" cy="88"  rx="100" ry="64" fill="#a7e5d3" opacity="0.16"/>
      <ellipse cx="148" cy="292" rx="84"  ry="56" fill="#f4c5a8" opacity="0.18"/>
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
      {/* Main GO document */}
      <rect x="138" y="72" width="184" height="240" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      {/* Header band */}
      <rect x="138" y="72"  width="184" height="52" rx="8" fill="#f5f5f5"/>
      <rect x="138" y="108" width="184" height="16" fill="#f5f5f5"/>
      {/* Government emblem circle (Ashoka Chakra placeholder) */}
      <circle cx="220" cy="95" r="18" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      <circle cx="220" cy="95" r="13" fill="none" stroke="#d6d3d1" strokeWidth="1" strokeDasharray="2.5 2"/>
      <circle cx="220" cy="95" r="5"  fill="#292524" opacity="0.15"/>
      {/* Spokes */}
      <line x1="220" y1="84" x2="220" y2="106" stroke="#292524" strokeWidth="0.75" opacity="0.2"/>
      <line x1="209" y1="95" x2="231" y2="95"  stroke="#292524" strokeWidth="0.75" opacity="0.2"/>
      <line x1="212" y1="87" x2="228" y2="103" stroke="#292524" strokeWidth="0.75" opacity="0.2"/>
      <line x1="228" y1="87" x2="212" y2="103" stroke="#292524" strokeWidth="0.75" opacity="0.2"/>
      {/* GO header text lines */}
      <rect x="156" y="132" width="128" height="6" rx="2" fill="#292524" opacity="0.75"/>
      <rect x="170" y="144" width="100" height="5" rx="2" fill="#d6d3d1"/>
      {/* Divider */}
      <line x1="156" y1="158" x2="306" y2="158" stroke="#e7e5e4" strokeWidth="1"/>
      {/* Body lines */}
      <rect x="156" y="168" width="148" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="180" width="132" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="192" width="140" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="204" width="120" height="5" rx="2" fill="#e7e5e4"/>
      {/* Section label */}
      <rect x="156" y="220" width="64" height="5" rx="2" fill="#a7e5d3" opacity="0.8"/>
      {/* More body lines */}
      <rect x="156" y="232" width="148" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="244" width="136" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="256" width="144" height="5" rx="2" fill="#e7e5e4"/>
      {/* Divider */}
      <line x1="156" y1="272" x2="306" y2="272" stroke="#e7e5e4" strokeWidth="1"/>
      {/* Signature block */}
      <rect x="156" y="283" width="60" height="4" rx="2" fill="#d6d3d1"/>
      <rect x="156" y="293" width="80" height="4" rx="2" fill="#e7e5e4"/>
      {/* Official seal (bottom right) */}
      <circle cx="288" cy="291" r="18" fill="#f0fdf4" stroke="#a7e5d3" strokeWidth="1.5"/>
      <circle cx="288" cy="291" r="12" fill="none" stroke="#86efac" strokeWidth="1" strokeDasharray="2 2"/>
      <circle cx="288" cy="291" r="5"  fill="#16a34a" opacity="0.25"/>
      {/* Floating GO reference card (top right) */}
      <rect x="320" y="56" width="92" height="60" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.95"/>
      <rect x="320" y="56" width="92" height="22" rx="8" fill="#f0fdf4"/>
      <rect x="320" y="66" width="92" height="12" fill="#f0fdf4"/>
      <rect x="330" y="61" width="52" height="5"  rx="2" fill="#15803d" opacity="0.55"/>
      <rect x="330" y="88"  width="66" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="330" y="98"  width="50" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="330" y="108" width="58" height="4" rx="2" fill="#e7e5e4"/>
      {/* Floating date card (bottom left) */}
      <rect x="48" y="224" width="72" height="60" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.95"/>
      <rect x="48" y="224" width="72" height="22" rx="8" fill="#fff7ed"/>
      <rect x="48" y="234" width="72" height="12" fill="#fff7ed"/>
      <rect x="58" y="228" width="36" height="5"  rx="2" fill="#c2410c" opacity="0.5"/>
      {/* Date grid */}
      <rect x="56" y="253" width="10" height="10" rx="2" fill="#f0efed"/>
      <rect x="70" y="253" width="10" height="10" rx="2" fill="#f0efed"/>
      <rect x="84" y="253" width="10" height="10" rx="2" fill="#292524" opacity="0.8"/>
      <rect x="56" y="267" width="10" height="10" rx="2" fill="#f0efed"/>
      <rect x="70" y="267" width="10" height="10" rx="2" fill="#f0efed"/>
      <rect x="84" y="267" width="10" height="10" rx="2" fill="#f0efed"/>
      {/* Connector lines */}
      <line x1="120" y1="258" x2="138" y2="240" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="320" y1="86"  x2="322" y2="86"  stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2"/>
      </svg>
  );
}
