'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Closing call-to-action background: "Signal mesh". A loose network of nodes drifts slowly; nodes that come close
 * join with hairlines, and small packets of light travel along those lines from node to node, lighting each one as
 * it arrives (agents passing work to each other). Canvas 2D, light-theme sky and indigo, paused off screen; reduced
 * motion gets one still frame.
 */
type Node = { x: number; y: number; vx: number; vy: number; glow: number; hue: number };
type Packet = { a: number; b: number; t: number; speed: number };

export const PulseMeshBg: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!, cv = canvasRef.current!;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, visible = true, last = 0, link = 150;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let spawn = 0;

    const neighbours = (i: number) => {
      const out: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < link * link) out.push(j);
      }
      return out;
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx * dt; n.y += n.vy * dt;
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
        n.glow = Math.max(0, n.glow - dt * 1.1);
      }
      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > link * link) continue;
          const a = (1 - Math.sqrt(d2) / link) * 0.32;
          ctx.strokeStyle = `rgba(56,189,248,${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
        }
      }
      // packets
      spawn -= dt;
      if (spawn <= 0 && packets.length < 14) {
        spawn = 0.25 + Math.random() * 0.4;
        const a = Math.floor(Math.random() * nodes.length), nb = neighbours(a);
        if (nb.length) packets.push({ a, b: nb[Math.floor(Math.random() * nb.length)], t: 0, speed: 0.55 + Math.random() * 0.5 });
      }
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        const A = nodes[p.a], B = nodes[p.b];
        p.t += dt * p.speed * (150 / Math.max(40, Math.hypot(A.x - B.x, A.y - B.y)));
        if (p.t >= 1) {
          B.glow = 1;
          const nb = neighbours(p.b).filter((j) => j !== p.a);
          if (nb.length && Math.random() < 0.8) { packets[k] = { a: p.b, b: nb[Math.floor(Math.random() * nb.length)], t: 0, speed: p.speed }; }
          else packets.splice(k, 1);
          continue;
        }
        const x = A.x + (B.x - A.x) * p.t, y = A.y + (B.y - A.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, 'rgba(99,102,241,0.55)'); g.addColorStop(1, 'rgba(99,102,241,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
        ctx.fillStyle = '#6366f1'; ctx.beginPath(); ctx.arc(x, y, 2, 0, 6.283); ctx.fill();
      }
      // nodes
      for (const n of nodes) {
        if (n.glow > 0.02) {
          ctx.fillStyle = `rgba(14,165,233,${0.22 * n.glow})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, 6 + n.glow * 10, 0, 6.283); ctx.fill();
        }
        ctx.fillStyle = n.hue ? 'rgba(99,102,241,0.8)' : 'rgba(14,165,233,0.75)';
        ctx.beginPath(); ctx.arc(n.x, n.y, 2.2 + n.glow * 1.5, 0, 6.283); ctx.fill();
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth; h = wrap.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      link = w < 640 ? 110 : 150;
      const count = Math.round((w * h) / (w < 640 ? 9000 : 11000));
      nodes = Array.from({ length: count }, () => {
        const ang = Math.random() * 6.283, sp = 6 + Math.random() * 10;
        return { x: Math.random() * w, y: Math.random() * h, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, glow: 0, hue: Math.random() < 0.3 ? 1 : 0 };
      });
      packets = [];
      if (reduced) draw(0);
    };

    const loop = (t: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    let io: IntersectionObserver | undefined;
    if (!reduced) {
      io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
      });
      io.observe(wrap);
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io?.disconnect(); };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
