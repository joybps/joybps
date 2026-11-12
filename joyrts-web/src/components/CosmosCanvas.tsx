'use client';

import React, { useEffect, useRef } from 'react';

/**
 * CosmosCanvas: "Neural Cosmos" hero background. Plain canvas 2D, no WebGL, no scroll input.
 *
 * HOW IT WORKS (read this first if you are copying the effect)
 *  1. GALAXY.  Every particle has a fixed spiral-galaxy position (radius, arm angle, small thickness). Each frame the whole
 *     disc is rotated about its axis, tilted towards the viewer and perspective-projected to 2D. That is the drifting galaxy.
 *  2. WORDS.   An offscreen canvas draws a word in big bold type; we read its pixels and keep the points inside the glyphs.
 *     Every "word" particle owns one random target point per word (see `tgt`). Sampling text pixels is the whole trick.
 *  3. MORPH.   One global value G (0..1) runs a small state machine: gather -> hold -> scatter -> next word. A particle's own
 *     progress is e = smoothstep(G - delay). Its position is lerp(galaxyPos, wordPos, e) plus a sideways swirl of sin(pi*e),
 *     so stars curve in along arcs instead of flying in straight lines.
 *  4. COLOUR.  A particle that has landed switches to a blue gradient chosen by its left-to-right position in the word.
 *  5. EXTRAS.  A few brighter "knowledge stars" glow; the pointer is a gravity well (word particles
 *     are pushed away, dust is pulled in; both spring back because positions are recomputed every frame from the base state);
 *     a comet crosses now and then.
 * Performance: one rect per particle, DPR capped at 2, half the particles on phones, the loop pauses off screen or in a
 * hidden tab. Reduced motion: a single still frame with the first word formed.
 */

const WORDS = ['Joyrts', 'Agents', 'Automation', 'Insight'];
const HOLD = [4.4, 2.8, 2.8, 2.8];
const GATHER = 1.8;
const SCATTER = 1.1;
const PALETTE = ['#38bdf8', '#818cf8', '#a78bfa', '#0284c7', '#4f46e5', '#0ea5e9'];
// blue gradient the finished word is drawn in: sky-500 -> sky-600 -> blue-600 (the same blues as the headline accent)
const GRAD = (() => {
  const stops = [[14, 165, 233], [2, 132, 199], [37, 99, 235]];
  return Array.from({ length: 12 }, (_, i) => {
    const f = (i / 11) * 2, s = Math.min(1, Math.floor(f)), u = f - s;
    const a = stops[s], b = stops[Math.min(2, s + 1)];
    return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * u)).join(',')})`;
  });
})();
const TILT = 0.5; // radians the galaxy disc leans towards the viewer
const sinT = Math.sin(TILT), cosT = Math.cos(TILT);

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const smooth = (x: number) => { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); };
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

interface Props {
  rootRef: React.RefObject<HTMLElement | null>;
  /** Empty element in the layout; the words are formed in its box so the canvas and the DOM copy stay aligned. */
  anchorRef: React.RefObject<HTMLElement | null>;
}

export const CosmosCanvas: React.FC<Props> = ({ rootRef, anchorRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current, root = rootRef.current, anchor = anchorRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !root || !anchor || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = root.clientWidth < 700;

    // ---- particles (typed arrays keep the frame loop allocation-free) ----
    const ND = small ? 900 : 2600; // dust
    const NT = small ? 2200 : 5200; // word particles (dense enough that the letters read as solid)
    const N = ND + NT;
    const A = new Float32Array(N), Rr = new Float32Array(N), Yy = new Float32Array(N), Dl = new Float32Array(N);
    const Sz = new Float32Array(N), Al = new Float32Array(N), Col = new Uint8Array(N);
    const tgt = new Float32Array(NT * WORDS.length * 2);
    for (let i = 0; i < N; i++) {
      const word = i >= ND;
      const rr = Math.pow(Math.random(), word ? 0.8 : 0.62);
      A[i] = ((Math.random() * 3) | 0) * 2.0944 + rr * 5.4 + gauss() * (0.62 - rr * 0.2); // 3 spiral arms
      Rr[i] = rr;
      Yy[i] = gauss() * 0.06 * (1.1 - rr * 0.7);
      Dl[i] = Math.random();
      Sz[i] = word ? 1.5 + Math.random() * 0.9 : 1.1 + Math.random() * 1.9;
      Al[i] = word ? 0.45 + Math.random() * 0.35 : 0.35 + Math.random() * 0.55;
      Col[i] = word ? 3 + (i % 3) : (Math.random() * 3) | 0;
    }
    const K = small ? 34 : 64; // knowledge stars = first K dust particles
    const sxs = new Float32Array(K), sys = new Float32Array(K);
    // which step of the blue gradient each particle takes, per word (set when the words are sampled)
    const gradBin = new Uint8Array(NT * WORDS.length);
    let shock: { x: number; y: number; t: number } | null = null;
    // soft glow sprites, drawn once and stamped with drawImage (much cheaper than gradients per frame)
    const sprite = (rgb: string) => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d')!;
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, `rgba(${rgb},0.9)`); gr.addColorStop(0.25, `rgba(${rgb},0.3)`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      return c;
    };
    const glowSky = sprite('14,165,233'), glowAmber = sprite('99,102,241'); // the indigo accent stars

    let w = 0, h = 0, dpr = 1, gcx = 0, gcy = 0, R = 1, ax = 0, ay = 0;
    let ptx = -9999, pty = -9999, px = -9999, py = -9999;

    // ---- step 2: sample the words ----
    const sampleWords = () => {
      const anchorBox = anchor.getBoundingClientRect(), rootBox = root.getBoundingClientRect();
      const zf = rootBox.width / (root.clientWidth || 1) || 1; // page zoom: rects are visual px, canvas is CSS px
      ax = (anchorBox.left - rootBox.left + anchorBox.width / 2) / zf;
      ay = (anchorBox.top - rootBox.top + anchorBox.height / 2) / zf;
      const maxW = w * (small ? 0.9 : 0.8), maxH = Math.max(80, anchorBox.height / zf);
      const off = document.createElement('canvas');
      off.width = Math.ceil(maxW + 40); off.height = Math.ceil(maxH + 80);
      const o = off.getContext('2d', { willReadFrequently: true })!;
      for (let wi = 0; wi < WORDS.length; wi++) {
        o.clearRect(0, 0, off.width, off.height);
        o.font = '800 100px "Plus Jakarta Sans", system-ui, sans-serif';
        const mw = o.measureText(WORDS[wi]).width;
        const fs = Math.min((100 * maxW) / mw, maxH / 0.74);
        o.font = `800 ${fs}px "Plus Jakarta Sans", system-ui, sans-serif`;
        o.textAlign = 'center';
        o.fillStyle = '#000';
        o.fillText(WORDS[wi], off.width / 2, off.height / 2 + fs * 0.36);
        const px2 = o.getImageData(0, 0, off.width, off.height).data;
        const pts: number[] = [];
        let lo = 1e9, hi = -1e9;
        for (let y = 0; y < off.height; y += 2)
          for (let x = 0; x < off.width; x += 2)
            if (px2[(y * off.width + x) * 4 + 3] > 140) { pts.push(x - off.width / 2, y - off.height / 2); lo = Math.min(lo, x - off.width / 2); hi = Math.max(hi, x - off.width / 2); }
        const cnt = pts.length / 2 || 1;
        for (let i = 0; i < NT; i++) {
          const k = ((Math.random() * cnt) | 0) * 2;
          const base = (i * WORDS.length + wi) * 2;
          tgt[base] = pts[k] || 0;
          tgt[base + 1] = pts[k + 1] || 0;
          // left-to-right position inside the word picks the gradient step, like a gradient on the text itself
          gradBin[i * WORDS.length + wi] = Math.max(0, Math.min(GRAD.length - 1, Math.floor(((tgt[base] - lo) / (hi - lo || 1)) * GRAD.length)));
        }
      }
    };

    const resize = () => {
      w = root.clientWidth; h = root.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      gcx = w / 2; gcy = h * 0.5;
      R = small ? Math.max(w * 1.05, 380) : Math.max(w * 0.6, 420);
      sampleWords();
      if (reduced) frame(0, 1, 0, 1);
    };

    // ---- states of the animation ----
    let phase: 'in' | 'hold' | 'out' = 'in', pt = 0, wi = 0, clock = 0, rot = 0.4;
    let comet: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let cometIn = 3;

    // ---- one frame: G = how formed the word is (0 galaxy .. 1 word) ----
    const frame = (t: number, G: number, word: number, intro: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // galactic core glow
      const glow = ctx.createRadialGradient(gcx, gcy, 0, gcx, gcy, R * 0.55);
      glow.addColorStop(0, 'rgba(56,189,248,0.13)');
      glow.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.globalAlpha = intro;
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const RR = 130; // pointer radius
      const shockR = shock ? shock.t * 650 : 0, shockF = shock ? 1 - shock.t / 1.2 : 0;
      let last = -1;
      for (let i = 0; i < N; i++) {
        // 1. galaxy position
        const ang = A[i] + rot;
        const x3 = Rr[i] * Math.cos(ang), z3 = Rr[i] * Math.sin(ang);
        const yt = Yy[i] * cosT - z3 * sinT, zt = Yy[i] * sinT + z3 * cosT;
        const sc = 1 / (1 + zt * 0.5);
        const gx = gcx + x3 * R * sc, gy = gcy + yt * R * sc;
        if (i < K) { sxs[i] = gx; sys[i] = gy; }

        let x = gx, y = gy, e = 0, a = Al[i], s = Sz[i] * sc;
        if (i >= ND) {
          // 3. morph towards this particle's point of the current word
          e = smooth((G - Dl[i] * 0.45) / 0.55);
          if (e > 0) {
            const b = ((i - ND) * WORDS.length + word) * 2;
            const tx = ax + tgt[b], ty = ay + tgt[b + 1];
            const sw = Math.sin(Math.PI * e) * (Dl[i] - 0.5) * 0.45;
            x = gx + (tx - gx) * e - (ty - gy) * sw;
            y = gy + (ty - gy) * e + (tx - gx) * sw;
            if (e > 0.98 && !reduced) { x += Math.sin(t * 2.1 + i) * 0.5; y += Math.cos(t * 1.7 + i * 1.3) * 0.5; }
            a = a + (1 - a) * e; // same dot size as the galaxy particles; only the opacity firms up
            s = Sz[i];
          }
        }
        if (shock) { // click shockwave: a ring of displacement moving outwards
          const sdx = x - shock.x, sdy = y - shock.y, sd = Math.hypot(sdx, sdy) || 1, diff = Math.abs(sd - shockR);
          if (diff < 45) { const f = (1 - diff / 45) * shockF * 30; x += (sdx / sd) * f; y += (sdy / sd) * f; }
        }
        // 4. pointer gravity well
        const dx = x - px, dy = y - py, d2 = dx * dx + dy * dy;
        if (d2 < RR * RR) {
          const d = Math.sqrt(d2) || 1, f = 1 - d / RR, ff = f * f;
          if (e > 0.5) { x += (dx / d) * ff * 36; y += (dy / d) * ff * 36; }
          else { x -= dx * ff * 0.22; y -= dy * ff * 0.22; }
        }
        // once a particle has landed in the word it takes the blue gradient colour of its spot in the text
        const fc = e > 0.55 ? 8 + gradBin[(i - ND) * WORDS.length + word] : Col[i];
        if (fc !== last) { ctx.fillStyle = fc >= 8 ? GRAD[fc - 8] : PALETTE[fc]; last = fc; }
        ctx.globalAlpha = a * intro;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }

      // a few brighter stars with a soft halo (no lines between them)
      for (let i = 0; i < K; i++) {
        const tw = 0.65 + 0.35 * Math.sin(t * 1.5 + i * 2.1);
        const amber = i % 7 === 0;
        const near = px > -999 ? Math.max(0, 1 - Math.hypot(sxs[i] - px, sys[i] - py) / 170) : 0; // lights up near the cursor
        ctx.globalAlpha = Math.min(1, (0.7 + near) * tw) * intro;
        const gs = 34 + near * 22;
        ctx.drawImage(amber ? glowAmber : glowSky, sxs[i] - gs / 2, sys[i] - gs / 2, gs, gs);
        ctx.globalAlpha = 0.95 * tw * intro;
        ctx.fillStyle = amber ? '#6366f1' : '#0ea5e9';
        ctx.beginPath(); ctx.arc(sxs[i], sys[i], 2.2 + near * 1.2, 0, 6.2832); ctx.fill();
      }

      // comet
      if (comet) {
        const g = ctx.createLinearGradient(comet.x - comet.vx * 0.3, comet.y - comet.vy * 0.3, comet.x, comet.y);
        g.addColorStop(0, 'rgba(99,102,241,0)');
        g.addColorStop(1, 'rgba(14,165,233,0.95)');
        ctx.globalAlpha = Math.min(1, comet.life * 2);
        ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(comet.x - comet.vx * 0.3, comet.y - comet.vy * 0.3); ctx.lineTo(comet.x, comet.y); ctx.stroke();
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath(); ctx.arc(comet.x, comet.y, 2.6, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // ---- loop ----
    let raf = 0, prev = 0, visible = true;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - prev) / 1000 || 0.016);
      prev = now;
      if (!visible) return;
      clock += dt; rot += dt * 0.035; pt += dt;
      px += (ptx - px) * Math.min(1, dt * 10); py += (pty - py) * Math.min(1, dt * 10);
      // gather -> hold -> scatter -> next word
      let G = 1;
      if (phase === 'in') { G = ease(Math.min(1, pt / GATHER)); if (pt >= GATHER) { phase = 'hold'; pt = 0; } }
      else if (phase === 'hold') { if (pt >= HOLD[wi]) { phase = 'out'; pt = 0; } }
      else { G = 1 - ease(Math.min(1, pt / SCATTER)); if (pt >= SCATTER) { phase = 'in'; pt = 0; wi = (wi + 1) % WORDS.length; G = 0; } }
      if (clock < 0.6 && phase === 'in') G = 0; // let the galaxy appear first
      if (shock) { shock.t += dt; if (shock.t > 1.2) shock = null; }
      cometIn -= dt;
      if (!comet && cometIn <= 0) { comet = { x: w * (0.05 + Math.random() * 0.5), y: -10, vx: 420 + Math.random() * 160, vy: 180 + Math.random() * 120, life: 1 }; cometIn = 5 + Math.random() * 5; }
      if (comet) { comet.x += comet.vx * dt; comet.y += comet.vy * dt; comet.life -= dt * 0.5; if (comet.life <= 0 || comet.x > w + 20 || comet.y > h + 20) comet = null; }
      frame(clock, G, wi, Math.min(1, clock / 1.2));
    };

    root.addEventListener('pointermove', (e) => { const r = root.getBoundingClientRect(); const z = r.width / (root.clientWidth || 1) || 1; ptx = (e.clientX - r.left) / z; pty = (e.clientY - r.top) / z; if (px < -999) { px = ptx; py = pty; } });
    root.addEventListener('pointerdown', (e) => { const r = root.getBoundingClientRect(); const z = r.width / (root.clientWidth || 1) || 1; if (!reduced) shock = { x: (e.clientX - r.left) / z, y: (e.clientY - r.top) / z, t: 0 }; });
    root.addEventListener('pointerleave', () => { ptx = pty = -9999; });
    const ro = new ResizeObserver(resize);
    ro.observe(root);
    resize();
    document.fonts?.ready.then(() => { sampleWords(); if (reduced) frame(0, 1, 0, 1); });

    let io: IntersectionObserver | undefined;
    const onVis = () => { visible = !document.hidden; };
    if (!reduced) {
      io = new IntersectionObserver(([en]) => { visible = en.isIntersecting && !document.hidden; });
      io.observe(root);
      document.addEventListener('visibilitychange', onVis);
      raf = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [rootRef, anchorRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />;
};
