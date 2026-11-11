'use client';

import React, { useEffect, useRef } from 'react';

/**
 * "Connecting people in one place": 36 people start scattered, then ease into orbit around a central hub
 * and connect to it. Soft pulses travel along the links to the hub, like requests and updates arriving.
 * Canvas 2D, only runs while on screen, one still frame for reduced motion.
 */

const SPEED = 0.5; // overall motion speed, lower is calmer
const RINGS = [
  { n: 8, r: 0.2, w: 0.07, size: 12.5, color: '14,165,233' },
  { n: 12, r: 0.32, w: -0.05, size: 14, color: '99,102,241' },
  { n: 16, r: 0.44, w: 0.035, size: 12.5, color: '139,92,246' },
];

// boy and girl portraits (self-hosted in /public/avatars), alternating so the mix looks natural
const AVATAR_FILES = [
  'm11', 'w5', 'm22', 'w12', 'm32', 'w21', 'm45', 'w30', 'm52', 'w44', 'm61', 'w53', 'm75', 'w62', 'm83', 'w71',
  'm91', 'w79', 'm4', 'w88', 'm17', 'w9', 'm28', 'w18', 'm36', 'w26', 'm48', 'w37', 'm58', 'w49', 'm66', 'w57',
].map((n) => `/avatars/${n}.jpg`);

interface Person {
  ring: number;
  a0: number;
  sx: number; // scatter position (0..1)
  sy: number;
  sp: number; // scatter drift phase
  rj: number; // radius jitter
}

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));

function makePeople(): Person[] {
  // deterministic pseudo-random so server/client markup never differs
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const out: Person[] = [];
  RINGS.forEach((rg, k) => {
    for (let i = 0; i < rg.n; i++) {
      out.push({ ring: k, a0: (i / rg.n) * Math.PI * 2 + k * 0.5, sx: 0.04 + rnd() * 0.92, sy: 0.04 + rnd() * 0.92, sp: rnd() * 6.28, rj: (rnd() - 0.5) * 0.03 });
    }
  });
  return out;
}

interface Props {
  className?: string;
  /** Called whenever a pulse reaches the hub. */
  onPulse?: (index: number) => void;
}

export const ConstellationCanvas: React.FC<Props> = ({ className = '', onPulse }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const pulseCb = useRef(onPulse);
  pulseCb.current = onPulse;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const people = makePeople();
    const imgs = AVATAR_FILES.map((src) => {
      const im = new Image();
      im.decoding = 'async';
      im.src = src;
      // when a portrait finishes loading, repaint if the loop isn't running (e.g. reduced motion)
      im.onload = () => {
        if (!running) draw(performance.now());
      };
      return im;
    });
    const pos = people.map(() => ({ x: 0, y: 0 }));
    const pulses: { i: number; t0: number }[] = [];
    const ripples: number[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let startT = -1;
    let nextPulse = 0;
    let pulseCount = 0;
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      if (startT < 0) startT = now;
      const t = ((now - startT) / 1000) * SPEED;
      const real = (now - startT) / 1000;
      // intro: scattered -> connected, begins after a short beat
      const p = reduced ? 1 : ease((real - 0.5) / 3.2);
      const S = Math.min(w, h);
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      // hub glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.2);
      g.addColorStop(0, 'rgba(56,189,248,0.32)');
      g.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, S * 0.2, 0, 6.2832);
      ctx.fill();

      // positions
      for (let i = 0; i < people.length; i++) {
        const pe = people[i];
        const rg = RINGS[pe.ring];
        const ang = pe.a0 + t * rg.w * 3;
        const rr = (rg.r + pe.rj) * S;
        const ox = cx + Math.cos(ang) * rr;
        const oy = cy + Math.sin(ang) * rr;
        const sx = pe.sx * w + Math.sin(t * 0.9 + pe.sp) * 10;
        const sy = pe.sy * h + Math.cos(t * 0.8 + pe.sp) * 10;
        let x = sx + (ox - sx) * p;
        let y = sy + (oy - sy) * p;
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const d = Math.hypot(dx, dy);
        if (d < 150) {
          const k = (1 - d / 150) * 0.14;
          x += dx * k;
          y += dy * k;
        }
        pos[i].x = x;
        pos[i].y = y;
      }

      // links to the hub (drawn out from the hub as p grows) and between neighbours
      if (p > 0.02) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(14,165,233,${0.2 * p})`;
        ctx.beginPath();
        for (let i = 0; i < people.length; i++) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + (pos[i].x - cx) * p, cy + (pos[i].y - cy) * p);
        }
        ctx.stroke();

        ctx.strokeStyle = `rgba(99,102,241,${0.16 * p})`;
        ctx.beginPath();
        let base = 0;
        for (let k = 0; k < RINGS.length; k++) {
          const n = RINGS[k].n;
          for (let i = 0; i < n; i++) {
            const a = pos[base + i];
            const b = pos[base + ((i + 1) % n)];
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
          base += n;
        }
        ctx.stroke();
      }

      // pulses travelling to the hub
      if (p >= 1 && !reduced) {
        if (real > nextPulse) {
          pulses.push({ i: (pulseCount * 7 + 3) % people.length, t0: real });
          pulseCount++;
          nextPulse = real + 1.5;
        }
        for (let k = pulses.length - 1; k >= 0; k--) {
          const pu = pulses[k];
          const f = (real - pu.t0) / 1.4;
          if (f >= 1) {
            pulses.splice(k, 1);
            ripples.push(real);
            pulseCb.current?.(pulseCount);
            continue;
          }
          const e = ease(f);
          const from = pos[pu.i];
          const x = from.x + (cx - from.x) * e;
          const y = from.y + (cy - from.y) * e;
          const gl = ctx.createRadialGradient(x, y, 0, x, y, 16);
          gl.addColorStop(0, 'rgba(14,165,233,0.85)');
          gl.addColorStop(1, 'rgba(14,165,233,0)');
          ctx.fillStyle = gl;
          ctx.beginPath();
          ctx.arc(x, y, 16, 0, 6.2832);
          ctx.fill();
        }
        for (let k = ripples.length - 1; k >= 0; k--) {
          const f = (real - ripples[k]) / 1.4;
          if (f >= 1) {
            ripples.splice(k, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(14,165,233,${0.4 * (1 - f)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, S * 0.07 + f * S * 0.12, 0, 6.2832);
          ctx.stroke();
        }
      }

      // people: round portraits with a coloured ring
      const unit = S / 540;
      for (let i = 0; i < people.length; i++) {
        const rg = RINGS[people[i].ring];
        const { x, y } = pos[i];
        const r = Math.max(7, rg.size * unit) * (0.8 + 0.2 * p);
        const im = imgs[i % imgs.length];
        // soft white halo + ring
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.arc(x, y, r + 3, 0, 6.2832);
        ctx.fill();
        if (im.complete && im.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.2832);
          ctx.clip();
          ctx.globalAlpha = 0.55 + 0.45 * p;
          ctx.drawImage(im, x - r, y - r, r * 2, r * 2);
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(${rg.color},0.8)`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.2832);
          ctx.fill();
        }
        ctx.strokeStyle = `rgba(${rg.color},${0.5 + 0.5 * p})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, r + 0.5, 0, 6.2832);
        ctx.stroke();
      }
    };

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
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '80px' });
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
