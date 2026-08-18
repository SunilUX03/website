/** Same wireframe illustration language as the other hero graphics (see
 * RtiGraphic, ServicesToGovernmentGraphic, ...) — a soft dot grid, two
 * translucent blobs, a primary "card" with a secondary card behind it,
 * and a floating badge — re-themed around a portfolio of many projects:
 * a dashboard window tiled with project cards instead of a single
 * document, a growth-chart secondary card, and a project-count badge. */
export function InitiativesProjectsGraphic() {
  return (
    <svg
      className="h-auto w-full max-w-[440px]"
      viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blobs */}
      <ellipse cx="316" cy="82"  rx="110" ry="72" fill="#c8b8e0" opacity="0.15"/>
      <ellipse cx="126" cy="302" rx="90"  ry="58" fill="#a8c8e8" opacity="0.15"/>
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
      {/* Secondary card (background) — growth / impact chart */}
      <rect x="48" y="150" width="132" height="96" rx="10" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.9"/>
      <rect x="62" y="164" width="60" height="5" rx="2" fill="#292524" opacity="0.55"/>
      <g>
        <rect x="62"  y="214" width="12" height="16" rx="2" fill="#c8b8e0" opacity="0.7"/>
        <rect x="80"  y="204" width="12" height="26" rx="2" fill="#c8b8e0" opacity="0.8"/>
        <rect x="98"  y="196" width="12" height="34" rx="2" fill="#a8c8e8" opacity="0.85"/>
        <rect x="116" y="184" width="12" height="46" rx="2" fill="#a8c8e8"/>
        <rect x="134" y="176" width="12" height="54" rx="2" fill="#1d3f8f" opacity="0.85"/>
      </g>
      <line x1="62" y1="230" x2="146" y2="230" stroke="#e7e5e4" strokeWidth="1"/>

      {/* Dashboard window (foreground) */}
      <rect x="140" y="50" width="196" height="228" rx="10" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5"/>
      <rect x="140" y="50" width="196" height="28" rx="10" fill="#f5f5f5"/>
      <rect x="140" y="70" width="196" height="8" fill="#f5f5f5"/>
      <circle cx="154" cy="64" r="3" fill="#f3c8a0"/>
      <circle cx="166" cy="64" r="3" fill="#a7e5d3"/>
      <circle cx="178" cy="64" r="3" fill="#a8c8e8"/>
      <rect x="292" y="60" width="32" height="8" rx="4" fill="#e7e5e4"/>

      {/* Grid of project tiles */}
      <g>
        <rect x="154" y="90"  width="80" height="54" rx="7" fill="#eaf2fb" stroke="#a8c8e8" strokeWidth="1"/>
        <rect x="164" y="100" width="18" height="18" rx="4" fill="#a8c8e8"/>
        <rect x="164" y="124" width="40" height="4" rx="2" fill="#1d3f8f" opacity="0.55"/>
        <rect x="164" y="132" width="26" height="3.5" rx="1.5" fill="#a8c8e8" opacity="0.6"/>

        <rect x="242" y="90"  width="80" height="54" rx="7" fill="#fdf0e2" stroke="#f3c8a0" strokeWidth="1"/>
        <rect x="252" y="100" width="18" height="18" rx="4" fill="#f3c8a0"/>
        <rect x="252" y="124" width="40" height="4" rx="2" fill="#a05a1d" opacity="0.55"/>
        <rect x="252" y="132" width="26" height="3.5" rx="1.5" fill="#f3c8a0" opacity="0.7"/>

        <rect x="154" y="152" width="80" height="54" rx="7" fill="#eefaf5" stroke="#a7e5d3" strokeWidth="1"/>
        <rect x="164" y="162" width="18" height="18" rx="4" fill="#a7e5d3"/>
        <rect x="164" y="186" width="40" height="4" rx="2" fill="#2f7a5f" opacity="0.55"/>
        <rect x="164" y="194" width="26" height="3.5" rx="1.5" fill="#a7e5d3" opacity="0.7"/>

        <rect x="242" y="152" width="80" height="54" rx="7" fill="#f3eefb" stroke="#c8b8e0" strokeWidth="1"/>
        <rect x="252" y="162" width="18" height="18" rx="4" fill="#c8b8e0"/>
        <rect x="252" y="186" width="40" height="4" rx="2" fill="#5a3f8f" opacity="0.55"/>
        <rect x="252" y="194" width="26" height="3.5" rx="1.5" fill="#c8b8e0" opacity="0.7"/>
      </g>
      {/* Summary row */}
      <line x1="154" y1="220" x2="322" y2="220" stroke="#e7e5e4" strokeWidth="1"/>
      <rect x="154" y="232" width="70" height="5" rx="2" fill="#292524" opacity="0.6"/>
      <rect x="154" y="244" width="110" height="4" rx="2" fill="#d6d3d1"/>
      <rect x="154" y="254" width="90"  height="4" rx="2" fill="#d6d3d1"/>

      {/* Floating project-count badge */}
      <rect x="286" y="16" width="100" height="34" rx="17" fill="#0c0a09"/>
      <path d="M304 33 L308 24 L312 30 L316 20 L320 33" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9"/>
      <rect x="330" y="27" width="46" height="10" rx="3" fill="#ffffff" opacity="0.85"/>

      {/* Floating "live" marker */}
      <rect x="66" y="266" width="80" height="26" rx="13" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1"/>
      <circle cx="82" cy="279" r="4" fill="#a7e5d3" stroke="#4a9c7f" strokeWidth="1"/>
      <rect x="94" y="275" width="42" height="7" rx="3" fill="#e7e5e4"/>
    </svg>
  );
}
