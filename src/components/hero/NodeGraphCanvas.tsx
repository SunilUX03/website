"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const LINK_DISTANCE = 150;
const PROXIMITY_RADIUS = 140;
const PULSE_LIFETIME = 900; // ms

/**
 * Ambient dots-and-lines background layer, restored per feedback — this
 * sits BEHIND the Tamil Nadu district map (HeroDistrictMap), which stays
 * untouched. Same restrained, always-alive quality as before: idle drift
 * plus cursor/tap-proximity brightening, contained to this canvas only.
 */
export function NodeGraphCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    let nodes: Node[] = [];
    let raf = 0;
    let pointer: { x: number; y: number; active: boolean } = {
      x: -9999,
      y: -9999,
      active: false,
    };
    let pulses: { x: number; y: number; start: number }[] = [];

    const seedNodes = () => {
      const area = width * height;
      const count = Math.max(18, Math.min(56, Math.round(area / 10000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1.3 + Math.random() * 1.1,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedNodes();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(29, 63, 143, 0.12)";
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(29, 63, 143, 0.3)";
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }

      if (pointer.active) {
        for (const n of nodes) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < PROXIMITY_RADIUS && dist > 0.01) {
            const force = ((PROXIMITY_RADIUS - dist) / PROXIMITY_RADIUS) * 0.06;
            n.x += (dx / dist) * force;
            n.y += (dy / dist) * force;
          }
        }
      }

      pulses = pulses.filter((p) => time - p.start < PULSE_LIFETIME);

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            let brighten = 0;
            if (pointer.active) {
              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              const dPointer = Math.hypot(midX - pointer.x, midY - pointer.y);
              if (dPointer < PROXIMITY_RADIUS) {
                brighten = 1 - dPointer / PROXIMITY_RADIUS;
              }
            }
            for (const p of pulses) {
              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              const dPulse = Math.hypot(midX - p.x, midY - p.y);
              const age = (time - p.start) / PULSE_LIFETIME;
              if (dPulse < PROXIMITY_RADIUS) {
                brighten = Math.max(brighten, (1 - dPulse / PROXIMITY_RADIUS) * (1 - age));
              }
            }
            const alpha = 0.08 + brighten * 0.32;
            ctx.strokeStyle = `rgba(29, 63, 143, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        let brighten = 0;
        if (pointer.active) {
          const dPointer = Math.hypot(n.x - pointer.x, n.y - pointer.y);
          if (dPointer < PROXIMITY_RADIUS) brighten = 1 - dPointer / PROXIMITY_RADIUS;
        }
        for (const p of pulses) {
          const dPulse = Math.hypot(n.x - p.x, n.y - p.y);
          const age = (time - p.start) / PULSE_LIFETIME;
          if (dPulse < PROXIMITY_RADIUS) {
            brighten = Math.max(brighten, (1 - dPulse / PROXIMITY_RADIUS) * (1 - age));
          }
        }
        const alpha = 0.22 + brighten * 0.55;
        ctx.fillStyle = `rgba(29, 63, 143, ${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + brighten * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    resize();

    if (reducedMotion) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(step);
    }

    const handleResize = () => {
      resize();
      if (reducedMotion) drawStatic();
    };
    window.addEventListener("resize", handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const handlePointerLeave = () => {
      pointer.active = false;
    };
    const handlePointerDown = (e: PointerEvent) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      pulses.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, start: performance.now() });
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("pointerdown", handlePointerDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block", touchAction: "pan-y" }}
    />
  );
}
