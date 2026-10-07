export type ErrorVariant = "404" | "500" | "503";

function Gear({ r, teeth, spinClass }: { r: number; teeth: number; spinClass: string }) {
  const toothW = (2 * Math.PI * r) / teeth / 2;
  return (
    <g className={spinClass}>
      {Array.from({ length: teeth }, (_, i) => (
        <rect key={i} x={-toothW / 2} y={-r - 7} width={toothW} height={11} rx="2" fill="#1d3f8f" transform={`rotate(${(i * 360) / teeth})`} />
      ))}
      <circle r={r} fill="#1d3f8f" />
      <circle r={r * 0.42} fill="#fff" />
    </g>
  );
}

/** Shared illustration for the error pages: a browser window with floating
 * shield/document/location badges. What's inside the window changes with the
 * variant: 404 a soft number being searched for, 500 a gear that has
 * stopped being steady, 503 two meshed gears and a progress bar. All motion
 * is CSS (globals.css) and off under prefers-reduced-motion. Client-safe:
 * no hooks, no server imports. */
export function ErrorIllustration({ variant, label }: { variant: ErrorVariant; label: string }) {
  return (
    <svg viewBox="0 0 480 420" role="img" aria-label={label} className="h-auto w-full max-w-[480px]">
      <defs>
        <radialGradient id="nfGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-gradient-sky)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--color-gradient-mint)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nfNumber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d3f8f" />
          <stop offset="100%" stopColor="#5b8bd9" />
        </linearGradient>
        <filter id="nfShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#1d3f8f" floodOpacity="0.16" />
        </filter>
      </defs>

      <ellipse cx="240" cy="215" rx="228" ry="192" fill="url(#nfGlow)" />

      <g className="nf-float" filter="url(#nfShadow)">
        <rect x="80" y="70" width="320" height="250" rx="18" fill="#fff" stroke="#d9e0ee" />
        <path d="M80 110V88a18 18 0 0 1 18-18h284a18 18 0 0 1 18 18v22Z" fill="#eef2f9" />
        <circle cx="104" cy="90" r="5" fill="#c3cde3" />
        <circle cx="122" cy="90" r="5" fill="#c3cde3" />
        <circle cx="140" cy="90" r="5" fill="#c3cde3" />
        <rect x="165" y="80" width="215" height="20" rx="10" fill="#fff" />
        <text x="178" y="94" fontSize="11" fill="#8a93a8">tnega.tn.gov.in/…</text>

        {variant !== "503" ? (
          <>
            <text x="240" y="212" textAnchor="middle" fontSize="88" fontWeight="700" fill="url(#nfNumber)" letterSpacing="2">
              {variant}
            </text>
            <rect x="150" y="238" width="180" height="8" rx="4" fill="#e3e8f3" className="nf-line" />
            <rect x="178" y="256" width="124" height="8" rx="4" fill="#e3e8f3" className="nf-line nf-line-b" />
            <rect x="205" y="274" width="70" height="8" rx="4" fill="#e3e8f3" className="nf-line nf-line-c" />
          </>
        ) : null}

        {variant === "404" ? (
          <g className="nf-search">
            <circle cx="292" cy="226" r="27" fill="#fff" fillOpacity="0.4" stroke="#1d3f8f" strokeWidth="5" />
            <path d="M278 214a15 15 0 0 1 12-6" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
            <line x1="311" y1="246" x2="334" y2="270" stroke="#1d3f8f" strokeWidth="8" strokeLinecap="round" />
          </g>
        ) : null}

        {variant === "500" ? (
          <g transform="translate(330 262)">
            <circle r="30" fill="#fff" stroke="#d9e0ee" />
            <g className="nf-wobble">
              <Gear r={14} teeth={8} spinClass="" />
            </g>
          </g>
        ) : null}

        {variant === "503" ? (
          <>
            <g transform="translate(212 196)">
              <Gear r={36} teeth={10} spinClass="nf-spin" />
            </g>
            <g transform="translate(278 236)">
              <Gear r={22} teeth={8} spinClass="nf-spin-rev" />
            </g>
            <rect x="150" y="284" width="180" height="10" rx="5" fill="#e3e8f3" />
            <rect x="150" y="284" width="180" height="10" rx="5" fill="url(#nfNumber)" className="nf-progress" />
          </>
        ) : null}
      </g>

      <g transform="translate(412 96)">
        <g className="nf-float nf-float-b">
          <circle r="26" fill="#fff" stroke="#d9e0ee" />
          <circle r="19" fill="var(--color-gradient-mint)" />
          <path d="M0-11 9-7v7c0 6-4 10-9 12-5-2-9-6-9-12v-7Z" fill="#fff" stroke="#1d3f8f" strokeWidth="2" strokeLinejoin="round" />
          <path d="m-4 0 3 3 6-6" stroke="#1d3f8f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </g>
      <g transform="translate(52 208)">
        <g className="nf-float nf-float-c">
          <circle r="24" fill="#fff" stroke="#d9e0ee" />
          <circle r="17" fill="var(--color-gradient-peach)" />
          <path d="M-7-10h9l7 7v13H-7Z" fill="#fff" stroke="#1d3f8f" strokeWidth="2" strokeLinejoin="round" />
          <path d="M-3 2h8M-3 6h8" stroke="#1d3f8f" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </g>
      <g transform="translate(420 322)">
        <g className="nf-float nf-float-d">
          <circle r="24" fill="#fff" stroke="#d9e0ee" />
          <circle r="17" fill="var(--color-gradient-lavender)" />
          <path d="M0 11C-7 3-8-1-8-4a8 8 0 0 1 16 0c0 3-1 7-8 15Z" fill="#fff" stroke="#1d3f8f" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="0" cy="-4" r="3" fill="#1d3f8f" />
        </g>
      </g>

      <circle cx="58" cy="96" r="4" fill="var(--color-gradient-sky)" className="nf-twinkle" />
      <circle cx="120" cy="352" r="5" fill="var(--color-gradient-mint)" className="nf-twinkle nf-twinkle-b" />
      <circle cx="372" cy="372" r="3.5" fill="var(--color-gradient-rose)" className="nf-twinkle nf-twinkle-c" />
    </svg>
  );
}
