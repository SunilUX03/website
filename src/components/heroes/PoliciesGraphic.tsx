export function PoliciesGraphic() {
  return (
      <svg
        className="h-auto w-full max-w-[440px]"
        viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Atmospheric blobs */}
      <ellipse cx="310" cy="80"  rx="110" ry="72" fill="#a8c8e8" opacity="0.14"/>
      <ellipse cx="140" cy="300" rx="90"  ry="60" fill="#e8b8c4" opacity="0.16"/>
      {/* Dot grid */}
      <g opacity="0.10">
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
      <circle cx="400" cy="280" r="2.5" fill="#292524"/>
      <circle cx="40"  cy="340" r="2.5" fill="#292524"/>
      <circle cx="100" cy="340" r="2.5" fill="#292524"/>
      <circle cx="160" cy="340" r="2.5" fill="#292524"/>
      <circle cx="280" cy="340" r="2.5" fill="#292524"/>
      <circle cx="340" cy="340" r="2.5" fill="#292524"/>
      <circle cx="400" cy="340" r="2.5" fill="#292524"/>
      </g>
      {/* Main shield */}
      <path d="M220 52 L312 88 L312 196 C312 248 220 292 220 292 C220 292 128 248 128 196 L128 88 Z"
      fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      {/* Shield inner */}
      <path d="M220 72 L296 102 L296 192 C296 234 220 270 220 270 C220 270 144 234 144 192 L144 102 Z"
      fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1"/>
      {/* Shield emblem: checkmark circle */}
      <circle cx="220" cy="172" r="36" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      <circle cx="220" cy="172" r="28" fill="#f0fdf4"/>
      <polyline points="206,172 216,182 236,160" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Shield top ornament */}
      <rect x="208" y="110" width="24" height="5" rx="2" fill="#a8c8e8" opacity="0.7"/>
      <rect x="212" y="120" width="16" height="4" rx="2" fill="#d6d3d1"/>
      {/* Floating card: Cybersecurity */}
      <rect x="320" y="52" width="104" height="68" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.96"/>
      <rect x="320" y="52" width="104" height="24" rx="8" fill="#fce7f3"/>
      <rect x="320" y="64"  width="104" height="12" fill="#fce7f3"/>
      <rect x="332" y="58" width="56" height="5" rx="2" fill="#9d174d" opacity="0.55"/>
      <rect x="332" y="88" width="72" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="332" y="98" width="56" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="332" y="108" width="64" height="4" rx="2" fill="#e7e5e4"/>
      {/* Floating card: Data Policy */}
      <rect x="16" y="120" width="96" height="68" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.96"/>
      <rect x="16" y="120" width="96" height="24" rx="8" fill="#e0f2fe"/>
      <rect x="16" y="132"  width="96" height="12" fill="#e0f2fe"/>
      <rect x="28" y="126" width="48" height="5" rx="2" fill="#075985" opacity="0.55"/>
      <rect x="28" y="156" width="68" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="28" y="166" width="52" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="28" y="176" width="60" height="4" rx="2" fill="#e7e5e4"/>
      {/* Floating card: Standards */}
      <rect x="328" y="200" width="96" height="68" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.96"/>
      <rect x="328" y="200" width="96" height="24" rx="8" fill="#ede9fe"/>
      <rect x="328" y="212"  width="96" height="12" fill="#ede9fe"/>
      <rect x="340" y="206" width="60" height="5" rx="2" fill="#5b21b6" opacity="0.55"/>
      <rect x="340" y="236" width="68" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="340" y="246" width="52" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="340" y="256" width="60" height="4" rx="2" fill="#e7e5e4"/>
      {/* Connector lines */}
      <line x1="320" y1="86"  x2="312" y2="120" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="112" y1="154" x2="128" y2="154" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="312" y1="224" x2="328" y2="234" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2"/>
      {/* Small standards badges bottom */}
      <rect x="148" y="310" width="52" height="20" rx="10" fill="#f0fdf4" stroke="#86efac" strokeWidth="1"/>
      <rect x="208" y="310" width="64" height="20" rx="10" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="1"/>
      <rect x="280" y="310" width="56" height="20" rx="10" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1"/>
      <rect x="158" y="315" width="32" height="10" rx="2" fill="#15803d" opacity="0.3"/>
      <rect x="218" y="315" width="44" height="10" rx="2" fill="#9d174d" opacity="0.3"/>
      <rect x="290" y="315" width="36" height="10" rx="2" fill="#075985" opacity="0.3"/>
      </svg>
  );
}
