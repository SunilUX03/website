export function RtiGraphic() {
  return (
      <svg
        className="h-auto w-full max-w-[440px]"
        viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blobs */}
      <ellipse cx="308" cy="76"  rx="108" ry="70" fill="#a8c8e8" opacity="0.14"/>
      <ellipse cx="144" cy="304" rx="88"  ry="58" fill="#c8b8e0" opacity="0.15"/>
      {/* Dot grid */}
      <g opacity="0.09">
      <circle cx="40"  cy="40"  r="2.5" fill="#292524"/><circle cx="100" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="160" cy="40"  r="2.5" fill="#292524"/><circle cx="340" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="400" cy="40"  r="2.5" fill="#292524"/><circle cx="40"  cy="100" r="2.5" fill="#292524"/>
      <circle cx="400" cy="100" r="2.5" fill="#292524"/><circle cx="40"  cy="160" r="2.5" fill="#292524"/>
      <circle cx="400" cy="160" r="2.5" fill="#292524"/><circle cx="40"  cy="220" r="2.5" fill="#292524"/>
      <circle cx="400" cy="220" r="2.5" fill="#292524"/><circle cx="40"  cy="280" r="2.5" fill="#292524"/>
      <circle cx="400" cy="280" r="2.5" fill="#292524"/><circle cx="40"  cy="340" r="2.5" fill="#292524"/>
      <circle cx="160" cy="340" r="2.5" fill="#292524"/><circle cx="280" cy="340" r="2.5" fill="#292524"/>
      <circle cx="400" cy="340" r="2.5" fill="#292524"/>
      </g>
      {/* Main legal document */}
      <rect x="136" y="56" width="168" height="228" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      {/* Doc header stripe */}
      <rect x="136" y="56"  width="168" height="44" rx="8" fill="#f5f5f5"/>
      <rect x="136" y="88"  width="168" height="12"       fill="#f5f5f5"/>
      {/* Government seal placeholder */}
      <circle cx="220" cy="78" r="16" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      <circle cx="220" cy="78" r="11" fill="none" stroke="#d6d3d1" strokeWidth="1" strokeDasharray="2 2"/>
      <circle cx="220" cy="78" r="4"  fill="#292524" opacity="0.12"/>
      {/* Spokes */}
      <line x1="220" y1="69" x2="220" y2="87" stroke="#292524" strokeWidth="0.7" opacity="0.18"/>
      <line x1="211" y1="78" x2="229" y2="78" stroke="#292524" strokeWidth="0.7" opacity="0.18"/>
      <line x1="213" y1="71" x2="227" y2="85" stroke="#292524" strokeWidth="0.7" opacity="0.18"/>
      <line x1="227" y1="71" x2="213" y2="85" stroke="#292524" strokeWidth="0.7" opacity="0.18"/>
      {/* Title line */}
      <rect x="156" y="108" width="128" height="6" rx="2" fill="#292524" opacity="0.7"/>
      <rect x="172" y="120" width="96"  height="4" rx="2" fill="#d6d3d1"/>
      {/* Divider */}
      <line x1="156" y1="134" x2="288" y2="134" stroke="#e7e5e4" strokeWidth="1"/>
      {/* Body lines */}
      <rect x="156" y="144" width="148" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="155" width="132" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="166" width="140" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="177" width="120" height="4" rx="2" fill="#e7e5e4"/>
      {/* Section label */}
      <rect x="156" y="192" width="72" height="4" rx="2" fill="#a8c8e8" opacity="0.75"/>
      <rect x="156" y="204" width="148" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="215" width="136" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="226" width="144" height="4" rx="2" fill="#e7e5e4"/>
      {/* Section label 2 */}
      <rect x="156" y="241" width="64" height="4" rx="2" fill="#c8b8e0" opacity="0.75"/>
      <rect x="156" y="253" width="148" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="264" width="128" height="4" rx="2" fill="#e7e5e4"/>
      {/* Shield */}
      <path d="M336 112 L392 132 L392 196 C392 228 336 248 336 248 C336 248 280 228 280 196 L280 132 Z"
      fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" opacity="0.9"/>
      <path d="M336 126 L380 142 L380 192 C380 216 336 232 336 232 C336 232 292 216 292 192 L292 142 Z"
      fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1" opacity="0.9"/>
      {/* Shield checkmark */}
      <polyline points="320,180 332,192 352,168" stroke="#075985" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Second smaller doc (background) */}
      <rect x="64"  y="104" width="128" height="164" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.85"/>
      <rect x="64"  y="104" width="128" height="36"  rx="8" fill="#fafafa"/>
      <rect x="64"  y="128" width="128" height="12"       fill="#fafafa"/>
      <rect x="80"  y="152" width="96" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="162" width="80" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="172" width="88" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="188" width="96" height="3" rx="2" fill="#c8b8e0" opacity="0.6"/>
      <rect x="80"  y="200" width="80" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="210" width="84" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="224" width="96" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="234" width="72" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="248" width="80" height="3" rx="2" fill="#e7e5e4"/>
      {/* RTI badge floating */}
      <rect x="52" y="280" width="80" height="32" rx="16" fill="#0c0a09"/>
      <rect x="68" y="291" width="48" height="10" rx="3" fill="#ffffff" opacity="0.85"/>
      {/* Section 4 marker */}
      <rect x="300" y="280" width="88" height="28" rx="14" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1"/>
      <rect x="316" y="290" width="56" height="8"  rx="3" fill="#a8c8e8" opacity="0.7"/>
      </svg>
  );
}
