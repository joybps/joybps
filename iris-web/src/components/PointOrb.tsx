'use client';

import React, { useEffect, useRef } from 'react';

interface PointOrbProps {
  /** Live "voice level" 0..1. The orb swells and ripples harder as it rises. */
  amp?: { current: number };
  className?: string;
  /** Approximate number of points on a large screen. */
  density?: number;
}

/** Colour ramp from cyan through sky blue to indigo. Index 0..BUCKETS-1. */
const BUCKETS = 8;
const RAMP = ['#22d3ee', '#06b6d4', '#0ea5e9', '#0284c7', '#3b82f6', '#4f46e5', '#6366f1', '#7c3aed'];

/**
 * A 3D point-cloud sphere whose surface morphs like liquid and reacts to a voice-level value,
 * drawn on a 2D canvas (no WebGL needed). Runs only while visible; reduced-motion users get one still frame.
 */
export const PointOrb: React.FC<PointOrbProps> = ({ amp, className = '', density = 3400 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let N = 0;
    let dirs = new Float32Array(0); // unit vectors x,y,z per point
    let seeds = new Float32Array(0);

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // fewer points on small screens
      N = Math.round(density * Math.min(1, Math.max(0.45, w / 560)));
      dirs = new Float32Array(N * 3);
      seeds = new Float32Array(N);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = golden * i;
        dirs[i * 3] = Math.cos(th) * r;
        dirs[i * 3 + 1] = y;
        dirs[i * 3 + 2] = Math.sin(th) * r;
        seeds[i] = (i * 0.6180339) % 1;
      }
    };

    const ro = new ResizeObserver(() => {
      build();
      if (reduce || !running) draw(1.2);
    });
    ro.observe(canvas);

    // pointer (in canvas px), eased
    const mouse = { x: -999, y: -999, tx: -999, ty: -999, active: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      mouse.active = 1;
    };
    const onLeave = () => (mouse.active = 0);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    // Adaptive quality: if drawing is slow on this machine, render every 2nd/3rd/4th point (slightly larger) instead.
    let stride = 1;
    let sizeBoost = 1;
    let ema = 0;
    let frames = 0;

    const bucketPaths: number[][] = Array.from({ length: BUCKETS }, () => []);

    // Overall animation speed (1 = original). Lower is slower and calmer.
    const SPEED = 0.22;
    let smoothLevel = 0.25;

    const draw = (time: number) => {
      const t = time * SPEED;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.34;
      // ease the voice level so the orb glides between states instead of snapping
      smoothLevel += ((amp ? amp.current : 0.25) - smoothLevel) * 0.025;
      const level = smoothLevel;

      // eased pointer
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;

      const rotY = t * 0.22;
      const rotX = 0.35 + Math.sin(t * 0.25) * 0.12 + ((mouse.active ? mouse.y - cy : 0) / h) * 0.25;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const swell = 0.14 + level * 0.34;
      const fov = 3.2;

      for (let b = 0; b < BUCKETS; b++) bucketPaths[b].length = 0;

      // [x, y, size, alpha] pushed per bucket as a flat list
      for (let i = 0; i < N; i += stride) {
        const dx = dirs[i * 3];
        const dy = dirs[i * 3 + 1];
        const dz = dirs[i * 3 + 2];

        // liquid surface: layered travelling waves in 3D
        const n =
          Math.sin(dx * 2.3 + t * 0.9) * Math.cos(dy * 2.1 - t * 0.7) +
          Math.sin(dz * 3.1 + t * 1.15 + dx * 1.3) * 0.7 +
          Math.cos((dx + dy + dz) * 2.4 - t * 0.6) * 0.5;
        const ripple = Math.sin(dy * 9 - t * (2 + level * 5)) * level * 0.08;
        const rad = R * (1 + n * swell * 0.5 + ripple);

        // rotate Y then X
        let x = dx * rad;
        let y = dy * rad;
        let z = dz * rad;
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        x = x1;
        y = y2;
        z = z2;

        const persp = fov / (fov + z / R);
        let px = cx + x * persp;
        let py = cy + y * persp;
        const depth = (z / R + 1.4) / 2.8; // ~0 back .. 1 front

        // cursor bulge
        if (mouse.active) {
          const mdx = px - mouse.x;
          const mdy = py - mouse.y;
          const d2 = mdx * mdx + mdy * mdy;
          if (d2 < 9000) {
            const f = (1 - d2 / 9000) * 14;
            const d = Math.sqrt(d2) || 1;
            px += (mdx / d) * f;
            py += (mdy / d) * f;
          }
        }

        const size = (0.45 + depth * 1.45) * (0.85 + seeds[i] * 0.3) * (1 + level * 0.25) * sizeBoost;
        const alpha = 0.2 + depth * 0.8;
        // colour by height + wave so colour flows over the surface
        const c = Math.min(BUCKETS - 1, Math.max(0, Math.floor(((dy * 0.55 + n * 0.25 + 0.5 + Math.sin(t * 0.3) * 0.1) * BUCKETS))));
        const list = bucketPaths[c];
        list.push(px, py, size, alpha);
      }

      for (let b = 0; b < BUCKETS; b++) {
        const list = bucketPaths[b];
        if (!list.length) continue;
        ctx.fillStyle = RAMP[b];
        // draw in two alpha tiers (cheap) instead of one path per dot alpha
        for (let tier = 0; tier < 2; tier++) {
          ctx.globalAlpha = tier === 0 ? 0.32 : 0.95;
          ctx.beginPath();
          for (let k = 0; k < list.length; k += 4) {
            const front = list[k + 3] > 0.55;
            if ((tier === 1) !== front) continue;
            ctx.moveTo(list[k] + list[k + 2], list[k + 1]);
            ctx.arc(list[k], list[k + 1], list[k + 2], 0, Math.PI * 2);
          }
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    let running = false;
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const began = performance.now();
      draw((now - t0) / 1000 + 1.2);
      ema = ema * 0.9 + (performance.now() - began) * 0.1;
      if (++frames > 40 && ema > 6 && stride < 4) {
        stride++;
        sizeBoost = Math.sqrt(stride) * 0.85;
        ema = 0;
        frames = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    build();
    draw(1.2);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.05 });
    io.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [amp, density]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};
