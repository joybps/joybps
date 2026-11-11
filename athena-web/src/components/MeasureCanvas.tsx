'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Quiet background for the quote: dimension lines with end ticks and measurement labels drift slowly across a faint
 * blueprint grid. Canvas 2D, runs only while on screen, static frame for reduced motion.
 */

const LABELS = ['12 ft', '240 sq ft', '6 nos', '8 ft', '420 sq ft', '3 units', '15 ft', '90 sq ft', '4 nos', '24 ft'];

interface Mark {
  x: number;
  y: number;
  len: number;
  vert: boolean;
  vx: number;
  vy: number;
  ph: number;
  label: string;
  amber: boolean;
}

export const MeasureCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
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
    let marks: Mark[] = [];

    let seed = 41;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    const layout = () => {
      seed = 41;
      const n = w < 640 ? 7 : 12;
      marks = Array.from({ length: n }, (_, i) => {
        const vert = rnd() < 0.3;
        return {
          x: rnd() * w,
          y: rnd() * h,
          len: 70 + rnd() * 110,
          vert,
          vx: vert ? 0 : (rnd() < 0.5 ? -1 : 1) * (6 + rnd() * 8),
          vy: vert ? (rnd() < 0.5 ? -1 : 1) * (6 + rnd() * 8) : (rnd() - 0.5) * 3,
          ph: rnd() * 6.28,
          label: LABELS[i % LABELS.length],
          amber: rnd() < 0.4,
        };
      });
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

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // faint blueprint grid
      ctx.strokeStyle = 'rgba(125,211,252,0.16)';
      ctx.lineWidth = 1;
      const step = 56;
      const off = (clock * 3) % step;
      ctx.beginPath();
      for (let x = -off; x < w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = -off; y < h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();

      ctx.font = '600 11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const m of marks) {
        const pad = m.len + 60;
        const px = ((m.x + m.vx * clock + pad) % (w + pad * 2) + (w + pad * 2)) % (w + pad * 2) - pad;
        const py = ((m.y + m.vy * clock + pad) % (h + pad * 2) + (h + pad * 2)) % (h + pad * 2) - pad;
        const edge = Math.min(px, w - px, py, h - py);
        const a = Math.max(0, Math.min(1, (edge + 40) / 120)) * (0.8 + 0.2 * Math.sin(clock * 0.8 + m.ph));
        const col = m.amber ? '217,119,6' : '14,165,233';
        ctx.save();
        ctx.translate(px, py);
        if (m.vert) ctx.rotate(Math.PI / 2);
        ctx.globalAlpha = a;
        ctx.strokeStyle = `rgb(${col})`;
        ctx.lineWidth = 1.3;
        const half = m.len / 2;
        ctx.beginPath();
        ctx.moveTo(-half, 0); ctx.lineTo(half, 0);
        ctx.moveTo(-half, -6); ctx.lineTo(-half, 6);
        ctx.moveTo(half, -6); ctx.lineTo(half, 6);
        ctx.stroke();
        // label on a small white chip so the line never crosses the text
        const tw = ctx.measureText(m.label).width + 12;
        ctx.fillStyle = '#fff';
        ctx.fillRect(-tw / 2, -9, tw, 18);
        ctx.fillStyle = `rgb(${col})`;
        if (m.vert) ctx.rotate(-Math.PI / 2 * 0); // label stays along the line
        ctx.fillText(m.label, 0, 0.5);
        ctx.restore();
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
