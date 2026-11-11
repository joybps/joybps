'use client';

import React, { useRef } from 'react';
import { ArrowRight, Play, Phone, MessageSquare, UserCheck, Check, Sparkles } from 'lucide-react';
import { gsap, useGSAP, scrollToId, MOTION_OK, runWhileVisible } from '../animation';
import { PointOrb } from './PointOrb';
import { LiveChip } from './FuturisticPrimitives';

interface IrisHeroProps {
  onOpenDemo: () => void;
}

const POINTS = ['Voice and chat agents', 'Live human handover', 'Every call and chat on record'];
const BARS = 22;

export const IrisHero: React.FC<IrisHeroProps> = ({ onOpenDemo }) => {
  const rootRef = useRef<HTMLElement>(null);
  const amp = useRef(0.25);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loops: gsap.core.Animation[] = [];

        // 1. Entrance
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('[data-hero-line]', { yPercent: 115, duration: 1.1, stagger: 0.14 }, 0.1)
          .from('[data-hero-fade]', { autoAlpha: 0, y: 22, duration: 0.8, stagger: 0.1 }, 0.5)
          .from('[data-stage-ring]', { scale: 0.7, autoAlpha: 0, duration: 1.4, stagger: 0.15, ease: 'power2.out' }, 0.2)
          .from('[data-orb]', { scale: 0.6, autoAlpha: 0, duration: 1.5, ease: 'expo.out' }, 0.3)
          .from('[data-chip]', { autoAlpha: 0, y: 30, scale: 0.88, duration: 0.9, stagger: 0.14, ease: 'back.out(1.5)' }, 0.9);

        // 2. The orb "speaks": its level rises and falls in bursts, like someone talking
        const talk = () => {
          const next = gsap.utils.random(0.2, 0.8);
          gsap.to(amp, { current: next, duration: gsap.utils.random(1.8, 3), ease: 'sine.inOut', onComplete: talk });
        };
        talk();

        // 3. Voice bars follow the same level every frame
        const bars = gsap.utils.toArray<HTMLElement>('[data-bar]');
        const setBar = bars.map((b) => gsap.quickSetter(b, 'scaleY'));
        const tick = () => {
          const t = gsap.ticker.time;
          const a = amp.current;
          for (let i = 0; i < bars.length; i++) {
            const wob = 0.35 + 0.65 * Math.abs(Math.sin(t * (3 + (i % 5) * 0.9) + i * 0.6));
            setBar[i](0.14 + a * wob * 0.86);
          }
        };
        gsap.ticker.add(tick);

        // 4. Floating chips + rings
        gsap.utils.toArray<HTMLElement>('[data-chip]').forEach((el, i) => {
          loops.push(
            gsap.to(el, { y: i % 2 ? 10 : -10, duration: 3.2 + i * 0.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.3 }),
          );
        });
        loops.push(gsap.to('[data-stage-ring="spin"]', { rotation: 360, duration: 80, repeat: -1, ease: 'none' }));
        loops.push(gsap.to('[data-stage-ring="spin2"]', { rotation: -360, duration: 120, repeat: -1, ease: 'none' }));

        // 5. Parallax on scroll (desktop)
        mm.add('(min-width: 1024px)', () => {
          gsap.to('[data-stage]', {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
          });
        });

        const stopWatching = runWhileVisible(rootRef.current, loops);
        return () => {
          stopWatching();
          gsap.ticker.remove(tick);
          gsap.killTweensOf(amp);
        };
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-tech-grid border-b border-sky-100">
      {/* ambient light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div className="aurora aurora-sky -top-24 -left-24 w-[520px] h-[520px]" />
        <div className="aurora aurora-indigo top-10 right-[-120px] w-[560px] h-[560px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-0 lg:min-h-[620px] grid lg:grid-cols-[1fr_minmax(440px,560px)_1fr] gap-8 lg:gap-6 items-center">
        {/* Left: title */}
        <div className="text-center lg:text-left lg:pr-2">
          <div data-hero-fade className="inline-flex items-center gap-2 mb-5">
            <LiveChip label="AI agents online 24/7" />
          </div>
          <h1 className="text-[46px] sm:text-[60px] lg:text-[clamp(40px,4.5vw,66px)] font-bold tracking-[-0.035em] leading-[1.02] text-slate-950">
            <span className="block overflow-hidden pb-2 -mb-1">
              <span data-hero-line className="block">Every call.</span>
            </span>
            <span className="block overflow-hidden pb-2 -mb-1">
              <span data-hero-line className="block">Every chat.</span>
            </span>
            <span className="block overflow-hidden pb-4 -mb-2">
              <span data-hero-line className="block text-shimmer pb-3 -mb-1">Answered by AI.</span>
            </span>
          </h1>
        </div>

        {/* Center: orb stage */}
        <div className="relative w-full order-first lg:order-none">
          <div data-stage className="relative mx-auto w-full max-w-[380px] sm:max-w-[520px] lg:max-w-[560px] aspect-square">
            <div className="absolute inset-[6%] rounded-full bg-radial-blue-hero" />
            <div data-stage-ring className="absolute inset-[4%] rounded-full border border-sky-200/70" />
            <div data-stage-ring="spin" className="absolute inset-[12%] rounded-full border border-dashed border-sky-300/60 will-change-transform" />
            <div data-stage-ring="spin2" className="absolute -inset-[3%] rounded-full border border-dashed border-indigo-200/60 will-change-transform" />
            <div className="absolute inset-[18%] rounded-full bg-gradient-to-br from-cyan-200/40 via-sky-300/20 to-indigo-300/30 " />

            <div data-orb className="absolute inset-0">
              <PointOrb amp={amp} className="w-full h-full" />
            </div>

            {/* Floating product chips */}
            <div data-chip className="absolute top-[2%] left-0 sm:left-[-2%] lg:left-[-4%] w-[160px] sm:w-[200px] rounded-2xl bg-white/90 backdrop-blur-md border border-sky-100 shadow-float p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] font-semibold text-slate-500">Chat Agent</span>
              </div>
              <p className="text-[12.5px] leading-snug text-slate-800 rounded-xl rounded-tl-sm bg-sky-50 border border-sky-100 px-2.5 py-2">
                Hi! I’m Iris. How can I help you today?
              </p>
            </div>

            <div data-chip className="absolute bottom-[2%] right-0 sm:right-[-2%] lg:right-[-4%] w-[190px] sm:w-[220px] rounded-2xl bg-white/90 backdrop-blur-md border border-sky-100 shadow-float p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  Voice Agent · on call
                </span>
                <span className="font-mono text-[11px] text-slate-500">02:14</span>
              </div>
              <div className="flex items-center justify-center gap-[3px] h-9" aria-hidden="true">
                {Array.from({ length: BARS }).map((_, i) => (
                  <span key={i} data-bar className="w-[3px] h-full rounded-full bg-gradient-to-t from-sky-500 to-indigo-400 origin-center" style={{ transform: 'scaleY(0.3)' }} />
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500 text-center">Virtual number · answered by AI</p>
            </div>

            <div data-chip className="hidden sm:block absolute top-[42%] right-[-6%] lg:right-[-2%] rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-100 shadow-float px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-slate-900 leading-tight">Human agent online</p>
                  <p className="text-[10.5px] text-slate-500 leading-tight">Transfer ready</p>
                </div>
              </div>
            </div>

            <div data-chip className="hidden sm:block absolute bottom-[30%] left-[-6%] lg:left-[-2%] rounded-2xl bg-white/90 backdrop-blur-md border border-sky-100 shadow-float px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-slate-900 leading-tight">AI summary ready</p>
                  <p className="text-[10.5px] text-slate-500 leading-tight">Transcript saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: description + actions */}
        <div className="text-center lg:text-left lg:pl-2">
          <p data-hero-fade className="text-[16px] sm:text-[17px] leading-[1.65] text-slate-600 max-w-md mx-auto lg:mx-0 mb-7">
            Iris gives your organisation <span className="font-semibold text-slate-900">voice and chat AI agents</span> that talk to customers
            around the clock, and hand over to your team the moment a <span className="font-semibold text-slate-900">human</span> is needed.
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
              onClick={() => scrollToId('agents')}
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
