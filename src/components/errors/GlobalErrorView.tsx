"use client";

import { useState } from "react";

const blue = "#1d3f8f";

/** The body of the whole-layout crash page (global-error.tsx). It lives in
 * its own component only so the dev-only preview page can show exactly the
 * same thing. Everything is inline and bilingual on purpose: when it's
 * needed, the site's stylesheet, fonts and data can't be trusted. */
export function GlobalErrorView({ onRetry }: { onRetry: () => void }) {
  const [busy, setBusy] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        boxSizing: "border-box",
        background: "linear-gradient(160deg,#eef4fb 0%,#f6f7f9 55%,#eaf6f1 100%)",
        color: "#1c1917",
        fontFamily: "'Noto Sans','Noto Sans Tamil',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
      }}
    >
      <main style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true" style={{ marginBottom: 20 }}>
          <circle cx="44" cy="44" r="42" fill="#fff" stroke="#d9e0ee" strokeWidth="2" />
          <path d="M44 22 66 62H22Z" fill="none" stroke={blue} strokeWidth="4" strokeLinejoin="round" />
          <path d="M44 38v12" stroke={blue} strokeWidth="4" strokeLinecap="round" />
          <circle cx="44" cy="56" r="2.6" fill={blue} />
        </svg>
        <p style={{ margin: "0 0 8px", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "#78716c" }}>
          Error 500 · பிழை 500
        </p>
        <h1 style={{ margin: "0 0 12px", fontSize: 30, lineHeight: 1.2, fontWeight: 500 }}>
          Something went wrong on our side
          <br />
          <span style={{ fontSize: 24 }}>எங்கள் பக்கத்தில் ஏதோ தவறு நேர்ந்துவிட்டது</span>
        </h1>
        <p style={{ margin: "0 0 8px", fontSize: 16, lineHeight: 1.6, color: "#44403c" }}>
          This isn&apos;t something you did. Please try again in a moment.
        </p>
        <p style={{ margin: "0 0 28px", fontSize: 16, lineHeight: 1.6, color: "#44403c" }}>
          இது நீங்கள் செய்த தவறு அல்ல. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              onRetry();
            }}
            style={{
              background: blue,
              color: "#fff",
              border: 0,
              borderRadius: 999,
              padding: "12px 26px",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              opacity: busy ? 0.7 : 1,
            }}
          >
            Try again · மீண்டும் முயற்சிக்கவும்
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              border: "1px solid #a8a29e",
              color: "#292524",
              borderRadius: 999,
              padding: "11px 26px",
              fontSize: 16,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Go to Home · முகப்புக்கு
          </a>
        </div>
      </main>
    </div>
  );
}
