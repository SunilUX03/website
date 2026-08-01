export function CareersGraphic() {
  return (
      <svg
        className="h-auto w-full max-w-[440px]"
        viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Atmospheric blobs */}
      <ellipse cx="320" cy="80"  rx="110" ry="72" fill="#a7e5d3" opacity="0.15"/>
      <ellipse cx="130" cy="300" rx="90"  ry="60" fill="#f4c5a8" opacity="0.16"/>
      {/* Dot grid */}
      <g opacity="0.10">
      <circle cx="40"  cy="40"  r="2.5" fill="#292524"/>
      <circle cx="100" cy="40"  r="2.5" fill="#292524"/>
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
      <circle cx="160" cy="340" r="2.5" fill="#292524"/>
      <circle cx="280" cy="340" r="2.5" fill="#292524"/>
      <circle cx="400" cy="340" r="2.5" fill="#292524"/>
      </g>
      {/* Office / team scene */}
      {/* Background building */}
      <rect x="80" y="120" width="280" height="220" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      {/* Building header band */}
      <rect x="80" y="120" width="280" height="40" rx="8" fill="#f5f5f5"/>
      <rect x="80" y="148" width="280" height="12" fill="#f5f5f5"/>
      {/* Header dots (traffic light style) */}
      <circle cx="100" cy="140" r="5" fill="#f4c5a8"/>
      <circle cx="116" cy="140" r="5" fill="#fef3c7"/>
      <circle cx="132" cy="140" r="5" fill="#dcfce7"/>
      {/* Screen/monitor lines */}
      <rect x="100" y="180" width="240" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="100" y="192" width="180" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="100" y="204" width="210" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="100" y="216" width="160" height="4" rx="2" fill="#e7e5e4"/>
      {/* Divider */}
      <line x1="100" y1="232" x2="340" y2="232" stroke="#e7e5e4" strokeWidth="1"/>
      {/* Person 1 (left) */}
      <circle cx="130" cy="268" r="20" fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1"/>
      <circle cx="130" cy="262" r="9"  fill="#d6d3d1"/>
      <path d="M112 288 Q130 278 148 288" stroke="#d6d3d1" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Person 1 label */}
      <rect x="110" y="295" width="40" height="5" rx="2" fill="#a7e5d3" opacity="0.8"/>
      <rect x="116" y="304" width="28" height="4" rx="2" fill="#e7e5e4"/>
      {/* Person 2 (center) */}
      <circle cx="220" cy="268" r="20" fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1"/>
      <circle cx="220" cy="262" r="9"  fill="#d6d3d1"/>
      <path d="M202 288 Q220 278 238 288" stroke="#d6d3d1" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Person 2 badge */}
      <rect x="200" y="295" width="40" height="5" rx="2" fill="#f4c5a8" opacity="0.8"/>
      <rect x="206" y="304" width="28" height="4" rx="2" fill="#e7e5e4"/>
      {/* Person 3 (right) */}
      <circle cx="310" cy="268" r="20" fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1"/>
      <circle cx="310" cy="262" r="9"  fill="#d6d3d1"/>
      <path d="M292 288 Q310 278 328 288" stroke="#d6d3d1" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Person 3 badge */}
      <rect x="290" y="295" width="40" height="5" rx="2" fill="#c8b8e0" opacity="0.8"/>
      <rect x="296" y="304" width="28" height="4" rx="2" fill="#e7e5e4"/>
      {/* Floating metric card top right */}
      <rect x="328" y="48" width="96" height="60" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.96"/>
      <rect x="328" y="48" width="96" height="22" rx="8" fill="#dcfce7"/>
      <rect x="328" y="58" width="96" height="12" fill="#dcfce7"/>
      <rect x="340" y="53" width="52" height="5" rx="2" fill="#15803d" opacity="0.55"/>
      <rect x="340" y="82" width="40" height="10" rx="3" fill="#0c0a09"/>
      <rect x="356" y="85" width="16" height="4" rx="2" fill="#ffffff"/>
      {/* Floating stat card bottom left */}
      <rect x="16" y="220" width="56" height="56" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.96"/>
      <rect x="26" y="234" width="36" height="4" rx="2" fill="#a8a29e"/>
      <rect x="26" y="244" width="28" height="8" rx="2" fill="#0c0a09"/>
      <rect x="26" y="258" width="32" height="4" rx="2" fill="#e7e5e4"/>
      </svg>
  );
}
