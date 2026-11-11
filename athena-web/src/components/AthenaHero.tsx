'use client';

import React, { useRef } from 'react';
import { ArrowRight, Play, Check, HardHat, Receipt } from 'lucide-react';
import { gsap, useGSAP, scrollToId, MOTION_OK, runWhileVisible } from '../animation';
import { LiveChip } from './FuturisticPrimitives';

/*
 * Build-Up hero. An isometric site: a tower crane lifts each floor into place and the building rises from the ground,
 * floor by floor, while the project cost climbs. When the last floor is up the scaffolding comes down, the windows light
 * up and the invoice goes out. (Earlier hero: AthenaHeroMeasure.tsx.)
 */

interface AthenaHeroProps {
  onOpenDemo: () => void;
}

const POINTS = ['Sites and surveys', 'Any unit of measure', 'Crews and attendance'];
const FONT = 'Plus Jakarta Sans, system-ui, sans-serif';

// ---- isometric helpers -------------------------------------------------------------------------------------------
const S = 34; // pixels per unit
const CX = 262;
const CY = 352;
const P = (x: number, y: number, z: number): [number, number] => [CX + (x - y) * 0.866 * S, CY + (x + y) * 0.5 * S - z * S];
const pts = (a: [number, number][]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

const FLOORS = 5;
const FH = 1.1; // floor height in units
const HALF = 2; // half footprint
const COST = [4200, 3800, 4100, 3600, 3300];
const TOTAL = COST.reduce((a, b) => a + b, 0);
const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

// crane geometry (screen space)
const MAST_X = 480;
const JIB_Y = 44;
const PICK_X = 438;
const DROP_X = CX;
const GROUND_Y = 410;

const floorTopY = (k: number) => P(0, 0, (k + 1) * FH)[1];

export const AthenaHero: React.FC<AthenaHeroProps> = ({ onOpenDemo }) => {
  const rootRef = useRef<HTMLElement>(null);
  const costRef = useRef<HTMLSpanElement>(null);
  const floorRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const hoistRef = useRef<SVGGElement>(null);
  const cableRef = useRef<SVGLineElement>(null);
  const loadRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const setCost = (v: number) => {
        if (costRef.current) costRef.current.textContent = usd(v);
      };
      const setFloor = (n: number) => {
        if (floorRef.current) floorRef.current.textContent = n >= FLOORS ? 'Complete' : `Floor ${n} of ${FLOORS}`;
      };
      const setBar = (n: number) => {
        if (barRef.current) barRef.current.style.width = `${(n / FLOORS) * 100}%`;
      };
      const pose = (x: number, len: number) => {
        hoistRef.current?.setAttribute('transform', `translate(${x} 0)`);
        cableRef.current?.setAttribute('y2', String(JIB_Y + 8 + len));
        loadRef.current?.setAttribute('transform', `translate(0 ${JIB_Y + 8 + len})`);
      };
      const clipBottom = (k: number) => P(HALF, HALF, k * FH)[1] + 3;
      const clipTop = (k: number) => P(-HALF, -HALF, (k + 1) * FH)[1] - 4;

      mm.add('(prefers-reduced-motion: reduce)', () => {
        for (let k = 0; k < FLOORS; k++) gsap.set(`[data-fc="${k}"]`, { attr: { y: clipTop(k), height: clipBottom(k) - clipTop(k) } });
        gsap.set('[data-scaf]', { autoAlpha: 0 });
        gsap.set('[data-win]', { fill: '#fde68a' });
        gsap.set('[data-sent]', { autoAlpha: 1 });
        gsap.set('[data-hoist]', { autoAlpha: 0 });
        setCost(TOTAL);
        setFloor(FLOORS);
        setBar(FLOORS);
      });

      mm.add(MOTION_OK, () => {
        const loops: gsap.core.Animation[] = [];

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
          .from('[data-hero-line]', { yPercent: 115, duration: 1.1, stagger: 0.13 }, 0.1)
          .from('[data-hero-fade]', { autoAlpha: 0, y: 22, duration: 0.8, stagger: 0.1 }, 0.4)
          .from('[data-scene]', { autoAlpha: 0, y: 30, duration: 1 }, 0.3)
          .from('[data-ground]', { scale: 0.7, transformOrigin: '50% 50%', duration: 1.1, ease: 'back.out(1.4)' }, 0.5)
          .from('[data-crane]', { autoAlpha: 0, y: 40, duration: 0.9 }, 0.9)
          .from('[data-hud]', { autoAlpha: 0, y: 16, duration: 0.7 }, 1.1);

        // crew walking about on the ground, a few cloud drifts: cheap, always running while visible
        gsap.utils.toArray<HTMLElement>('[data-walker]').forEach((el, i) => {
          loops.push(gsap.to(el, { x: i % 2 ? -46 : 52, duration: 3.4 + i * 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
          loops.push(gsap.to(el.querySelector('[data-bob]'), { y: -2.5, duration: 0.28, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
        });
        gsap.utils.toArray<HTMLElement>('[data-cloud]').forEach((el, i) => {
          loops.push(gsap.to(el, { x: 40 + i * 14, duration: 16 + i * 5, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
        });

        // the build
        const ps = { x: PICK_X, len: 60 };
        const cost = { v: 0 };
        const tl = gsap.timeline({ repeat: -1, delay: 1.8 });

        tl.call(() => {
          pose(PICK_X, 60);
          setCost(0);
          setFloor(0);
          setBar(0);
          cost.v = 0;
        }, [], 0);
        for (let k = 0; k < FLOORS; k++) tl.set(`[data-fc="${k}"]`, { attr: { y: clipBottom(k), height: 0 } }, 0);
        tl.set('[data-scaf]', { autoAlpha: 1 }, 0)
          .set('[data-win]', { fill: '#bfe0ff' }, 0)
          .set('[data-sent]', { autoAlpha: 0 }, 0)
          .set('[data-hoist]', { autoAlpha: 1 }, 0)
          .set('[data-load]', { autoAlpha: 0 }, 0);

        let t = 0.3;
        let done = 0;
        for (let k = 0; k < FLOORS; k++) {
          const dropLen = floorTopY(k) - 16 - (JIB_Y + 8);
          const pickLen = GROUND_Y - 6 - (JIB_Y + 8);
          const go = (to: { x?: number; len?: number }, d: number, ease = 'power1.inOut') => {
            tl.to(ps, { ...to, duration: d, ease, onUpdate: () => pose(ps.x, ps.len) }, t);
            t += d;
          };
          // out to the pile, hook on, hoist, swing across, lower
          go({ x: PICK_X }, 0.5);
          go({ len: pickLen }, 0.45);
          tl.set('[data-load]', { autoAlpha: 1 }, t);
          go({ len: 70 }, 0.45);
          go({ x: DROP_X }, 0.6);
          go({ len: dropLen }, 0.4);
          // the floor goes up
          tl.to('[data-load]', { autoAlpha: 0, duration: 0.2 }, t);
          tl.fromTo(`[data-fc="${k}"]`, { attr: { y: clipBottom(k), height: 0 } }, { attr: { y: clipTop(k), height: clipBottom(k) - clipTop(k) }, duration: 0.9, ease: 'power2.out' }, t);
          const to = (done += COST[k]);
          tl.to(cost, { v: to, duration: 0.9, ease: 'power2.out', onUpdate: () => setCost(cost.v) }, t);
          tl.call(() => { setFloor(k + 1); setBar(k + 1); }, [], t + 0.1);
          tl.fromTo(`[data-chip="${k}"]`, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35 }, t + 0.2);
          tl.to(`[data-chip="${k}"]`, { autoAlpha: 0, y: -8, duration: 0.3 }, t + 1.5);
          t += 0.95;
          go({ len: 70 }, 0.35);
        }
        // hand-over: crane parks, scaffold comes down, the windows light up, the invoice goes out
        tl.to(ps, { x: PICK_X, len: 60, duration: 0.6, ease: 'power1.inOut', onUpdate: () => pose(ps.x, ps.len) }, t);
        tl.to('[data-scaf]', { autoAlpha: 0, duration: 0.6 }, t + 0.2);
        tl.to('[data-win]', { fill: '#fde68a', duration: 0.4, stagger: { each: 0.025, from: 'end' } }, t + 0.6);
        tl.call(() => setFloor(FLOORS), [], t + 0.7);
        tl.fromTo('[data-sent]', { autoAlpha: 0, y: 10, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, t + 1.2);
        t += 4.6;
        // and back to bare ground
        for (let k = FLOORS - 1; k >= 0; k--) {
          tl.to(`[data-fc="${k}"]`, { attr: { y: clipBottom(k), height: 0 }, duration: 0.35, ease: 'power2.in' }, t + (FLOORS - 1 - k) * 0.12);
        }
        tl.to('[data-sent]', { autoAlpha: 0, duration: 0.3 }, t);
        tl.to({}, { duration: 0.5 }, t + 0.9);

        loops.push(tl);
        const stop = runWhileVisible(rootRef.current, loops);
        return () => {
          stop();
          intro.kill();
        };
      });
    },
    { scope: rootRef },
  );

  // ---- static scene geometry --------------------------------------------------------------------------------------
  const floorsMarkup = Array.from({ length: FLOORS }, (_, k) => {
    const z0 = k * FH;
    const z1 = (k + 1) * FH;
    const left = pts([P(-HALF, HALF, z0), P(HALF, HALF, z0), P(HALF, HALF, z1), P(-HALF, HALF, z1)]);
    const right = pts([P(HALF, HALF, z0), P(HALF, -HALF, z0), P(HALF, -HALF, z1), P(HALF, HALF, z1)]);
    const top = pts([P(-HALF, -HALF, z1), P(HALF, -HALF, z1), P(HALF, HALF, z1), P(-HALF, HALF, z1)]);
    const wins: string[] = [];
    [-1.15, 0, 1.15].forEach((u) => {
      wins.push(pts([P(u - 0.3, HALF, z0 + 0.3), P(u + 0.3, HALF, z0 + 0.3), P(u + 0.3, HALF, z0 + 0.8), P(u - 0.3, HALF, z0 + 0.8)]));
    });
    const wins2: string[] = [];
    [-1.15, 0, 1.15].forEach((u) => {
      wins2.push(pts([P(HALF, u - 0.3, z0 + 0.3), P(HALF, u + 0.3, z0 + 0.3), P(HALF, u + 0.3, z0 + 0.8), P(HALF, u - 0.3, z0 + 0.8)]));
    });
    // scaffolding just outside the faces: poles at the corners and a rail at the floor top
    const o = 0.22;
    const poleA = [P(-HALF - o, HALF + o, z0), P(-HALF - o, HALF + o, z1)];
    const poleB = [P(HALF + o, HALF + o, z0), P(HALF + o, HALF + o, z1)];
    const poleC = [P(HALF + o, -HALF - o, z0), P(HALF + o, -HALF - o, z1)];
    const railL = [P(-HALF - o, HALF + o, z1 - 0.05), P(HALF + o, HALF + o, z1 - 0.05)];
    const railR = [P(HALF + o, HALF + o, z1 - 0.05), P(HALF + o, -HALF - o, z1 - 0.05)];
    const railM = [P(-HALF - o, HALF + o, z0 + 0.55), P(HALF + o, HALF + o, z0 + 0.55)];
    const ln = (a: [number, number][]) => `M${a[0][0].toFixed(1)} ${a[0][1].toFixed(1)}L${a[1][0].toFixed(1)} ${a[1][1].toFixed(1)}`;
    return (
      <g key={k} clipPath={`url(#at-fc-${k})`}>
        <polygon points={left} fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1.2" />
        <polygon points={right} fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1.2" />
        <polygon points={top} fill="#f0f9ff" stroke="#7dd3fc" strokeWidth="1.2" />
        {wins.map((w, i) => <polygon key={`l${i}`} data-win points={w} fill="#bfe0ff" stroke="#38bdf8" strokeWidth="0.9" />)}
        {wins2.map((w, i) => <polygon key={`r${i}`} data-win points={w} fill="#bfe0ff" stroke="#0ea5e9" strokeWidth="0.9" />)}
        <g data-scaf fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round">
          <path d={`${ln(poleA)}${ln(poleB)}${ln(poleC)}${ln(railL)}${ln(railR)}${ln(railM)}`} />
        </g>
      </g>
    );
  });

  // lattice for the crane mast
  const lattice = (() => {
    let d = '';
    for (let y = GROUND_Y; y > JIB_Y + 14; y -= 24) {
      d += `M${MAST_X - 5} ${y}L${MAST_X + 5} ${y - 24}M${MAST_X + 5} ${y}L${MAST_X - 5} ${y - 24}`;
    }
    return d;
  })();

  const diamond = (r: number, z = 0) => pts([P(-r, -r, z), P(r, -r, z), P(r, r, z), P(-r, r, z)]);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-tech-grid border-b border-sky-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div className="aurora aurora-sky -top-24 -left-24 w-[520px] h-[520px]" />
        <div className="aurora aurora-amber bottom-[-140px] right-[-100px] w-[560px] h-[560px]" />
        <div className="aurora aurora-indigo top-10 right-1/3 w-[420px] h-[420px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-10 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(520px,1.15fr)] gap-6 lg:gap-6 items-center">
          {/* text */}
          <div className="text-center lg:text-left relative z-10">
            <div data-hero-fade className="inline-flex items-center gap-2 mb-5">
              <LiveChip label="Field billing software" tone="amber" />
            </div>
            <h1 className="text-[44px] sm:text-[60px] lg:text-[clamp(48px,4.8vw,70px)] font-bold tracking-[-0.035em] leading-[1.02] text-slate-950 mb-6">
              <span className="block overflow-hidden pb-2 -mb-1">
                <span data-hero-line className="block">Every site.</span>
              </span>
              <span className="block overflow-hidden pb-2 -mb-1">
                <span data-hero-line className="block">Every crew.</span>
              </span>
              <span className="block overflow-hidden pb-4 -mb-2">
                <span data-hero-line className="block text-shimmer pb-3 -mb-1">Built to bill.</span>
              </span>
            </h1>
            <p data-hero-fade className="text-[16px] sm:text-[17px] leading-[1.65] text-slate-600 max-w-lg mx-auto lg:mx-0 mb-7">
              Athena is a field billing app. <span className="font-semibold text-slate-900">Survey the site, turn measurements into an estimate, schedule your crew</span>{' '}
              and bill the customer, all in one place.
            </p>
            <div data-hero-fade className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
              <button
                type="button"
                onClick={onOpenDemo}
                className="group inline-flex items-center gap-2 px-5 py-3.5 text-[14.5px] font-semibold text-white bg-slate-950 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer shadow-float"
              >
                Book a Demo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollToId('demo')}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-[14.5px] font-semibold text-slate-800 bg-white/80 border border-sky-200 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-800" />
                See how it works
              </button>
            </div>
            <ul data-hero-fade className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
                  <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* the site */}
          <div data-scene className="relative w-full max-w-[720px] mx-auto flex flex-col">
            <svg viewBox="0 0 620 480" className="w-full h-auto block overflow-visible" role="img" aria-label="A building rising floor by floor on an isometric construction site">
              <defs>
                <filter id="at-shadow" x="-20%" y="-20%" width="140%" height="150%">
                  <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.16" />
                </filter>
                {Array.from({ length: FLOORS }, (_, k) => (
                  <clipPath key={k} id={`at-fc-${k}`}>
                    <rect data-fc={k} x="0" y={P(HALF, HALF, k * FH)[1] + 3} width="620" height="0" />
                  </clipPath>
                ))}
              </defs>

              {/* sky details */}
              <g fill="#fff" opacity="0.9">
                <g data-cloud><ellipse cx="90" cy="70" rx="42" ry="12" /><ellipse cx="116" cy="62" rx="26" ry="11" /></g>
                <g data-cloud><ellipse cx="410" cy="26" rx="36" ry="10" /><ellipse cx="432" cy="20" rx="22" ry="9" /></g>
              </g>

              {/* ground plot */}
              <g data-ground>
                <polygon points={diamond(4.6, -0.05)} fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.4" filter="url(#at-shadow)" />
                <polygon points={diamond(3.9, 0)} fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="5 4" />
                {[-3, -1.5, 0, 1.5, 3].map((u) => (
                  <g key={u} stroke="#bfdbfe" strokeWidth="0.7" opacity="0.8">
                    <path d={`M${P(u, -3.9, 0)[0]} ${P(u, -3.9, 0)[1]}L${P(u, 3.9, 0)[0]} ${P(u, 3.9, 0)[1]}`} />
                    <path d={`M${P(-3.9, u, 0)[0]} ${P(-3.9, u, 0)[1]}L${P(3.9, u, 0)[0]} ${P(3.9, u, 0)[1]}`} />
                  </g>
                ))}
                {/* foundation slab */}
                <polygon points={diamond(2.35, 0)} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />
                {/* material pile and cones */}
                <g>
                  <polygon points={pts([P(2.9, 3, 0), P(3.7, 3, 0), P(3.7, 3, 0.45), P(2.9, 3, 0.45)])} fill="#fde68a" stroke="#d97706" strokeWidth="1" />
                  <polygon points={pts([P(3.7, 3, 0), P(3.7, 2.2, 0), P(3.7, 2.2, 0.45), P(3.7, 3, 0.45)])} fill="#fcd34d" stroke="#d97706" strokeWidth="1" />
                  <polygon points={pts([P(2.9, 2.2, 0.45), P(3.7, 2.2, 0.45), P(3.7, 3, 0.45), P(2.9, 3, 0.45)])} fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
                </g>
              </g>

              {/* the building */}
              <g filter="url(#at-shadow)">{floorsMarkup}</g>

              {/* crew */}
              <g>
                {[
                  { x: 150, y: 432, c: '#f59e0b' },
                  { x: 310, y: 452, c: '#38bdf8' },
                  { x: 430, y: 432, c: '#f59e0b' },
                ].map((w, i) => (
                  <g key={i} data-walker transform={`translate(${w.x} ${w.y})`}>
                    <g data-bob>
                      <ellipse cx="0" cy="12" rx="7" ry="2.4" fill="#0f172a" opacity="0.14" />
                      <rect x="-4" y="-2" width="8" height="12" rx="3" fill={w.c} />
                      <circle cx="0" cy="-7" r="4.2" fill="#fde7c7" />
                      <path d="M-5 -8A5 5 0 0 1 5 -8Z" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
                    </g>
                  </g>
                ))}
              </g>

              {/* tower crane */}
              <g data-crane>
                <rect x={MAST_X - 7} y={GROUND_Y} width="14" height="10" rx="2" fill="#94a3b8" />
                <rect x={MAST_X - 5} y={JIB_Y + 8} width="10" height={GROUND_Y - JIB_Y - 8} fill="none" stroke="#f59e0b" strokeWidth="1.6" />
                <path d={lattice} stroke="#f59e0b" strokeWidth="1.1" fill="none" />
                <rect x="206" y={JIB_Y} width={MAST_X - 206 + 70} height="8" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                <path d={`M206 ${JIB_Y + 8}L${MAST_X} ${JIB_Y - 6}L${MAST_X + 70} ${JIB_Y + 8}`} stroke="#b45309" strokeWidth="1" fill="none" />
                <rect x={MAST_X + 38} y={JIB_Y + 8} width="30" height="22" rx="3" fill="#475569" />
                <rect x={MAST_X - 12} y={JIB_Y - 14} width="24" height="18" rx="3" fill="#fff" stroke="#b45309" strokeWidth="1.2" />
                <rect x={MAST_X - 8} y={JIB_Y - 11} width="12" height="9" rx="2" fill="#bae6fd" />
                <g ref={hoistRef} data-hoist>
                  <rect x="-7" y={JIB_Y + 4} width="14" height="8" rx="2" fill="#1e293b" />
                  <line ref={cableRef} x1="0" y1={JIB_Y + 10} x2="0" y2={JIB_Y + 68} stroke="#334155" strokeWidth="1.3" />
                  <g ref={loadRef} data-load transform={`translate(0 ${JIB_Y + 68})`}>
                    <rect x="-3" y="-4" width="6" height="6" rx="1" fill="#1e293b" />
                    <polygon points="-22,2 22,2 22,12 -22,12" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="1.2" />
                    <polygon points="-22,2 22,2 18,-3 -18,-3" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="1" />
                    <path d="M-12 4V10M0 4V10M12 4V10" stroke="#38bdf8" strokeWidth="1" />
                  </g>
                </g>
              </g>

              {/* floor cost chips, one per floor */}
              {COST.map((c, k) => (
                <g key={k} data-chip={k} opacity="0" fontFamily={FONT}>
                  <rect x={CX + 118} y={P(HALF, 0, k * FH + 0.4)[1] - 14} width="86" height="26" rx="13" fill="#0f172a" />
                  <text x={CX + 161} y={P(HALF, 0, k * FH + 0.4)[1] + 3.5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">{`+${usd(c)}`}</text>
                </g>
              ))}
            </svg>

            {/* project card */}
            <div data-hud className="order-first mx-auto mb-2 sm:mb-0 sm:mx-0 sm:order-none sm:absolute sm:left-2 sm:top-0 w-[218px] rounded-2xl bg-white/95 backdrop-blur border border-amber-200 shadow-float p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><HardHat className="w-3.5 h-3.5" /></span>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-slate-950 leading-tight truncate">24 Maple Street</p>
                  <span ref={floorRef} className="block text-[10.5px] font-semibold text-slate-500 leading-tight">Floor 0 of {FLOORS}</span>
                </div>
              </div>
              <p className="text-[10.5px] font-semibold text-slate-400 mb-0.5">Project cost</p>
              <span ref={costRef} className="block text-[26px] font-extrabold text-slate-950 leading-none tabular-nums mb-2.5">{usd(TOTAL)}</span>
              <div className="h-1.5 rounded-full bg-amber-100 overflow-hidden">
                <span ref={barRef} className="block h-full rounded-full bg-gradient-to-r from-amber-400 to-sky-400" style={{ width: '100%', transition: 'width .8s ease' }} />
              </div>
            </div>

            {/* invoice goes out */}
            <div data-sent className="absolute right-0 sm:right-2 bottom-3 inline-flex items-center gap-2.5 rounded-2xl bg-white border border-emerald-200 shadow-float px-3.5 py-2.5" style={{ opacity: 0 }}>
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><Receipt className="w-4 h-4" /></span>
              <span>
                <span className="block text-[11px] text-slate-400 leading-none mb-0.5">Project complete</span>
                <span className="block text-[13px] font-bold text-slate-950 leading-none">Invoice sent · {usd(TOTAL)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
