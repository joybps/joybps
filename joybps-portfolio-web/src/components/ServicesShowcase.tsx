'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { SpotlightCard } from './FuturisticPrimitives';
import { Icon } from './Icon';
import { SERVICES } from '../data/services';

const frame = 'relative h-[190px] rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 overflow-hidden';

/** Website: a page assembles itself block by block. */
const WebsiteVisual: React.FC = () => (
  <div aria-hidden="true" className={frame}>
    <div data-par className="absolute inset-x-6 top-5 bottom-[-14px] rounded-t-xl bg-white border border-slate-200 shadow-card overflow-hidden">
      <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-slate-100 bg-slate-50">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-300" /><span className="w-1.5 h-1.5 rounded-full bg-amber-300" /><span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
        <span className="ml-2 h-2.5 flex-1 rounded bg-white border border-slate-100" />
      </div>
      <div className="p-3 space-y-2.5">
        <div className="relative h-[52px] rounded-lg bg-gradient-to-r from-sky-400 to-indigo-500 overflow-hidden p-2.5 space-y-1.5">
          <span className="block h-2 w-2/5 rounded bg-white/90" />
          <span className="block h-1.5 w-1/4 rounded bg-white/60" />
          <span className="v-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="v-rise rounded-md border border-slate-100 p-1.5" style={{ animationDelay: `${i * 0.35}s` }}>
              <span className="block h-5 rounded bg-sky-100" />
              <span className="block mt-1.5 h-1.5 w-4/5 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const COLS = [38, 62, 48, 80, 58, 92, 70];
/** Web application: a dashboard whose charts grow and draw. */
const WebAppVisual: React.FC = () => (
  <div aria-hidden="true" className={frame}>
    <div data-par className="absolute inset-x-5 top-5 bottom-[-12px] rounded-t-xl bg-white border border-slate-200 shadow-card flex overflow-hidden">
      <div className="w-[52px] bg-slate-50 border-r border-slate-100 p-2 space-y-2">
        <span className="block h-2 w-full rounded bg-sky-300" />
        {[0, 1, 2, 3].map((i) => <span key={i} className="block h-1.5 w-4/5 rounded bg-slate-200" />)}
      </div>
      <div className="flex-1 p-3 space-y-2.5">
        <div className="flex gap-2">
          {['₹4.2L', '128', '94%'].map((k, i) => (
            <span key={k} className="v-pop rounded-md bg-sky-50 border border-sky-100 px-2 py-1 text-[10px] font-bold text-sky-800" style={{ animationDelay: `${i * 0.4}s` }}>{k}</span>
          ))}
        </div>
        <div className="relative h-[70px]">
          <div className="absolute inset-0 flex items-end gap-1.5">
            {COLS.map((h, i) => <span key={i} className="v-grow flex-1 rounded-t bg-gradient-to-t from-sky-400 to-indigo-400" style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }} />)}
          </div>
          <svg viewBox="0 0 200 70" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <path d="M0 52 C30 40 45 56 70 36 S120 30 140 20 S180 14 200 6" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" className="v-draw" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

/** Mobile app: two phones drift while the screen lists slide in. */
const MobileVisual: React.FC = () => (
  <div aria-hidden="true" className={frame}>
    <div data-par className="absolute inset-0">
      <div className="v-float absolute left-[18%] top-6 w-[74px] h-[132px] rounded-[18px] border-[3px] border-slate-300 bg-white shadow-card -rotate-6 overflow-hidden" style={{ animationDelay: '0.8s' }}>
        <span className="block h-full w-full bg-gradient-to-b from-indigo-100 to-white" />
      </div>
      <div className="v-float absolute left-[42%] top-3 w-[82px] h-[150px] rounded-[20px] border-[3px] border-slate-800 bg-white shadow-float overflow-hidden">
        <span className="mx-auto mt-1 block h-1 w-8 rounded-full bg-slate-800" />
        <div className="p-2 space-y-1.5">
          <span className="block h-8 rounded-lg bg-gradient-to-r from-sky-400 to-indigo-500" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="v-rise flex items-center gap-1.5 rounded-md border border-slate-100 p-1" style={{ animationDelay: `${i * 0.4}s` }}>
              <span className="w-4 h-4 rounded bg-sky-100 shrink-0" />
              <span className="flex-1 space-y-1"><span className="block h-1 rounded bg-slate-300" /><span className="block h-1 w-2/3 rounded bg-slate-200" /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CODE: [number, string][] = [
  [46, 'bg-sky-400'],
  [72, 'bg-slate-300'],
  [58, 'bg-indigo-300'],
  [84, 'bg-slate-300'],
  [40, 'bg-emerald-300'],
  [66, 'bg-slate-300'],
];
/** Custom software: lines of code are written, module chips connect. */
const CustomVisual: React.FC = () => (
  <div aria-hidden="true" className={frame}>
    <div data-par className="absolute inset-x-5 top-5 bottom-[-12px] rounded-t-xl bg-slate-900 shadow-card overflow-hidden">
      <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[9px] font-mono text-slate-400">workflow.ts</span>
      </div>
      <div className="p-3 space-y-2">
        {CODE.map(([w, c], i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-slate-600 w-3">{i + 1}</span>
            <span className={`v-type block h-1.5 rounded ${c}`} style={{ width: `${w}%`, animationDelay: `${i * 0.28}s` }} />
          </div>
        ))}
      </div>
      <div className="absolute right-3 top-9 space-y-1.5">
        {['API', 'DB', 'AI'].map((m, i) => (
          <span key={m} className="v-pop block rounded-md bg-white/10 border border-white/20 px-2 py-0.5 text-[9.5px] font-mono font-bold text-sky-200" style={{ animationDelay: `${0.8 + i * 0.5}s` }}>{m}</span>
        ))}
      </div>
    </div>
  </div>
);

/** Technical support: a shield pulses with watchfulness while tickets resolve. */
const SupportVisual: React.FC = () => (
  <div aria-hidden="true" className={`${frame} flex items-center justify-center`}>
    <div data-par className="relative flex items-center justify-center w-full h-full">
      {[0, 1, 2].map((i) => <span key={i} className="v-ring absolute w-24 h-24 rounded-full border border-sky-400" style={{ animationDelay: `${i}s` }} />)}
      <span className="relative w-14 h-14 rounded-2xl bg-white border border-sky-200 shadow-float flex items-center justify-center text-sky-600"><ShieldCheck className="w-7 h-7" /></span>
      <span className="v-pop absolute left-4 top-6 rounded-full bg-white border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 shadow-sm">Resolved</span>
      <span className="v-pop absolute right-4 bottom-7 rounded-full bg-white border border-sky-200 px-2 py-0.5 text-[10px] font-bold text-sky-700 shadow-sm" style={{ animationDelay: '1.4s' }}>Uptime 99.9%</span>
    </div>
  </div>
);

const VISUALS: Record<string, React.FC> = {
  'website-development': WebsiteVisual,
  'web-application-development': WebAppVisual,
  'mobile-app-development': MobileVisual,
  'custom-software-development': CustomVisual,
  'technical-support': SupportVisual,
};

const AUTO_MS = 4200;

/**
 * Services carousel: wide rectangular cards in a scroll-snap track that slides by itself. It pauses while hovered,
 * focused, touched or off screen, loops back to the start, and stays usable by swipe, arrows, dots or keyboard.
 * Reduced motion: no auto-slide. Every card is one link; all text is real HTML.
 */
export const ServicesShowcase: React.FC = () => {
  const trackRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const visible = useRef(true);
  const [active, setActive] = useState(0);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const n = SERVICES.length;
    const idx = ((i % n) + n) % n;
    const card = track.children[idx] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }, []);

  // Which card is at the start of the track.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const kids = Array.from(track.children) as HTMLElement[];
        const x = track.scrollLeft + track.offsetLeft;
        let best = 0;
        let d = Infinity;
        kids.forEach((k, i) => {
          const dd = Math.abs(k.offsetLeft - x);
          if (dd < d) {
            d = dd;
            best = i;
          }
        });
        setActive(best);
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Auto-slide.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
    }, { threshold: 0.3 });
    io.observe(root);
    const id = window.setInterval(() => {
      if (paused.current || !visible.current || document.hidden) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const kids = Array.from(track.children) as HTMLElement[];
        const x = track.scrollLeft + track.offsetLeft;
        const next = kids.find((k) => k.offsetLeft > x + 4);
        if (next) track.scrollTo({ left: next.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      }
    }, AUTO_MS);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, []);

  const hold = () => {
    paused.current = true;
  };
  const release = () => {
    paused.current = false;
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our services"
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocus={hold}
      onBlur={release}
      onTouchStart={hold}
      onTouchEnd={() => window.setTimeout(release, 4000)}
    >
      <ul
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SERVICES.map((s, idx) => {
          const V = VISUALS[s.slug];
          return (
            <li key={s.slug} aria-roledescription="slide" aria-label={`${idx + 1} of ${SERVICES.length}`} className="snap-start shrink-0 w-[86%] sm:w-[560px] lg:w-[600px]">
              <SpotlightCard className="group relative h-full rounded-3xl bg-white border border-sky-100 shadow-card p-4 flex flex-col sm:flex-row gap-5 transition-[box-shadow,border-color] duration-500 hover:border-sky-300 hover:shadow-float">
                {V && (
                  <div className="sm:w-[44%] shrink-0 sm:min-h-[230px] [&>div]:h-[190px] sm:[&>div]:h-full">
                    <V />
                  </div>
                )}
                <div className="px-1.5 pb-1.5 sm:py-2 flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.tone}`}>
                      <Icon name={s.icon} className="w-[18px] h-[18px]" />
                    </span>
                    <h3 className="text-[18px] font-bold text-slate-950 leading-tight">
                      <Link href="#contact" className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-sky-400 focus-visible:after:rounded-3xl">
                        {s.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-[14px] text-slate-600 leading-relaxed mb-3">{s.short}</p>
                  <ul className="mb-4 flex flex-wrap gap-1.5">
                    {s.stack.slice(0, 4).map((t) => (
                      <li key={t} className="rounded-full bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-500 px-2 py-0.5">{t}</li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-sky-700 group-hover:text-sky-900">
                    Explore <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </SpotlightCard>
            </li>
          );
        })}
      </ul>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous service" className="w-10 h-10 rounded-full border border-sky-200 bg-white text-slate-700 flex items-center justify-center hover:bg-sky-50 hover:border-sky-300 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2">
          {SERVICES.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${s.name}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === active ? 'w-7 bg-sky-500' : 'w-2 bg-sky-200 hover:bg-sky-300'}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => goTo(active + 1)} aria-label="Next service" className="w-10 h-10 rounded-full border border-sky-200 bg-white text-slate-700 flex items-center justify-center hover:bg-sky-50 hover:border-sky-300 transition-colors cursor-pointer">
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
