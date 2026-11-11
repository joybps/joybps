'use client';

import React, { useRef } from 'react';
import { ArrowUpRight, Gauge, Target, Wallet, Layers } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, runWhileVisible } from '../animation';

// Sample figures, for illustration only.
const MAX = 70000;
const BASE = { last: 48200, this: 56800, next: 64500 };

const BARS = [
  { key: 'last', label: 'Last month', caption: 'Revenue generated', bar: 'bg-sky-300' },
  { key: 'this', label: 'This month', caption: 'Generated so far', bar: 'bg-slate-950' },
  { key: 'next', label: 'Next month', caption: 'Forecast', bar: 'bg-sky-100 border-2 border-dashed border-sky-400' },
] as const;

const DAILY = [8, 14, 12, 22, 20, 31, 29, 40, 38, 49, 47, 58, 62, 70];
const VB_W = 600;
const VB_H = 130;
const pts = DAILY.map((v, i) => [(i / (DAILY.length - 1)) * VB_W, VB_H - 10 - (v / 70) * (VB_H - 24)] as const);
const LINE = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
const AREA = `${LINE} L ${VB_W} ${VB_H} L 0 ${VB_H} Z`;

const fmt = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

const TILES = [
  { key: 'conf', icon: Gauge, label: 'Forecast confidence', unit: '%', min: 84, max: 90, decimals: 0 },
  { key: 'win', icon: Target, label: 'Win rate', unit: '%', min: 31.2, max: 33.6, decimals: 1 },
  { key: 'deal', icon: Wallet, label: 'Average deal size', unit: '', min: 3420, max: 3580, decimals: 0, money: true },
  { key: 'pipe', icon: Layers, label: 'Open pipeline', unit: 'K', min: 178, max: 191, decimals: 0, money: true },
] as const;

export const ForecastPanel: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const set = (sel: string, text: string) => q(sel).forEach((el) => (el.textContent = text));

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const scrollTrigger = { trigger: root, start: 'top 85%', once: true };

        /* 1. Entrance */
        gsap.from('[data-barwrap]', { scaleY: 0, transformOrigin: '50% 100%', duration: 1.1, stagger: 0.18, ease: 'power3.out', scrollTrigger });
        gsap.from('[data-tile]', { autoAlpha: 0, y: 22, scale: 0.94, duration: 0.6, stagger: 0.09, delay: 0.3, clearProps: 'transform', scrollTrigger });
        gsap.from('[data-chart]', { autoAlpha: 0, y: 20, duration: 0.7, delay: 0.5, scrollTrigger });

        /* 2. Bars + figures keep moving: up and down, growing */
        // Every endless loop below is collected here and paused whenever the panel is off screen.
        const loops: gsap.core.Animation[] = [];

        const live = { ...BASE };
        const barEls = q('[data-bar]') as HTMLElement[];
        const valEls = { last: q('[data-val="last"]'), this: q('[data-val="this"]'), next: q('[data-val="next"]') };
        const growthEls = { this: q('[data-growth="this"]'), next: q('[data-growth="next"]') };
        const write = (els: Element[], text: string) =>
          els.forEach((el) => {
            if (el.textContent !== text) el.textContent = text;
          });
        const render = () => {
          write(valEls.last, fmt(live.last));
          write(valEls.this, fmt(live.this));
          write(valEls.next, fmt(live.next));
          barEls.forEach((el) => {
            const k = el.dataset.bar as keyof typeof live;
            el.style.height = `${(live[k] / MAX) * 100}%`;
          });
          write(growthEls.this, `+${((live.this / live.last - 1) * 100).toFixed(1)}%`);
          write(growthEls.next, `+${((live.next / live.this - 1) * 100).toFixed(1)}%`);
        };
        loops.push(
          gsap.to(live, { this: BASE.this + 2600, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
          gsap.to(live, { next: BASE.next + 3400, duration: 3.3, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
          // Created last, so it updates after the other two each frame: one DOM write per frame, not three.
          gsap.to(live, { last: BASE.last + 500, duration: 4.1, repeat: -1, yoyo: true, ease: 'sine.inOut', onUpdate: render }),
        );

        // Growth bubbles bob
        loops.push(gsap.fromTo('[data-bubble]', { y: -4 }, { y: 4, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.35 }));

        /* 3. Metric tiles tick between two values, with a filling bar */
        TILES.forEach((t, i) => {
          const state = { v: t.min };
          const metricEls = q(`[data-metric="${t.key}"]`);
          const fillEls = q(`[data-fill="${t.key}"]`) as HTMLElement[];
          const ringEls = t.key === 'conf' ? (q('[data-ring]') as unknown as SVGElement[]) : [];
          const apply = () => {
            const text = t.key === 'pipe' ? `$${state.v.toFixed(0)}K` : 'money' in t && t.money ? fmt(state.v) : `${state.v.toFixed(t.decimals)}${t.unit}`;
            write(metricEls, text);
            const pct = ((state.v - t.min) / (t.max - t.min)) * 55 + 30;
            fillEls.forEach((el) => (el.style.width = `${pct}%`));
            ringEls.forEach((el) => (el.style.strokeDashoffset = `${163.4 * (1 - state.v / 100)}`));
          };
          loops.push(gsap.to(state, { v: t.max, duration: 2.2 + i * 0.5, delay: i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', onUpdate: apply }));
        });
        loops.push(gsap.fromTo('[data-arrow]', { y: 2, x: -2 }, { y: -2, x: 2, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.2 }));

        /* 4. Daily revenue line draws itself, with a glowing dot riding the tip */
        const path = q('[data-line]')[0] as unknown as SVGPathElement | undefined;
        const dot = q('[data-dot]')[0] as unknown as SVGCircleElement | undefined;
        const halo = q('[data-halo]')[0] as unknown as SVGCircleElement | undefined;
        const clip = q('[data-clip]')[0] as unknown as SVGRectElement | undefined;
        if (path && dot && halo && clip) {
          const len = path.getTotalLength();
          path.style.strokeDasharray = `${len}`;
          const prog = { t: 0 };
          loops.push(gsap.to(prog, {
            t: 1,
            duration: 3.4,
            ease: 'power1.inOut',
            repeat: -1,
            repeatDelay: 1.6,
            onUpdate: () => {
              const l = len * prog.t;
              path.style.strokeDashoffset = `${len - l}`;
              const p = path.getPointAtLength(l);
              dot.setAttribute('cx', `${p.x}`);
              dot.setAttribute('cy', `${p.y}`);
              halo.setAttribute('cx', `${p.x}`);
              halo.setAttribute('cy', `${p.y}`);
              clip.setAttribute('width', `${p.x}`);
            },
          }));
          loops.push(gsap.fromTo(halo, { attr: { r: 5 }, opacity: 0.7 }, { attr: { r: 14 }, opacity: 0, duration: 1.1, repeat: -1, ease: 'power1.out' }));
        }

        return runWhileVisible(root, loops);
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-7 rounded-2xl border border-sky-100 bg-slate-50/50 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5 gap-3">
            <h4 className="text-[14px] font-bold text-slate-950">Monthly revenue</h4>
            <div className="flex items-center gap-3 text-[11.5px] text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-950" /> Generated</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm border-2 border-dashed border-sky-400 bg-sky-100" /> Forecast</span>
            </div>
          </div>

          <div className="relative h-[260px] flex items-end justify-center gap-5 sm:gap-10 border-b border-slate-200 pb-0">
            {BARS.map((b) => (
              <div key={b.key} className="relative flex-1 max-w-[130px] h-full flex flex-col justify-end items-center">
                <span data-val={b.key} className="mb-1.5 text-[13px] sm:text-[14px] font-mono font-bold tabular-nums text-slate-950">
                  {fmt(BASE[b.key])}
                </span>
                <div data-barwrap className="w-full flex flex-col justify-end" style={{ height: '78%' }}>
                  <div
                    data-bar={b.key}
                    className={`w-full rounded-t-xl ${b.bar}`}
                    style={{ height: `${(BASE[b.key] / MAX) * 100}%`, minHeight: 8 }}
                  />
                </div>
              </div>
            ))}

            {/* Growth bubbles */}
            <span data-bubble className="absolute left-[27%] sm:left-[31%] top-[26%] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold tabular-nums flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span data-growth="this">+17.8%</span>
            </span>
            <span data-bubble className="absolute right-[18%] sm:right-[22%] top-[8%] px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-bold tabular-nums flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span data-growth="next">+13.6%</span>
            </span>
          </div>

          <div className="flex justify-center gap-5 sm:gap-10 pt-3">
            {BARS.map((b) => (
              <div key={b.key} className="flex-1 max-w-[130px] text-center">
                <p className="text-[13px] font-bold text-slate-950">{b.label}</p>
                <p className="text-[11.5px] text-slate-500 leading-snug">{b.caption}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Metric tiles */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 content-start">
          {TILES.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.key} data-tile className="rounded-2xl border border-sky-100 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </span>
                  <ArrowUpRight data-arrow className="w-4 h-4 text-emerald-500" />
                </div>

                {t.key === 'conf' ? (
                  <div className="flex items-center gap-3">
                    <svg width="52" height="52" viewBox="0 0 64 64" className="shrink-0 -rotate-90" aria-hidden="true">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="#e0f2fe" strokeWidth="7" />
                      <circle
                        data-ring
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray="163.4"
                        strokeDashoffset={163.4 * (1 - 0.84)}
                      />
                    </svg>
                    <p data-metric={t.key} className="text-[22px] font-bold font-mono tabular-nums text-slate-950 leading-none">
                      {t.min}%
                    </p>
                  </div>
                ) : (
                  <>
                    <p data-metric={t.key} className="text-[22px] font-bold font-mono tabular-nums text-slate-950 leading-none mb-3">
                      {t.key === 'pipe' ? `$${t.min}K` : 'money' in t && t.money ? fmt(t.min) : `${t.min}${t.unit}`}
                    </p>
                    <div className="h-1.5 rounded-full bg-sky-100 overflow-hidden">
                      <div data-fill={t.key} className="h-full rounded-full bg-sky-500" style={{ width: '40%' }} />
                    </div>
                  </>
                )}
                <p className="text-[12px] text-slate-500 mt-2.5">{t.label}</p>
              </div>
            );
          })}
        </div>

        {/* Daily revenue line */}
        <div data-chart className="lg:col-span-12 rounded-2xl border border-sky-100 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3 gap-3">
            <h4 className="text-[14px] font-bold text-slate-950">Revenue this month, day by day</h4>
            <span className="text-[11.5px] text-slate-400">Sample data</span>
          </div>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" aria-hidden="true">
            <defs>
              <linearGradient id="fc-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
              <clipPath id="fc-clip">
                <rect data-clip x="0" y="0" width={VB_W} height={VB_H} />
              </clipPath>
            </defs>
            {[0.25, 0.5, 0.75].map((f) => (
              <line key={f} x1="0" x2={VB_W} y1={VB_H * f} y2={VB_H * f} stroke="#e2e8f0" strokeDasharray="3 5" />
            ))}
            <path d={AREA} fill="url(#fc-area)" clipPath="url(#fc-clip)" />
            <path data-line d={LINE} fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <circle data-halo cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="6" fill="#38bdf8" opacity="0" />
            <circle data-dot cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4.5" fill="#fff" stroke="#0284c7" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
    </div>
  );
};
