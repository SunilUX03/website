export function TendersGraphic() {
  return (
      <svg
        className="h-auto w-full max-w-[440px]"
        viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft background blobs */}
      <ellipse cx="310" cy="90"  rx="100" ry="64" fill="#f4c5a8" opacity="0.18"/>
      <ellipse cx="150" cy="295" rx="85"  ry="58" fill="#c8b8e0" opacity="0.18"/>
      {/* Dot grid */}
      <g opacity="0.11">
      <circle cx="40"  cy="40"  r="2.5" fill="#292524"/>
      <circle cx="100" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="160" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="220" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="340" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="400" cy="40"  r="2.5" fill="#292524"/>
      <circle cx="40"  cy="100" r="2.5" fill="#292524"/>
      <circle cx="100" cy="100" r="2.5" fill="#292524"/>
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
      {/* Main document (back) */}
      <rect x="155" y="60" width="190" height="250" rx="10" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" opacity="0.7"/>
      {/* Dog-ear fold */}
      <path d="M321 60 L345 84" stroke="#e7e5e4" strokeWidth="1" opacity="0.7"/>
      <path d="M321 60 L345 60 L345 84 Z" fill="#f0efed" opacity="0.7"/>
      {/* Main document (front) */}
      <rect x="130" y="80" width="190" height="250" rx="10" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      {/* Dog-ear fold front */}
      <path d="M296 80 L320 104" stroke="#e7e5e4" strokeWidth="1"/>
      <path d="M296 80 L320 80 L320 104 Z" fill="#f0efed"/>
      {/* Document header band */}
      <rect x="130" y="80" width="190" height="36" rx="10" fill="#f5f5f5"/>
      <rect x="130" y="100" width="190" height="16" fill="#f5f5f5"/>
      {/* TNeGA wordmark in header */}
      <rect x="146" y="92" width="44" height="10" rx="3" fill="#292524" opacity="0.85"/>
      <rect x="196" y="94" width="60" height="6" rx="2" fill="#d6d3d1"/>
      {/* Lines of text */}
      <rect x="146" y="130" width="158" height="6" rx="2" fill="#e7e5e4"/>
      <rect x="146" y="144" width="130" height="6" rx="2" fill="#e7e5e4"/>
      <rect x="146" y="158" width="148" height="6" rx="2" fill="#e7e5e4"/>
      {/* Divider */}
      <line x1="146" y1="176" x2="304" y2="176" stroke="#f0efed" strokeWidth="1"/>
      {/* Key-value rows */}
      <rect x="146" y="188" width="60" height="5" rx="2" fill="#d6d3d1"/>
      <rect x="220" y="188" width="84" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="146" y="202" width="60" height="5" rx="2" fill="#d6d3d1"/>
      <rect x="220" y="202" width="72" height="5" rx="2" fill="#e7e5e4"/>
      <rect x="146" y="216" width="60" height="5" rx="2" fill="#d6d3d1"/>
      <rect x="220" y="216" width="80" height="5" rx="2" fill="#e7e5e4"/>
      {/* Divider 2 */}
      <line x1="146" y1="232" x2="304" y2="232" stroke="#f0efed" strokeWidth="1"/>
      {/* Status badge (Open) */}
      <rect x="146" y="244" width="44" height="16" rx="8" fill="#dcfce7"/>
      <rect x="152" y="249" width="32" height="5" rx="2" fill="#15803d" opacity="0.7"/>
      {/* Seal circle */}
      <circle cx="284" cy="252" r="18" fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1.5"/>
      <circle cx="284" cy="252" r="12" fill="none" stroke="#d6d3d1" strokeWidth="1" strokeDasharray="3 2"/>
      <circle cx="284" cy="252" r="5" fill="#292524" opacity="0.15"/>
      {/* Download arrow floating badge */}
      <rect x="310" y="195" width="80" height="44" rx="10" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.95"/>
      <line x1="350" y1="208" x2="350" y2="225" stroke="#292524" strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="343,219 350,226 357,219" stroke="#292524" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="342" y1="230" x2="358" y2="230" stroke="#292524" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Calendar badge */}
      <rect x="50" y="130" width="72" height="64" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.95"/>
      <rect x="50" y="130" width="72" height="22" rx="8" fill="#f4c5a8" opacity="0.5"/>
      <rect x="50" y="140" width="72" height="12" fill="#f4c5a8" opacity="0.5"/>
      <rect x="58" y="162" width="12" height="12" rx="3" fill="#f0efed"/>
      <rect x="76" y="162" width="12" height="12" rx="3" fill="#f0efed"/>
      <rect x="94" y="162" width="12" height="12" rx="3" fill="#292524" opacity="0.8"/>
      <rect x="58" y="134" width="32" height="5" rx="2" fill="#292524" opacity="0.4"/>
      {/* Connector lines */}
      <line x1="122" y1="162" x2="130" y2="162" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="310" y1="217" x2="320" y2="217" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 2"/>
      </svg>
  );
}
