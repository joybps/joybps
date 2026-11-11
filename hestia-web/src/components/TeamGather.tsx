'use client';

import React, { useEffect, useRef } from 'react';

/**
 * "Bring your whole team into one place": faces drift in from the edges and settle into two slowly
 * turning rings around the message, joined by thin links. Pulses hop between neighbours like
 * updates passing between teammates. Canvas 2D; runs only while on screen.
 */

const SPEED = 0.35;
const FILES = [
  'w5', 'm11', 'w12', 'm22', 'w21', 'm32', 'w30', 'm45', 'w44', 'm52', 'w53', 'm61',
  'w62', 'm75', 'w71', 'm83', 'w79', 'm91', 'w88', 'm4', 'w9', 'm17', 'w18', 'm28',
].map((n) => `/avatars/${n}.jpg`);

const RINGS = [
  { n: 9, rx: 0.3, ry: 0.3, w: 0.06, r: 15, color: '99,102,241' },
  { n: 15, rx: 0.45, ry: 0.42, w: -0.04, r: 18, color: '14,165,233' },
];

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));

export const TeamGather: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    interface P { ring: number; i: number; a0: number; sx: number; sy: number; img: HTMLImageElement; x: number; y: number }
    const people: P[] = [];
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    let idx = 0;
    RINGS.forEach((rg, k) => {
      for (let i = 0; i < rg.n; i++) {
        const im = new Image();
        im.decoding = 'async';
        im.src = FILES[idx % FILES.length];
        im.onload = () => {
          if (!running) draw(performance.now());
        };
        // start just outside the left or right edge, at a random height
        const fromLeft = (idx + k) % 2 === 0;
        people.push({ ring: k, i, a0: (i / rg.n) * Math.PI * 2 + k * 0.7, sx: fromLeft ? -0.08 : 1.08, sy: 0.1 + rnd() * 0.8, img: im, x: 0, y: 0 });
        idx++;
      }
    });

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let startT = -1;
    let hop = 0;
    let nextHop = 0;
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    function draw(now: number) {
      if (startT < 0) startT = now;
      const real = (now - startT) / 1000;
      const t = real * SPEED;
      const p = reduced ? 1 : ease((real - 0.2) / 2.8);
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(1, w / 1100);
      ctx.clearRect(0, 0, w, h);

      // positions
      for (const pe of people) {
        const rg = RINGS[pe.ring];
        const ang = pe.a0 + t * rg.w * 3;
        const ox = cx + Math.cos(ang) * rg.rx * w;
        const oy = cy + Math.sin(ang) * rg.ry * h;
        const sx = pe.sx * w;
        const sy = pe.sy * h;
        let x = sx + (ox - sx) * p;
        let y = sy + (oy - sy) * p;
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          const k = (1 - d / 130) * 0.12;
          x += dx * k;
          y += dy * k;
        }
        pe.x = x;
        pe.y = y;
      }

      // links between neighbours on each ring, and from inner ring out to the nearest outer person
      if (p > 0.02) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(14,165,233,${0.2 * p})`;
        ctx.beginPath();
        let base = 0;
        RINGS.forEach((rg) => {
          for (let i = 0; i < rg.n; i++) {
            const a = people[base + i];
            const b = people[base + ((i + 1) % rg.n)];
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
          base += rg.n;
        });
        ctx.stroke();

        ctx.strokeStyle = `rgba(99,102,241,${0.14 * p})`;
        ctx.beginPath();
        const inner = RINGS[0].n;
        for (let i = 0; i < inner; i++) {
          const a = people[i];
          let best = inner;
          let bd = 1e9;
          for (let j = inner; j < people.length; j++) {
            const d = (a.x - people[j].x) ** 2 + (a.y - people[j].y) ** 2;
            if (d < bd) {
              bd = d;
              best = j;
            }
          }
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(people[best].x, people[best].y);
        }
        ctx.stroke();
      }

      // a glowing pulse hops along the outer ring
      if (p >= 1 && !reduced) {
        if (real > nextHop) {
          hop = real;
          nextHop = real + 2.2;
        }
        const f = (real - hop) / 1.2;
        if (f >= 0 && f < 1) {
          const rg = RINGS[1];
          const startIdx = RINGS[0].n + (Math.floor(hop * 3) % rg.n);
          const a = people[startIdx];
          const b = people[RINGS[0].n + ((startIdx - RINGS[0].n + 1) % rg.n)];
          const e = ease(f);
          const x = a.x + (b.x - a.x) * e;
          const y = a.y + (b.y - a.y) * e;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
          g.addColorStop(0, 'rgba(14,165,233,0.9)');
          g.addColorStop(1, 'rgba(14,165,233,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 14, 0, 6.2832);
          ctx.fill();
        }
      }

      // faces
      for (const pe of people) {
        const rg = RINGS[pe.ring];
        const r = Math.max(10, rg.r * (0.55 + 0.45 * scale)) * (0.75 + 0.25 * p);
        // fade faces that would sit behind the message
        const behindText = Math.abs(pe.x - cx) < Math.min(380, w * 0.46) && Math.abs(pe.y - cy) < 150;
        const alpha = (behindText ? 0.28 : 1) * (0.5 + 0.5 * p);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.arc(pe.x, pe.y, r + 3, 0, 6.2832);
        ctx.fill();
        if (pe.img.complete && pe.img.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(pe.x, pe.y, r, 0, 6.2832);
          ctx.clip();
          ctx.drawImage(pe.img, pe.x - r, pe.y - r, r * 2, r * 2);
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(${rg.color},0.8)`;
          ctx.beginPath();
          ctx.arc(pe.x, pe.y, r, 0, 6.2832);
          ctx.fill();
        }
        ctx.strokeStyle = `rgba(${rg.color},0.9)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pe.x, pe.y, r + 0.5, 0, 6.2832);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    const loop = (now: number) => {
      draw(now);
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
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const z = r.width / (canvas.clientWidth || 1) || 1;
      mouse.x = (e.clientX - r.left) / z;
      mouse.y = (e.clientY - r.top) / z;
    };
    const onLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };

    resize();
    draw(performance.now());
    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(performance.now());
    });
    ro.observe(canvas);
    // the "gathering" should play when the section is actually seen, so restart the clock on entry
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (startT < 0 || !running) startT = performance.now();
          start();
        } else stop();
      },
      { rootMargin: '0px', threshold: 0.2 },
    );
    io.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerleave', onLeave);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
};
