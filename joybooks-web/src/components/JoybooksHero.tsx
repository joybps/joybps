'use client';

import React, { useCallback, useRef } from 'react';
import { ArrowRight, Play, Check, TrendingUp } from 'lucide-react';
import { gsap, useGSAP, scrollToId, MOTION_OK } from '../animation';
import { CoinSkyline } from './CoinSkyline';
import { LiveChip } from './FuturisticPrimitives';

/*
 * Coin Skyline hero. Text on the left; a revenue skyline made of stacked coins rises along the bottom of the hero.
 * Previous heroes are kept in JoybooksHeroRiver.tsx, JoybooksHeroLedger.tsx and JoybooksHeroBalance.tsx.
 */

interface JoybooksHeroProps {
  onOpenDemo: () => void;
}

const POINTS = ['Invoicing and bills', 'Bank reconciliation', 'Real-time reports'];

export const JoybooksHero: React.FC<JoybooksHeroProps> = ({ onOpenDemo }) => {
  const rootRef = useRef<HTMLElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const onTotal = useCallback((d: number) => {
    if (totalRef.current) totalRef.current.textContent = '$' + Math.round(d).toLocaleString('en-US');
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('[data-hero-line]', { yPercent: 115, duration: 1.1, stagger: 0.13 }, 0.1)
          .from('[data-hero-fade]', { autoAlpha: 0, y: 22, duration: 0.8, stagger: 0.1 }, 0.4)
          .from('[data-sky]', { autoAlpha: 0, duration: 1 }, 0.5)
          .from('[data-growth]', { autoAlpha: 0, y: 14, scale: 0.9, duration: 0.8, ease: 'back.out(1.6)' }, 3.2);
        return () => {
          tl.kill();
        };
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-tech-grid border-b border-sky-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div className="aurora aurora-sky -top-24 -left-24 w-[520px] h-[520px]" />
        <div className="aurora aurora-emerald bottom-[-140px] right-[-100px] w-[620px] h-[620px]" />
        <div className="aurora aurora-indigo top-1/3 right-1/4 w-[420px] h-[420px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/30 to-white/60" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 lg:pb-[200px]">
        <div className="relative z-10 text-center lg:text-left max-w-[640px] mx-auto lg:mx-0">
          <div data-hero-fade className="inline-flex items-center gap-2 mb-5">
            <LiveChip label="Cloud accounting software" tone="green" />
          </div>
          <h1 className="text-[42px] sm:text-[58px] lg:text-[clamp(46px,4.6vw,68px)] font-bold tracking-[-0.035em] leading-[1.02] text-slate-950 mb-6">
            <span className="block overflow-hidden pb-2 -mb-1">
              <span data-hero-line className="block">Every invoice.</span>
            </span>
            <span className="block overflow-hidden pb-2 -mb-1">
              <span data-hero-line className="block">Every payment.</span>
            </span>
            <span className="block overflow-hidden pb-4 -mb-2">
              <span data-hero-line className="block text-shimmer pb-3 -mb-1">Watch it all add up.</span>
            </span>
          </h1>
          <p data-hero-fade className="text-[16px] sm:text-[17px] leading-[1.65] text-slate-600 max-w-lg mx-auto lg:mx-0 mb-7">
            Joybooks is a complete finance and accounting platform. <span className="font-semibold text-slate-900">Invoices, bills, expenses, banking, inventory, taxes and reports</span>{' '}
            work together, so you always know where your money stands.
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

        {/* skyline: in flow on small screens, anchored to the bottom on large ones */}
        <div data-sky className="relative mt-10 lg:mt-0 -mx-4 sm:mx-0 h-[320px] sm:h-[380px] lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-[440px] lg:mx-0">
          <CoinSkyline className="absolute inset-0 w-full h-full" onTotal={onTotal} />
          <div data-growth className="pointer-events-none absolute right-4 sm:right-8 top-2 flex items-center gap-3 rounded-2xl bg-white/95 border border-emerald-100 shadow-float px-4 py-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5" />
            </span>
            <span>
              <span className="block text-[11px] text-slate-400 leading-none mb-1">Revenue this year</span>
              <span className="flex items-center gap-2">
                <span ref={totalRef} className="text-[20px] font-extrabold text-slate-950 leading-none tabular-nums">$0</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">+38%</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
