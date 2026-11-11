'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Flowing dotted sound-wave ribbon, drawn on a canvas.
 * Several layers of dots ride overlapping sine waves, like a voice signal.
 * Only animates while on screen; draws a single still frame for reduced motion.
 */
const LAYERS = 16;
const SPEED = 0.28; // overall flow speed, lower is calmer

// sky -> indigo -> violet, one colour per layer
const COLORS = ['14,165,233', '34,158,238', '56,148,240', '79,140,240', '99,120,240', '99,102,241', '119,98,240', '139,92,246', '168,85,247'];

export const WaveField: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const t = (time / 1000) * SPEED;
      ctx.clearRect(0, 0, w, h);
      const step = w < 640 ? 7 : 6;
      const cy = h * 0.5;
      const amp = Math.min(h * 0.36, 160);

      for (let l = 0; l < LAYERS; l++) {
        const depth = l / (LAYERS - 1); // 0 back, 1 front
        const spread = (depth - 0.5) * amp * 1.15;
        const phase = l * 0.55;
        const freq = 1 + (l % 4) * 0.18; // each layer waves a little differently
        const drift = 1.1 + (l % 3) * 0.2;
        const layerAmp = amp * (0.45 + 0.55 * Math.sin(l * 1.3 + 0.8) ** 2);
        const color = COLORS[l % COLORS.length];
        const r = 0.8 + depth * 1.0;
        const waveY = (nx: number) =>
          cy +
          spread +
          (Math.sin(nx * 6.2 * freq + t * 1.6 + phase) * 0.55 +
            Math.sin(nx * 11.5 * freq - t * drift + phase * 1.7) * 0.3 +
            Math.sin(nx * 3.1 + t * 0.7 + phase * 0.5) * 0.45) *
            layerAmp *
            // soft fade near both ends so the ribbon melts into the page
            Math.sin(Math.PI * nx) ** 0.6;

        ctx.fillStyle = `rgba(${color},${0.32 + depth * 0.5})`;
        ctx.beginPath();
        for (let x = 0; x <= w; x += step) {
          const y = waveY(x / w);
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, 6.2832);
        }
        ctx.fill();

        // a few thin lines tracing the wave, like light travelling along the signal
        if (l % 5 === 2) {
          ctx.strokeStyle = `rgba(${color},0.35)`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let x = 0; x <= w; x += step * 2) {
            const y = waveY(x / w);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
    };

    const loop = (time: number) => {
      draw(time);
      if (running) raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(0);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(0);
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
