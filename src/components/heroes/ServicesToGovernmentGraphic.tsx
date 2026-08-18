/** Same wireframe illustration language as the other Notifications-family
 * pages (see RtiGraphic, TendersGraphic, ...) — a soft dot grid, two
 * translucent blobs, a "document" card, a secondary card behind it, and
 * a floating badge/shield — re-themed around raising a support ticket
 * instead of a legal document: a ticket stub icon instead of a
 * government seal, and department-directory-style rows instead of RTI
 * section text. */
export function ServicesToGovernmentGraphic() {
  return (
    <svg
      className="h-auto w-full max-w-[440px]"
      viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blobs */}
      <ellipse cx="308" cy="76"  rx="108" ry="70" fill="#a8c8e8" opacity="0.14"/>
      <ellipse cx="144" cy="304" rx="88"  ry="58" fill="#f3c8a0" opacity="0.16"/>
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
      {/* Main ticket card */}
      <rect x="136" y="56" width="168" height="228" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      {/* Card header stripe */}
      <rect x="136" y="56"  width="168" height="44" rx="8" fill="#f5f5f5"/>
      <rect x="136" y="88"  width="168" height="12"       fill="#f5f5f5"/>
      {/* Ticket-stub icon (perforated edge), replacing the government seal */}
      <rect x="200" y="66" width="40" height="24" rx="4" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      <line x1="220" y1="66" x2="220" y2="90" stroke="#d6d3d1" strokeWidth="1" strokeDasharray="2 2"/>
      <circle cx="220" cy="66" r="2.5" fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1"/>
      <circle cx="220" cy="90" r="2.5" fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1"/>
      <circle cx="210" cy="78" r="2" fill="#292524" opacity="0.18"/>
      {/* Title line */}
      <rect x="156" y="108" width="128" height="6" rx="2" fill="#292524" opacity="0.7"/>
      <rect x="172" y="120" width="96"  height="4" rx="2" fill="#d6d3d1"/>
      {/* Divider */}
      <line x1="156" y1="134" x2="288" y2="134" stroke="#e7e5e4" strokeWidth="1"/>
      {/* Field: Department */}
      <rect x="156" y="144" width="72" height="4" rx="2" fill="#a8c8e8" opacity="0.75"/>
      <rect x="156" y="156" width="148" height="4" rx="2" fill="#e7e5e4"/>
      {/* Field: Subject */}
      <rect x="156" y="176" width="60" height="4" rx="2" fill="#a8c8e8" opacity="0.75"/>
      <rect x="156" y="188" width="140" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="199" width="120" height="4" rx="2" fill="#e7e5e4"/>
      {/* Field: Priority */}
      <rect x="156" y="219" width="56" height="4" rx="2" fill="#f3c8a0" opacity="0.85"/>
      <rect x="156" y="231" width="44" height="16" rx="8" fill="#fdf0e2" stroke="#f3c8a0" strokeWidth="1"/>
      {/* Field: Status pill */}
      <rect x="212" y="231" width="44" height="16" rx="8" fill="#eaf2fb" stroke="#a8c8e8" strokeWidth="1"/>
      {/* Field: raised by */}
      <rect x="156" y="257" width="148" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="156" y="268" width="100" height="4" rx="2" fill="#e7e5e4"/>
      {/* Confirmation shield */}
      <path d="M336 112 L392 132 L392 196 C392 228 336 248 336 248 C336 248 280 228 280 196 L280 132 Z"
      fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" opacity="0.9"/>
      <path d="M336 126 L380 142 L380 192 C380 216 336 232 336 232 C336 232 292 216 292 192 L292 142 Z"
      fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1" opacity="0.9"/>
      {/* Shield checkmark — ticket raised/confirmed */}
      <polyline points="320,180 332,192 352,168" stroke="#075985" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Second smaller card (background) — department directory */}
      <rect x="64"  y="104" width="128" height="164" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.85"/>
      <rect x="64"  y="104" width="128" height="36"  rx="8" fill="#fafafa"/>
      <rect x="64"  y="128" width="128" height="12"       fill="#fafafa"/>
      <rect x="80"  y="152" width="96" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="162" width="80" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="172" width="88" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="188" width="96" height="3" rx="2" fill="#f3c8a0" opacity="0.7"/>
      <rect x="80"  y="200" width="80" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="210" width="84" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="224" width="96" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="234" width="72" height="3" rx="2" fill="#e7e5e4"/>
      <rect x="80"  y="248" width="80" height="3" rx="2" fill="#e7e5e4"/>
      {/* Floating "support" badge */}
      <rect x="52" y="280" width="80" height="32" rx="16" fill="#0c0a09"/>
      <circle cx="68" cy="296" r="6" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.85"/>
      <path d="M64 296a4 4 0 0 1 8 0" stroke="#ffffff" strokeWidth="1.3" opacity="0.85" fill="none"/>
      <rect x="82" y="291" width="34" height="10" rx="3" fill="#ffffff" opacity="0.85"/>
      {/* SLA marker */}
      <rect x="300" y="280" width="88" height="28" rx="14" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1"/>
      <rect x="316" y="290" width="56" height="8"  rx="3" fill="#f3c8a0" opacity="0.7"/>
      </svg>
  );
}
