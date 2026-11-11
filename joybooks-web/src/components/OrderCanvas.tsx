'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Chaos to order. Loose, tilted documents drift around at random, then sweep left to right into neat ledger rows
 * and get ticked off, then scatter again. Canvas 2D, runs only while on screen.
 */

const HOLD_CHAOS = 2.6;
const TO_ORDER = 2.6;
const HOLD_ORDER = 3.6;
const TO_CHAOS = 1.5;
const CYCLE = HOLD_CHAOS + TO_ORDER + HOLD_ORDER + TO_CHAOS;

interface Doc {
  bx: number; // chaos base position (0..1)
  by: number;
  amp: number;
  sp: number;
  ph: number;
  rot: number;
  hue: number;
}

const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));

export const OrderCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let clock = 0;
    let docs: Doc[] = [];
    let grid: { x: number; y: number; row: number; col: number }[] = [];
    let cols = 1;
    let dw = 40;
    let dh = 50;

    let seed = 23;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    const layout = () => {
      const small = w < 640;
      dw = small ? 28 : 42;
      dh = dw * 1.28;
      const gapX = small ? 8 : 14;
      const gapY = small ? 10 : 16;
      cols = Math.max(3, Math.min(24, Math.floor((w - 24) / (dw + gapX))));
      const rows = small ? 5 : 4;
      const n = cols * rows;
      const totalW = cols * dw + (cols - 1) * gapX;
      const totalH = rows * dh + (rows - 1) * gapY;
      const x0 = (w - totalW) / 2 + dw / 2;
      const y0 = (h - totalH) / 2 + dh / 2;
      grid = Array.from({ length: n }, (_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        return { x: x0 + col * (dw + gapX), y: y0 + row * (dh + gapY), row, col };
      });
      seed = 23;
      docs = Array.from({ length: n }, () => ({
        bx: 0.03 + rnd() * 0.94,
        by: 0.05 + rnd() * 0.9,
        amp: 10 + rnd() * 26,
        sp: 0.35 + rnd() * 0.6,
        ph: rnd() * 6.28,
        rot: (rnd() - 0.5) * 1.3,
        hue: Math.floor(rnd() * 3),
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
    };

    const rr = (x: number, y: number, rw: number, rh: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx.arcTo(x, y + rh, x, y, r);
      ctx.arcTo(x, y, x + rw, y, r);
      ctx.closePath();
    };

    // the global state of the cycle: 0 = chaos, 1 = order, with a per-document delay for the sweep
    const mixFor = (t: number, delay: number) => {
      const ph = t % CYCLE;
      if (ph < HOLD_CHAOS) return 0;
      if (ph < HOLD_CHAOS + TO_ORDER) return ease((ph - HOLD_CHAOS - delay * 1.1) / (TO_ORDER - 1.1));
      if (ph < HOLD_CHAOS + TO_ORDER + HOLD_ORDER) return 1;
      const k = ph - HOLD_CHAOS - TO_ORDER - HOLD_ORDER;
      return 1 - ease((k - delay * 0.4) / (TO_CHAOS - 0.4));
    };

    const CHAOS_STROKE = [
      [148, 163, 184],
      [245, 158, 11],
      [56, 189, 248],
    ];

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const staticOrder = reduced;
      // ledger rules fade in as the rows form
      let avg = 0;
      for (let i = 0; i < docs.length; i++) avg += staticOrder ? 1 : mixFor(clock, grid[i].col / cols);
      avg /= Math.max(1, docs.length);
      if (avg > 0.02) {
        ctx.strokeStyle = `rgba(125,211,252,${0.5 * avg})`;
        ctx.lineWidth = 1;
        const rows = Math.ceil(docs.length / cols);
        for (let r = 0; r < rows; r++) {
          const y = grid[r * cols].y + dh / 2 + 7;
          ctx.beginPath();
          ctx.moveTo(grid[r * cols].x - dw / 2 - 6, y);
          ctx.lineTo(grid[Math.min(docs.length - 1, r * cols + cols - 1)].x + dw / 2 + 6, y);
          ctx.stroke();
        }
      }

      for (let i = 0; i < docs.length; i++) {
        const d = docs[i];
        const g = grid[i];
        const m = staticOrder ? 1 : mixFor(clock, g.col / cols);
        const cxp = d.bx * w + Math.sin(clock * d.sp + d.ph) * d.amp;
        const cyp = d.by * h + Math.cos(clock * d.sp * 0.8 + d.ph) * d.amp;
        const x = cxp + (g.x - cxp) * m;
        const y = cyp + (g.y - cyp) * m;
        const rot = (d.rot + Math.sin(clock * d.sp + d.ph) * 0.18) * (1 - m);
        const sc = 1 + (1 - m) * 0.12 * Math.sin(d.ph + clock);

        const c0 = CHAOS_STROKE[d.hue];
        const sr = Math.round(c0[0] + (16 - c0[0]) * m);
        const sg = Math.round(c0[1] + (185 - c0[1]) * m);
        const sb = Math.round(c0[2] + (129 - c0[2]) * m);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.scale(sc, sc);
        ctx.globalAlpha = 0.55 + 0.4 * m;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = `rgb(${sr},${sg},${sb})`;
        ctx.lineWidth = 1.4;
        ctx.shadowColor = 'rgba(14,116,144,0.12)';
        ctx.shadowBlur = 8;
        rr(-dw / 2, -dh / 2, dw, dh, 5);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.stroke();
        ctx.fillStyle = `rgba(${sr},${sg},${sb},0.45)`;
        ctx.fillRect(-dw / 2 + 5, -dh / 2 + 7, dw - 10, 2);
        ctx.fillRect(-dw / 2 + 5, -dh / 2 + 13, (dw - 10) * 0.7, 2);
        ctx.fillRect(-dw / 2 + 5, dh / 2 - 12, (dw - 10) * 0.45, 3);
        ctx.restore();

        // tick badge once the document is in its place
        if (m > 0.92) {
          const k = Math.min(1, (m - 0.92) / 0.08);
          ctx.save();
          ctx.translate(g.x + dw / 2 - 2, g.y - dh / 2 + 2);
          ctx.scale(k, k);
          ctx.globalAlpha = 0.95;
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(0, 0, dw * 0.2, 0, 6.2832);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.6;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          const s = dw * 0.09;
          ctx.beginPath();
          ctx.moveTo(-s, 0);
          ctx.lineTo(-s * 0.2, s * 0.8);
          ctx.lineTo(s, -s * 0.7);
          ctx.stroke();
          ctx.restore();
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      clock += dt;
      draw();
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw();
    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '80px' });
    io.observe(canvas);
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
};
