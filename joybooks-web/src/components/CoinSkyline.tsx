'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Coin Skyline. A revenue chart built from physical coins: coins rain from the top and stack into monthly
 * columns that form a rising skyline. The last two columns are a dashed forecast. A tooltip follows the pointer,
 * or sweeps the columns by itself. Canvas 2D, runs only while on screen.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
const FORECAST = 2;
const UNIT = 1850; // dollars per coin

interface Coin {
  col: number;
  y: number;
  vy: number;
}

export const CoinSkyline: React.FC<{ className?: string; onTotal?: (dollars: number) => void }> = ({ className = '', onTotal }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const cbTotal = useRef(onTotal);
  cbTotal.current = onTotal;

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
    let N = 14;
    let months: string[] = [];
    let cx: number[] = [];
    let cw = 40;
    let ch = 10;
    let pitch = 12;
    let baseY = 0;
    let target: number[] = [];
    let stack: number[] = [];
    let remaining: number[] = [];
    let flash: number[] = [];
    const coins: Coin[] = [];
    let spawn = 0;
    let rr = 0;
    let liveT = 0;
    let hover = -1;
    let autoIdx = 0;
    let autoT = 0;
    let lift: number[] = [];
    let sweepX = -300;
    let px = 0.5;
    const sparks: { x: number; y: number; vx: number; vy: number; life: number; r: number }[] = [];

    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    const layout = () => {
      const small = w < 640;
      N = small ? 9 : 14;
      months = MONTHS.slice(MONTHS.length - N);
      const padX = small ? 10 : 24;
      const slot = (w - padX * 2) / N;
      cx = Array.from({ length: N }, (_, i) => padX + slot * (i + 0.5));
      cw = Math.min(54, slot * 0.74);
      ch = small ? 8 : 10;
      pitch = ch + 2;
      baseY = h - 30;
      const maxCoins = Math.max(6, Math.floor((baseY - 70) / pitch));
      target = Array.from({ length: N }, (_, i) => {
        let f = 0.12 + 0.8 * Math.pow(i / (N - 1 - FORECAST), 1.6) * (0.94 + 0.06 * Math.sin(i * 2.1));
        if (i === N - 2) f = Math.min(0.97, f);
        if (i === N - 1) f = 1;
        return Math.max(3, Math.round(maxCoins * Math.min(1, f)));
      });
      lift = Array.from({ length: N }, () => 0);
      const actual = N - FORECAST;
      stack = Array.from({ length: N }, () => 0);
      remaining = target.map((t, i) => (i < actual ? t : 0));
      flash = Array.from({ length: N }, () => 0);
      coins.length = 0;
      if (reduced) for (let i = 0; i < actual; i++) stack[i] = target[i];
      emitTotal();
    };

    const emitTotal = () => {
      let t = 0;
      for (let i = 0; i < N - FORECAST; i++) t += stack[i];
      cbTotal.current?.(t * UNIT);
    };
    const burst = (x: number, y: number, n: number) => {
      for (let k = 0; k < n; k++) sparks.push({ x, y, vx: (rnd() - 0.5) * 90, vy: -30 - rnd() * 70, life: 1, r: 1 + rnd() * 1.6 });
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

    const rr2 = (x: number, y: number, rw: number, rh: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx.arcTo(x, y + rh, x, y, r);
      ctx.arcTo(x, y, x + rw, y, r);
      ctx.closePath();
    };

    const coinColor = (k: number, n: number) => {
      const f = n <= 1 ? 0 : k / (n - 1);
      // emerald at the bottom to sky to indigo at the top
      const a = f < 0.5 ? [16, 185, 129] : [14, 165, 233];
      const b = f < 0.5 ? [14, 165, 233] : [99, 102, 241];
      const u = f < 0.5 ? f * 2 : (f - 0.5) * 2;
      return `rgb(${Math.round(a[0] + (b[0] - a[0]) * u)},${Math.round(a[1] + (b[1] - a[1]) * u)},${Math.round(a[2] + (b[2] - a[2]) * u)})`;
    };

    const drawCoin = (x: number, y: number, color: string, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      rr2(x - cw / 2, y, cw, ch, 3);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.13)';
      ctx.fillRect(x - cw / 2 + 1, y + ch - 2.5, cw - 2, 2.5);
      ctx.fillStyle = 'rgba(255,255,255,0.42)';
      ctx.fillRect(x - cw / 2 + 3, y + 1.3, cw - 6, 1.6);
      const d = Math.abs(x - sweepX);
      if (d < 150) {
        ctx.globalAlpha = alpha * (1 - d / 150) * 0.5;
        ctx.fillStyle = '#fff';
        rr2(x - cw / 2, y, cw, ch, 3);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = (dt: number) => {
      clock += dt;
      const actual = N - FORECAST;
      sweepX = ((clock * 170) % (w + 700)) - 350;
      const hv = hover;
      for (let i = 0; i < N; i++) lift[i] += ((i === hv ? 10 : 0) - lift[i]) * Math.min(1, dt * 10);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const k = sparks[i];
        k.x += k.vx * dt;
        k.y += k.vy * dt;
        k.vy += 60 * dt;
        k.life -= dt * 1.4;
        if (k.life <= 0) sparks.splice(i, 1);
      }
      // spawn coins round robin across columns so the skyline rises together
      spawn += dt;
      while (spawn > 0.028) {
        spawn -= 0.028;
        for (let tries = 0; tries < actual; tries++) {
          const c = rr++ % actual;
          const inFlight = coins.filter((k) => k.col === c).length;
          if (remaining[c] - inFlight > 0) {
            coins.push({ col: c, y: -20 - rnd() * 40, vy: 0 });
            break;
          }
        }
      }
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.vy += 1900 * dt;
        c.y += c.vy * dt;
        const rest = baseY - (stack[c.col] + 1) * pitch + 1;
        if (c.y >= rest) {
          stack[c.col]++;
          remaining[c.col] = Math.max(0, remaining[c.col] - 1);
          flash[c.col] = 1;
          if (rnd() < 0.3) burst(cx[c.col], baseY - stack[c.col] * pitch, 3);
          coins.splice(i, 1);
          emitTotal();
        }
      }
      // once filled, the books keep growing: an occasional extra coin lands somewhere
      const filled = stack.slice(0, actual).every((s, i) => s >= target[i]);
      if (filled) {
        liveT += dt;
        if (liveT > 1.4) {
          liveT = 0;
          const c = Math.floor(rnd() * actual);
          if (target[c] < Math.floor((baseY - 70) / pitch)) {
            target[c]++;
            remaining[c]++;
          }
        }
        autoT += dt;
        if (autoT > 1.7) {
          autoT = 0;
          autoIdx = (autoIdx + 1) % N;
        }
      }
      for (let i = 0; i < N; i++) flash[i] = Math.max(0, flash[i] - dt * 3);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const actual = N - FORECAST;
      const active = hover >= 0 ? hover : autoIdx;
      const filled = stack.slice(0, actual).every((s, i) => s >= target[i]);

      // distant skyline for depth, drifts against the pointer
      for (let i = 0; i < N; i++) {
        const bh = Math.max(20, target[i] * pitch * 0.72 + 14 * Math.sin(i * 1.7));
        ctx.fillStyle = 'rgba(186,230,253,0.28)';
        rr2(cx[i] - cw * 0.62 + (px - 0.5) * -18, baseY - bh, cw * 1.24, bh, 6);
        ctx.fill();
      }

      // active column halo
      if (filled || hover >= 0) {
        const hTop = baseY - (active >= N - FORECAST ? target[active] : stack[active]) * pitch - 56;
        const grad = ctx.createLinearGradient(0, hTop, 0, baseY);
        grad.addColorStop(0, 'rgba(14,165,233,0)');
        grad.addColorStop(1, 'rgba(14,165,233,0.12)');
        ctx.fillStyle = grad;
        rr2(cx[active] - cw / 2 - 8, hTop, cw + 16, baseY - hTop, 10);
        ctx.fill();
      }

      // baseline + month labels
      ctx.strokeStyle = 'rgba(125,211,252,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(8, baseY + 4);
      ctx.lineTo(w - 8, baseY + 4);
      ctx.stroke();
      ctx.font = '600 10.5px Plus Jakarta Sans, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      for (let i = 0; i < N; i++) {
        ctx.fillStyle = i === active ? '#0369a1' : '#94a3b8';
        ctx.fillText(i >= actual ? `${months[i]}*` : months[i], cx[i], baseY + 20);
      }

      // forecast ghosts
      for (let i = actual; i < N; i++) {
        const pulse = 0.35 + 0.15 * Math.sin(clock * 2 + i);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = `rgba(99,102,241,${pulse + 0.15})`;
        ctx.lineWidth = 1.3;
        ctx.fillStyle = `rgba(99,102,241,${0.04 + pulse * 0.08})`;
        const top = baseY - target[i] * pitch;
        rr2(cx[i] - cw / 2, top, cw, target[i] * pitch - 2, 4);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // stacks
      for (let i = 0; i < actual; i++) {
        const n = stack[i];
        const dim = i === active ? 1 : 0.88;
        for (let k = 0; k < n; k++) {
          const y = baseY - (k + 1) * pitch + 1 - lift[i] * Math.min(1, (k + 1) / Math.max(1, n)) ;
          drawCoin(cx[i], y, coinColor(k, target[i]), dim);
        }
        if (flash[i] > 0 && n > 0) {
          const y = baseY - n * pitch + 1 - lift[i];
          ctx.globalAlpha = flash[i] * 0.7;
          ctx.fillStyle = '#fff';
          rr2(cx[i] - cw / 2, y, cw, ch, 3);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      // falling coins
      for (const c of coins) {
        const sy = 0.35 + 0.65 * Math.abs(Math.cos(c.y * 0.05 + c.col));
        ctx.fillStyle = coinColor(stack[c.col], target[c.col]);
        ctx.beginPath();
        ctx.ellipse(cx[c.col], c.y + ch / 2, cw / 2, (ch / 2) * sy + 1, 0, 0, 6.2832);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // sparkles
      for (const k of sparks) {
        ctx.globalAlpha = Math.max(0, k.life);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(k.x, k.y, k.r, 0, 6.2832);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // trend line across the tops
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const y = baseY - (i < actual ? stack[i] : target[i]) * pitch - 10;
        if (i === 0) ctx.moveTo(cx[i], y);
        else ctx.lineTo(cx[i], y);
      }
      ctx.setLineDash([2, 7]);
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(14,165,233,0.55)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // tooltip
      if (filled || hover >= 0) {
        const n = active >= actual ? target[active] : stack[active];
        const top = baseY - n * pitch - lift[active];
        const bw = 104;
        const bh = 42;
        const bx = Math.max(6, Math.min(w - bw - 6, cx[active] - bw / 2));
        const by = Math.max(4, top - bh - 14);
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = active >= actual ? 'rgba(99,102,241,0.6)' : 'rgba(14,165,233,0.7)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(14,116,144,0.18)';
        ctx.shadowBlur = 14;
        rr2(bx, by, bw, bh, 10);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.stroke();
        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748b';
        ctx.font = '600 10.5px Plus Jakarta Sans, system-ui, sans-serif';
        ctx.fillText(active >= actual ? `${months[active]} · Forecast` : `${months[active]} revenue`, bx + 10, by + 16);
        ctx.fillStyle = '#0f172a';
        ctx.font = '800 15px Plus Jakarta Sans, system-ui, sans-serif';
        ctx.fillText(`$${((n * UNIT) / 1000).toFixed(1)}K`, bx + 10, by + 34);
        // pointer notch
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        const nx = Math.max(bx + 14, Math.min(bx + bw - 14, cx[active]));
        ctx.moveTo(nx - 6, by + bh - 0.5);
        ctx.lineTo(nx + 6, by + bh - 0.5);
        ctx.lineTo(nx, by + bh + 6);
        ctx.closePath();
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      step(dt);
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

    const colAt = (clientX: number) => {
      const r = canvas.getBoundingClientRect();
      const x = (clientX - r.left) / (r.width / (canvas.clientWidth || 1) || 1);
      let best = 0;
      for (let i = 1; i < N; i++) if (Math.abs(cx[i] - x) < Math.abs(cx[best] - x)) best = i;
      return best;
    };
    const onMove = (e: PointerEvent) => {
      hover = colAt(e.clientX);
      px = (e.clientX - canvas.getBoundingClientRect().left) / Math.max(1, canvas.getBoundingClientRect().width);
      if (!running) draw();
    };
    const onClick = (e: PointerEvent) => {
      const c = colAt(e.clientX);
      if (c >= N - FORECAST) return;
      const maxC = Math.floor((baseY - 70) / pitch);
      const add = Math.min(3, maxC - target[c]);
      if (add > 0) {
        target[c] += add;
        remaining[c] += add;
      }
      burst(cx[c], baseY - stack[c] * pitch, 14);
      if (!running) draw();
    };
    const onLeave = () => {
      hover = -1;
      if (!running) draw();
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
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('click', onClick as EventListener);
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick as EventListener);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`${className} cursor-pointer`} />;
};
