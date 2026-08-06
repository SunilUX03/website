"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_MS = 260; // how long a point lingers before fully fading

/**
 * Small dot cursor scoped to whatever container renders this component
 * (the hero) — replaces the default OS cursor there only, echoing
 * digitz.fr's restrained custom-cursor quality without going elsewhere
 * on the page. Trails a smooth, tapering line (drawn on a canvas from the
 * pointer's recent path, width and opacity fading with age) rather than
 * discrete particles — reads as one soft cursor tail, not a burst effect.
 */
export function HeroDotCursor({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const rafRef = useRef(0);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // Respect touch devices — no synthetic cursor there.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const move = (e: PointerEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, path"));

      if (!reducedMotion) {
        pointsRef.current.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      }
    };
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);

    el.classList.add("hero-cursor-none");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);

    if (!reducedMotion) {
      const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) {
          if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const now = performance.now();
          pointsRef.current = pointsRef.current.filter((p) => now - p.t < TRAIL_MS);
          const pts = pointsRef.current;

          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          for (let i = 1; i < pts.length; i++) {
            const age = (now - pts[i].t) / TRAIL_MS; // 0 fresh → 1 gone
            const alpha = Math.max(0, 1 - age) * 0.5;
            if (alpha <= 0) continue;
            ctx.strokeStyle = `rgba(29, 63, 143, ${alpha})`;
            ctx.lineWidth = Math.max(0.6, 3.2 * (1 - age));
            ctx.beginPath();
            ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
            ctx.lineTo(pts[i].x, pts[i].y);
            ctx.stroke();
          }
        }
        rafRef.current = requestAnimationFrame(draw);
      };
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      el.classList.remove("hero-cursor-none");
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [targetRef]);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[58]" />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] transition-[opacity,width,height] duration-150 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          width: hovering ? 32 : 10,
          height: hovering ? 32 : 10,
          marginLeft: hovering ? -16 : -5,
          marginTop: hovering ? -16 : -5,
          borderRadius: "9999px",
          background: hovering ? "transparent" : "#1D3F8F",
          border: hovering ? "1.5px solid #1D3F8F" : "none",
        }}
      />
      <style>{`
        .hero-cursor-none, .hero-cursor-none * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
