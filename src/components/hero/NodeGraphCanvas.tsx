"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  // The node's seeded "home" position — pointer proximity displaces it
  // from here, and a spring pulls it back once the pointer moves away.
  // Without this, repulsion was one-directional: every pass of the mouse
  // nudged nodes further from their original even spread and they never
  // recovered, so the field visibly clumped up the longer a visitor
  // interacted with the hero.
  homeX: number;
  homeY: number;
}

const LINK_DISTANCE = 190;
// Wider than the link distance so the cursor lights up a clearly visible
// cluster of dots + links around it, not just its nearest neighbour.
const PROXIMITY_RADIUS = 210;
const PULSE_LIFETIME = 900; // ms
// How strongly each node is pulled back toward its seeded "home" position
// every frame — this is what makes the pointer-repulsion (and idle drift)
// bounded instead of a permanent, cumulative displacement.
const SPRING_STRENGTH = 0.025;

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
      // Even distribution: lay the nodes on a grid, then jitter each one
      // within its own cell. Pure Math.random() placement (the previous
      // approach) clumps in some regions and leaves bare patches in
      // others — this keeps the field uniformly spread "all around" while
      // still looking organic rather than mechanically gridded.
      const target = Math.max(50, Math.min(140, Math.round(area / 4500)));
      const aspect = width / Math.max(height, 1);
      const cols = Math.max(1, Math.round(Math.sqrt(target * aspect)));
      const rows = Math.max(1, Math.ceil(target / cols));
      const cellW = width / cols;
      const cellH = height / rows;
      // Jitter stays within ~70% of the cell so neighbours never collide
      // yet the rows/columns don't read as a rigid lattice.
      const jitterX = cellW * 0.35;
      const jitterY = cellH * 0.35;

      nodes = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = (col + 0.5) * cellW;
          const baseY = (row + 0.5) * cellH;
          const homeX = baseX + (Math.random() * 2 - 1) * jitterX;
          const homeY = baseY + (Math.random() * 2 - 1) * jitterY;
          nodes.push({
            x: homeX,
            y: homeY,
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1,
            r: 1.1 + Math.random() * 1,
            homeX,
            homeY,
          });
        }
      }
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
        // Spring back toward the seeded home position — bounds both the
        // idle drift above and the pointer repulsion below, so the field
        // always resettles to its original even spread instead of
        // accumulating a permanent displacement the longer someone
        // interacts with the hero.
        n.x += (n.homeX - n.x) * SPRING_STRENGTH;
        n.y += (n.homeY - n.y) * SPRING_STRENGTH;
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
            const alpha = 0.06 + brighten * 0.6;
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
        const alpha = 0.18 + brighten * 0.78;
        ctx.fillStyle = `rgba(29, 63, 143, ${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + brighten * 2.6, 0, Math.PI * 2);
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
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only treat the pointer as active while it's actually over the
      // canvas's box. Listening on window (rather than the canvas itself)
      // means the highlight still tracks the cursor where the district
      // map or text column sit on top of the canvas — those overlays no
      // longer "block" the effect.
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      pointer = { x, y, active: inside };
    };
    const handlePointerDown = (e: PointerEvent) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
      pulses.push({ x, y, start: performance.now() });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
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
