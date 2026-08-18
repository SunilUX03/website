/** Same wireframe illustration language as the other hero graphics (see
 * RtiGraphic, ServicesToGovernmentGraphic, ...) — a soft dot grid, two
 * translucent blobs, a primary "card" with a secondary card behind it,
 * and a floating badge — re-themed around a citizen using a service on
 * their phone: a phone-shaped card with app tiles instead of a document,
 * an ID-card-style secondary card, and a "Verified" confirmation badge. */
export function CitizenServicesGraphic() {
  return (
    <svg
      className="h-auto w-full max-w-[440px]"
      viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blobs */}
      <ellipse cx="320" cy="88"  rx="108" ry="70" fill="#a7e5d3" opacity="0.16"/>
      <ellipse cx="120" cy="300" rx="92"  ry="60" fill="#a8c8e8" opacity="0.14"/>
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
      {/* Secondary card (background) — citizen ID / record */}
      <rect x="52" y="128" width="140" height="92" rx="10" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.9"/>
      <circle cx="80" cy="158" r="16" fill="#eaf2fb" stroke="#a8c8e8" strokeWidth="1"/>
      <circle cx="80" cy="153" r="5" fill="#a8c8e8"/>
      <path d="M70 168c2-6 18-6 20 0" stroke="#a8c8e8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <rect x="104" y="146" width="72" height="5" rx="2" fill="#292524" opacity="0.6"/>
      <rect x="104" y="158" width="56" height="4" rx="2" fill="#d6d3d1"/>
      <rect x="104" y="168" width="64" height="4" rx="2" fill="#d6d3d1"/>
      <rect x="68"  y="192" width="108" height="14" rx="7" fill="#eefaf5" stroke="#a7e5d3" strokeWidth="1"/>
      <rect x="80"  y="197" width="60" height="4" rx="2" fill="#4a9c7f" opacity="0.7"/>

      {/* Phone card (foreground) — a plain bordered card like the other
          pages' primary cards, not a solid smartphone bezel. */}
      <rect x="164" y="52" width="140" height="248" rx="14" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      {/* Greeting row */}
      <circle cx="190" cy="86" r="10" fill="#eaf2fb" stroke="#a8c8e8" strokeWidth="1"/>
      <rect x="206" y="80" width="60" height="5" rx="2" fill="#292524" opacity="0.65"/>
      <rect x="206" y="90" width="40" height="4" rx="2" fill="#d6d3d1"/>
      {/* Search bar */}
      <rect x="182" y="104" width="104" height="16" rx="8" fill="#f5f5f5" stroke="#e7e5e4" strokeWidth="1"/>
      <circle cx="192" cy="112" r="3.5" fill="none" stroke="#a8a29e" strokeWidth="1.3"/>
      <line x1="195" y1="115" x2="198" y2="118" stroke="#a8a29e" strokeWidth="1.3" strokeLinecap="round"/>
      {/* Service tiles (e-Sevai / UMIS style) */}
      <rect x="182" y="132" width="49" height="52" rx="8" fill="#eaf2fb" stroke="#a8c8e8" strokeWidth="1"/>
      <rect x="192" y="142" width="20" height="20" rx="5" fill="#a8c8e8"/>
      <rect x="192" y="168" width="30" height="4" rx="2" fill="#1d3f8f" opacity="0.6"/>
      <rect x="237" y="132" width="49" height="52" rx="8" fill="#fdf0e2" stroke="#f3c8a0" strokeWidth="1"/>
      <rect x="247" y="142" width="20" height="20" rx="5" fill="#f3c8a0"/>
      <rect x="247" y="168" width="30" height="4" rx="2" fill="#a05a1d" opacity="0.6"/>
      {/* List rows */}
      <rect x="182" y="196" width="104" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="182" y="196" width="60" height="4" rx="2" fill="#a7e5d3" opacity="0.8"/>
      <rect x="182" y="208" width="104" height="4" rx="2" fill="#e7e5e4"/>
      <rect x="182" y="220" width="80" height="4" rx="2" fill="#e7e5e4"/>
      {/* Primary action button */}
      <rect x="182" y="242" width="104" height="24" rx="12" fill="#0c0a09"/>
      <rect x="216" y="251" width="36" height="6" rx="3" fill="#ffffff" opacity="0.9"/>
      {/* Bottom nav */}
      <line x1="182" y1="276" x2="286" y2="276" stroke="#e7e5e4" strokeWidth="1"/>
      <circle cx="200" cy="284" r="4" fill="#292524" opacity="0.55"/>
      <circle cx="234" cy="284" r="4" fill="#e7e5e4"/>
      <circle cx="268" cy="284" r="4" fill="#e7e5e4"/>

      {/* Floating "Verified" badge */}
      <rect x="272" y="18" width="98" height="34" rx="17" fill="#0c0a09"/>
      <circle cx="291" cy="35" r="8" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="0.9"/>
      <polyline points="287,35 290,38 296,31" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9"/>
      <rect x="308" y="30" width="48" height="10" rx="3" fill="#ffffff" opacity="0.85"/>

      {/* SLA / reach marker */}
      <rect x="44" y="252" width="88" height="28" rx="14" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1"/>
      <rect x="60" y="262" width="56" height="8" rx="3" fill="#a8c8e8" opacity="0.7"/>
    </svg>
  );
}
