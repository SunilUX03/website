"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Small dot cursor scoped to whatever container renders this component
 * (the hero) — replaces the default OS cursor there only, echoing
 * digitz.fr's restrained custom-cursor quality without going elsewhere
 * on the page.
 */
export function HeroDotCursor({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // Respect touch devices — no synthetic cursor there.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: PointerEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, path"));
    };
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);

    el.classList.add("hero-cursor-none");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.classList.remove("hero-cursor-none");
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [targetRef]);

  return (
    <>
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
