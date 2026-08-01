export function MediaGraphic() {
  return (
      <svg
        className="h-auto w-full max-w-[440px]"
        viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft background blobs */}
      <ellipse cx="320" cy="100" rx="90" ry="60" fill="#a8c8e8" opacity="0.15"/>
      <ellipse cx="140" cy="290" rx="80" ry="55" fill="#a7e5d3" opacity="0.18"/>
      {/* Grid dots */}
      <g opacity="0.12">
      <circle cx="40"  cy="40"  r="2.5" fill="#292524"/>
      <circle cx="100" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="160" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="220" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="280" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="340" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="400" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="40"  cy="100" r="2.5" fill="#292524"/>
      <circle cx="100" cy="100" r="2.5" fill="#292524"/>
      <circle cx="160" cy="100" r="2.5" fill="#292524"/>
      <circle cx="280" cy="100" r="2.5" fill="#292524"/>
      <circle cx="340" cy="100" r="2.5" fill="#292524"/>
      <circle cx="400" cy="100" r="2.5" fill="#292524"/>
      <circle cx="40"  cy="160" r="2.5" fill="#292524"/>
      <circle cx="100" cy="160" r="2.5" fill="#292524"/>
      <circle cx="160" cy="160" r="2.5" fill="#292524"/>
      <circle cx="280" cy="160" r="2.5" fill="#292524"/>
      <circle cx="340" cy="160" r="2.5" fill="#292524"/>
      <circle cx="400" cy="160" r="2.5" fill="#292524"/>
      <circle cx="40"  cy="220" r="2.5" fill="#292524"/>
      <circle cx="100" cy="220" r="2.5" fill="#292524"/>
      <circle cx="340" cy="220" r="2.5" fill="#292524"/>
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
      {/* Main camera body */}
      <rect x="110" y="120" width="220" height="160" rx="18" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      {/* Camera grip bump */}
      <rect x="110" y="108" width="72" height="28" rx="10" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      {/* Lens ring outer */}
      <circle cx="220" cy="200" r="56" fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1.5"/>
      {/* Lens ring mid */}
      <circle cx="220" cy="200" r="42" fill="#f0efed" stroke="#d6d3d1" strokeWidth="1"/>
      {/* Lens inner */}
      <circle cx="220" cy="200" r="28" fill="#292524" opacity="0.9"/>
      {/* Lens highlight */}
      <circle cx="210" cy="190" r="8" fill="#ffffff" opacity="0.18"/>
      <circle cx="214" cy="194" r="4" fill="#ffffff" opacity="0.12"/>
      {/* Shutter button */}
      <circle cx="320" cy="140" r="10" fill="#f0efed" stroke="#d6d3d1" strokeWidth="1"/>
      {/* Flash indicator */}
      <rect x="128" y="138" width="24" height="14" rx="4" fill="#a8c8e8" opacity="0.8"/>
      {/* Mode dial */}
      <circle cx="320" cy="175" r="14" fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1"/>
      <line x1="320" y1="163" x2="320" y2="170" stroke="#777169" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Floating photo frame 1 (top right) */}
      <rect x="330" y="60" width="88" height="64" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.9"/>
      <rect x="330" y="60" width="88" height="40" rx="8" fill="#a8c8e8" opacity="0.35"/>
      <circle cx="345" cy="75" r="6" fill="#ffffff" opacity="0.6"/>
      <line x1="330" y1="110" x2="418" y2="110" stroke="#f0efed" strokeWidth="1"/>
      <rect x="338" y="115" width="48" height="4" rx="2" fill="#e7e5e4"/>
      {/* Floating photo frame 2 (bottom left) */}
      <rect x="22" y="240" width="76" height="56" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.9"/>
      <rect x="22" y="240" width="76" height="34" rx="8" fill="#a7e5d3" opacity="0.35"/>
      <circle cx="35" cy="253" r="5" fill="#ffffff" opacity="0.6"/>
      <rect x="30" y="283" width="40" height="4" rx="2" fill="#e7e5e4"/>
      {/* Video play badge */}
      <circle cx="370" cy="270" r="28" fill="#292524" opacity="0.88"/>
      <polygon points="364,260 364,280 382,270" fill="#ffffff"/>
      <circle cx="370" cy="270" r="28" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.15"/>
      {/* Connecting lines (decorative) */}
      <line x1="330" y1="90" x2="294" y2="150" stroke="#a8c8e8" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
      <line x1="80" y1="260" x2="110" y2="210" stroke="#a7e5d3" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
      <line x1="342" y1="270" x2="310" y2="245" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
      </svg>
  );
}
