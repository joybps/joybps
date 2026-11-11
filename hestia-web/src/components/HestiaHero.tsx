'use client';

import React, { useCallback, useRef } from 'react';
import { ArrowRight, Play, Check, Crown, UserCog, BadgeCheck, UserRound } from 'lucide-react';
import { gsap, useGSAP, scrollToId, MOTION_OK, runWhileVisible } from '../animation';
import { ConstellationCanvas } from './ConstellationCanvas';
import { LiveChip } from './FuturisticPrimitives';

interface HestiaHeroProps {
  onOpenDemo: () => void;
}

const POINTS = ['Every role, one workspace', 'AI chat assistant for everyone', 'Multi-tenant and secure'];
const EVENTS = [
  'Leave approved · Priya',
  'Shift swapped · Arun',
  'Payslips sent · 142 people',
  'Task completed · Onboarding',
  'Announcement posted',
  'Checked in · 09:02',
];

export const HestiaHero: React.FC<HestiaHeroProps> = ({ onOpenDemo }) => {
  const rootRef = useRef<HTMLElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const toastText = useRef<HTMLSpanElement>(null);

  // a pulse reached the hub: announce what "arrived"
  const onPulse = useCallback((n: number) => {
    const el = toastRef.current;
    const tx = toastText.current;
    if (!el || !tx) return;
    tx.textContent = EVENTS[n % EVENTS.length];
    gsap.killTweensOf(el);
    gsap.fromTo(el, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    gsap.to(el, { autoAlpha: 0, y: -6, duration: 0.5, delay: 1.9, ease: 'power2.in' });
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loops: gsap.core.Animation[] = [];

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('[data-hero-line]', { yPercent: 115, duration: 1.1, stagger: 0.14 }, 0.1)
          .from('[data-hero-fade]', { autoAlpha: 0, y: 22, duration: 0.8, stagger: 0.1 }, 0.5)
          .from('[data-stage-ring]', { scale: 0.7, autoAlpha: 0, duration: 1.4, stagger: 0.15, ease: 'power2.out' }, 0.2)
          .from('[data-hub]', { scale: 0.4, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.6)' }, 1.4)
          .from('[data-chip]', { autoAlpha: 0, y: 30, scale: 0.88, duration: 0.9, stagger: 0.16, ease: 'back.out(1.5)' }, 2.4);

        gsap.utils.toArray<HTMLElement>('[data-chip]').forEach((el, i) => {
          loops.push(gsap.to(el, { y: i % 2 ? 9 : -9, duration: 3.4 + i * 0.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.3 }));
        });
        loops.push(gsap.to('[data-stage-ring="spin"]', { rotation: 360, duration: 90, repeat: -1, ease: 'none' }));
        loops.push(gsap.to('[data-stage-ring="spin2"]', { rotation: -360, duration: 130, repeat: -1, ease: 'none' }));

        mm.add('(min-width: 1024px)', () => {
          gsap.to('[data-stage]', {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
          });
        });

        const stopWatching = runWhileVisible(rootRef.current, loops);
        return () => stopWatching();
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-tech-grid border-b border-sky-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div className="aurora aurora-sky -top-24 -left-24 w-[520px] h-[520px]" />
        <div className="aurora aurora-indigo top-10 right-[-120px] w-[560px] h-[560px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white" />
      </div>

      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-0 lg:min-h-[760px] grid lg:grid-cols-[1fr_minmax(480px,640px)_1fr] gap-8 lg:gap-6 items-center">
        {/* Left: title */}
        <div className="relative z-10 text-center lg:text-left lg:pr-2">
          <div data-hero-fade className="inline-flex items-center gap-2 mb-5">
            <LiveChip label="AI-powered HRMS" />
          </div>
          <h1 className="text-[46px] sm:text-[60px] lg:text-[clamp(36px,3.5vw,52px)] font-bold tracking-[-0.035em] leading-[1.02] text-slate-950">
            <span className="block overflow-hidden pb-2 -mb-1">
              <span data-hero-line className="block whitespace-nowrap">Your people.</span>
            </span>
            <span className="block overflow-hidden pb-2 -mb-1">
              <span data-hero-line className="block whitespace-nowrap">Connected.</span>
            </span>
            <span className="block overflow-hidden pb-4 -mb-2">
              <span data-hero-line className="block whitespace-nowrap text-shimmer pb-3 -mb-1">In one place.</span>
            </span>
          </h1>
        </div>

        {/* Center: constellation */}
        <div className="relative w-full order-first lg:order-none">
          <div data-stage className="relative -mx-4 w-[calc(100%+2rem)] aspect-square sm:mx-auto sm:w-full sm:max-w-[580px] lg:ml-[-40px] lg:mr-0 lg:w-[calc(100%+80px)] lg:max-w-[760px]">
            <div className="absolute inset-[6%] rounded-full bg-radial-blue-hero" />
            <div data-stage-ring className="absolute inset-[3%] rounded-full border border-sky-200/70" />
            <div data-stage-ring="spin" className="absolute inset-[12%] rounded-full border border-dashed border-sky-300/60 will-change-transform" />
            <div data-stage-ring="spin2" className="absolute -inset-[3%] rounded-full border border-dashed border-indigo-200/60 will-change-transform" />

            <ConstellationCanvas className="absolute inset-0 w-full h-full" onPulse={onPulse} />

            {/* hub */}
            <div data-hub className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="anim-pulse-ring absolute inset-0 rounded-full bg-sky-400/50" />
              <span className="relative flex w-[76px] h-[76px] sm:w-[92px] sm:h-[92px] rounded-full items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-500 shadow-float">
                <svg viewBox="0 0 48 48" className="w-[44px] h-[44px] sm:w-[54px] sm:h-[54px] anim-hub-spin" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="24" y1="24" x2="24" y2="8" />
                  <line x1="24" y1="24" x2="38" y2="32" />
                  <line x1="24" y1="24" x2="10" y2="32" />
                  <circle cx="24" cy="8" r="4.5" fill="white" />
                  <circle cx="38" cy="32" r="4.5" fill="white" />
                  <circle cx="10" cy="32" r="4.5" fill="white" />
                  <circle cx="24" cy="24" r="6" fill="white" stroke="none" />
                </svg>
              </span>
            </div>

            {/* live event toast */}
            <div ref={toastRef} className="absolute left-1/2 -translate-x-1/2 top-[1%] opacity-0 invisible">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur border border-sky-100 shadow-float text-[12px] font-semibold text-slate-800 whitespace-nowrap">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                </span>
                <span ref={toastText}>Leave approved · Priya</span>
              </span>
            </div>

            {/* role chips */}
            <div data-chip className="absolute top-[10%] left-3 sm:left-[-2%] lg:left-[1%] rounded-2xl bg-white/90 backdrop-blur-md border border-sky-100 shadow-float px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center"><Crown className="w-4 h-4" /></span>
                <div>
                  <p className="text-[12.5px] font-semibold text-slate-900 leading-tight">Director</p>
                  <p className="text-[10.5px] text-slate-500 leading-tight">Sees every team</p>
                </div>
              </div>
            </div>

            <div data-chip className="absolute bottom-[8%] right-3 sm:right-[-2%] lg:right-[1%] rounded-2xl bg-white/90 backdrop-blur-md border border-sky-100 shadow-float px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center"><UserCog className="w-4 h-4" /></span>
                <div>
                  <p className="text-[12.5px] font-semibold text-slate-900 leading-tight">Manager</p>
                  <p className="text-[10.5px] text-slate-500 leading-tight">Approves leave</p>
                </div>
              </div>
            </div>

            <div data-chip className="hidden sm:block absolute top-[44%] right-[-6%] lg:right-[9%] rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-100 shadow-float px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"><BadgeCheck className="w-4 h-4" /></span>
                <div>
                  <p className="text-[12.5px] font-semibold text-slate-900 leading-tight">HR</p>
                  <p className="text-[10.5px] text-slate-500 leading-tight">Payroll and hiring</p>
                </div>
              </div>
            </div>

            <div data-chip className="hidden sm:block absolute bottom-[26%] left-[-6%] lg:left-[5%] rounded-2xl bg-white/90 backdrop-blur-md border border-sky-100 shadow-float px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center"><UserRound className="w-4 h-4" /></span>
                <div>
                  <p className="text-[12.5px] font-semibold text-slate-900 leading-tight">Employee</p>
                  <p className="text-[10.5px] text-slate-500 leading-tight">Check in, request leave</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: description + actions */}
        <div className="relative z-10 text-center lg:text-left lg:pl-2">
          <p data-hero-fade className="text-[16px] sm:text-[17px] leading-[1.65] text-slate-600 max-w-md mx-auto lg:mx-0 mb-7">
            Hestia brings <span className="font-semibold text-slate-900">attendance, leave, tasks, payroll and hiring</span> into one platform, with
            an <span className="font-semibold text-slate-900">AI assistant</span> and role-based access for every person in your organisation.
          </p>

          <div data-hero-fade className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-7">
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

          <ul data-hero-fade className="inline-flex flex-col items-start gap-2.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
                <span className="w-4.5 h-4.5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
