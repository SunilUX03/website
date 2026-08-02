export function ServicesGraphic() {
  return (
    <svg
      className="h-auto w-full max-w-[440px]"
      viewBox="0 0 440 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Atmospheric blobs */}
      <ellipse cx="322" cy="86" rx="112" ry="74" fill="#a8c8e8" opacity="0.15" />
      <ellipse cx="122" cy="296" rx="92" ry="60" fill="#c8b8e0" opacity="0.15" />

      {/* Dot grid */}
      <g opacity="0.10">
        <circle cx="40" cy="40" r="2.5" fill="#292524" />
        <circle cx="100" cy="40" r="2.5" fill="#292524" />
        <circle cx="400" cy="40" r="2.5" fill="#292524" />
        <circle cx="40" cy="100" r="2.5" fill="#292524" />
        <circle cx="400" cy="100" r="2.5" fill="#292524" />
        <circle cx="40" cy="160" r="2.5" fill="#292524" />
        <circle cx="400" cy="160" r="2.5" fill="#292524" />
        <circle cx="40" cy="220" r="2.5" fill="#292524" />
        <circle cx="400" cy="220" r="2.5" fill="#292524" />
        <circle cx="40" cy="280" r="2.5" fill="#292524" />
        <circle cx="400" cy="280" r="2.5" fill="#292524" />
        <circle cx="40" cy="340" r="2.5" fill="#292524" />
        <circle cx="160" cy="340" r="2.5" fill="#292524" />
        <circle cx="280" cy="340" r="2.5" fill="#292524" />
        <circle cx="400" cy="340" r="2.5" fill="#292524" />
      </g>

      {/* Hub-and-spoke: TNeGA at the centre, connected to a ring of service
          tiles — same motif as the About page's ecosystem/orbit diagrams,
          reused here for "one agency, many services". */}
      <g stroke="#d6d3d1" strokeWidth="1.3">
        <line x1="220" y1="196" x2="220" y2="90" />
        <line x1="220" y1="196" x2="316" y2="140" />
        <line x1="220" y1="196" x2="316" y2="252" />
        <line x1="220" y1="196" x2="220" y2="302" />
        <line x1="220" y1="196" x2="124" y2="252" />
        <line x1="220" y1="196" x2="124" y2="140" />
      </g>

      {/* Spoke tiles */}
      <g>
        <rect x="196" y="62" width="48" height="36" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" />
        <rect x="206" y="74" width="28" height="5" rx="2" fill="#a8c8e8" />
        <rect x="206" y="83" width="18" height="4" rx="2" fill="#e7e5e4" />
      </g>
      <g>
        <rect x="300" y="120" width="48" height="36" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" />
        <rect x="310" y="132" width="28" height="5" rx="2" fill="#c8b8e0" />
        <rect x="310" y="141" width="18" height="4" rx="2" fill="#e7e5e4" />
      </g>
      <g>
        <rect x="300" y="234" width="48" height="36" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" />
        <rect x="310" y="246" width="28" height="5" rx="2" fill="#a7e5d3" />
        <rect x="310" y="255" width="18" height="4" rx="2" fill="#e7e5e4" />
      </g>
      <g>
        <rect x="196" y="284" width="48" height="36" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" />
        <rect x="206" y="296" width="28" height="5" rx="2" fill="#f4c5a8" />
        <rect x="206" y="305" width="18" height="4" rx="2" fill="#e7e5e4" />
      </g>
      <g>
        <rect x="92" y="234" width="48" height="36" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" />
        <rect x="102" y="246" width="28" height="5" rx="2" fill="#e8b8c4" />
        <rect x="102" y="255" width="18" height="4" rx="2" fill="#e7e5e4" />
      </g>
      <g>
        <rect x="92" y="120" width="48" height="36" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" />
        <rect x="102" y="132" width="28" height="5" rx="2" fill="#a8c8e8" />
        <rect x="102" y="141" width="18" height="4" rx="2" fill="#e7e5e4" />
      </g>

      {/* Hub */}
      <circle cx="220" cy="196" r="42" fill="#0c0a09" />
      <circle cx="220" cy="196" r="42" fill="none" stroke="#1d3f8f" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
      <rect x="200" y="188" width="40" height="6" rx="3" fill="#ffffff" opacity="0.9" />
      <rect x="206" y="200" width="28" height="5" rx="2.5" fill="#ffffff" opacity="0.55" />

      {/* Floating metric card top right */}
      <rect x="332" y="20" width="92" height="58" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.97" />
      <rect x="332" y="20" width="92" height="22" rx="8" fill="#e8eef8" />
      <rect x="332" y="30" width="92" height="12" fill="#e8eef8" />
      <rect x="344" y="25" width="48" height="5" rx="2" fill="#1d3f8f" opacity="0.6" />
      <rect x="344" y="52" width="36" height="10" rx="3" fill="#0c0a09" />
      <rect x="358" y="55" width="14" height="4" rx="2" fill="#ffffff" />

      {/* Floating stat card bottom left */}
      <rect x="14" y="200" width="60" height="56" rx="8" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1" opacity="0.97" />
      <rect x="24" y="212" width="40" height="4" rx="2" fill="#a8a29e" />
      <rect x="24" y="222" width="30" height="8" rx="2" fill="#0c0a09" />
      <rect x="24" y="238" width="34" height="4" rx="2" fill="#e7e5e4" />
    </svg>
  );
}
