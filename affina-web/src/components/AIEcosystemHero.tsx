'use client';

import React, { useState, useRef } from 'react';
import { ArrowRight, Play, Target, Globe, FileSpreadsheet, Sparkles, Mail, Database } from 'lucide-react';
import { gsap, useGSAP, scrollToId, MOTION_OK, runWhileVisible } from '../animation';

interface AIEcosystemHeroProps {
  onOpenDemo: (context?: string) => void;
}

// Angles (degrees) of the four glowing stars on the outer arc: two near the apex, two on the flanks.
const ARC_STARS = [-118, -62, -160, -20];

interface FloatingLogo {
  id: string;
  name: string;
  subtext: string;
  topDesktop: string;
  leftDesktop?: string;
  rightDesktop?: string;
  duration: number;
  delay: number;
  floatY: number;
  renderIcon: () => React.ReactNode;
}

// Floating logos: the real lead sources and integrations Affina connects to (see the Integrations section).
const LOGOS: FloatingLogo[] = [
  {
    id: 'googleads',
    name: 'Google Ads',
    subtext: 'Search & Display Lead Capture',
    topDesktop: '12%',
    leftDesktop: '8%',
    duration: 5.4,
    delay: 0.1,
    floatY: 9,
    renderIcon: () => (
      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white" style={{ background: '#4285F4' }}>
        <Target className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" strokeWidth={2.4} />
      </span>
    ),
  },
  {
    id: 'meta',
    name: 'Meta Ads',
    subtext: 'Facebook & Instagram Lead Forms',
    topDesktop: '28%',
    leftDesktop: '19%',
    duration: 5.1,
    delay: 0.3,
    floatY: 10,
    renderIcon: () => (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" fill="#0081FB" />
        <path
          d="M34.8 24C34.8 18 30 13.2 24 13.2C18 13.2 13.2 18 13.2 24C13.2 29.4 17.2 33.9 22.4 34.7V27.1H19.6V24H22.4V21.6C22.4 18.8 24 17.3 26.5 17.3C27.7 17.3 29 17.5 29 17.5V20.2H27.6C26.2 20.2 25.8 21.1 25.8 22V24H28.8L28.3 27.1H25.8V34.7C30.9 33.9 34.8 29.4 34.8 24Z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
  {
    id: 'website',
    name: 'Website',
    subtext: 'Form Enquiries Captured Automatically',
    topDesktop: '48%',
    leftDesktop: '10%',
    duration: 5.8,
    delay: 0.2,
    floatY: 8,
    renderIcon: () => (
      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white" style={{ background: '#0EA5E9' }}>
        <Globe className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" strokeWidth={2.4} />
      </span>
    ),
  },
  {
    id: 'excel',
    name: 'Excel',
    subtext: 'Import & Export Your Data',
    topDesktop: '68%',
    leftDesktop: '18%',
    duration: 5.5,
    delay: 0.4,
    floatY: 9,
    renderIcon: () => (
      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white" style={{ background: '#16A34A' }}>
        <FileSpreadsheet className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" strokeWidth={2.4} />
      </span>
    ),
  },
  {
    id: 'copilot',
    name: 'AI Copilot',
    subtext: 'Ask by Chat or by Voice',
    topDesktop: '84%',
    leftDesktop: '9%',
    duration: 5.3,
    delay: 0.5,
    floatY: 10,
    renderIcon: () => (
      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white" style={{ background: '#0F172A' }}>
        <Sparkles className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" strokeWidth={2.4} />
      </span>
    ),
  },
  {
    id: 'email',
    name: 'Email',
    subtext: 'Customer Emails Kept on Record',
    topDesktop: '12%',
    rightDesktop: '8%',
    duration: 5.7,
    delay: 0.15,
    floatY: 9,
    renderIcon: () => (
      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white" style={{ background: '#EA4335' }}>
        <Mail className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" strokeWidth={2.4} />
      </span>
    ),
  },
  {
    id: 'telephony',
    name: 'Phone Calls',
    subtext: 'Call and Track from Inside Affina',
    topDesktop: '28%',
    rightDesktop: '19%',
    duration: 5.2,
    delay: 0.35,
    floatY: 10,
    renderIcon: () => (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" fill="#0284C7" />
        <path
          d="M16.5 13C16.1 13 15.6 13.2 15.3 13.5L13.5 15.3C12.8 16 12.5 17 12.8 18C13.8 21.6 16.4 26.2 20.4 30.2C24.4 34.2 29 36.8 32.6 37.8C33.6 38.1 34.6 37.8 35.3 37.1L37.1 35.3C37.8 34.6 37.8 33.5 37.1 32.8L32.8 28.5C32.1 27.8 31 27.8 30.3 28.5L29 29.8C28.8 30 28.5 30.1 28.2 30C26.5 29.2 23.8 27.2 21.5 24.8C19.2 22.4 17.2 19.8 16.5 18C16.4 17.7 16.5 17.4 16.7 17.2L18 15.9C18.7 15.2 18.7 14.1 18 13.4L17.7 13.1C17.4 12.8 16.9 13 16.5 13Z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
  {
    id: 'database',
    name: 'Database',
    subtext: 'Keep Existing Data in Sync',
    topDesktop: '48%',
    rightDesktop: '10%',
    duration: 5.9,
    delay: 0.25,
    floatY: 8,
    renderIcon: () => (
      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white" style={{ background: '#6366F1' }}>
        <Database className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" strokeWidth={2.4} />
      </span>
    ),
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    subtext: 'Bring Over Your Existing CRM',
    topDesktop: '68%',
    rightDesktop: '18%',
    duration: 5.4,
    delay: 0.45,
    floatY: 9,
    renderIcon: () => (
      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white" style={{ background: '#E42527' }}>
        <span className="text-[13px] sm:text-[16px] font-bold leading-none">Z</span>
      </span>
    ),
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    subtext: 'Bring Over Your Existing CRM',
    topDesktop: '84%',
    rightDesktop: '9%',
    duration: 5.6,
    delay: 0.3,
    floatY: 10,
    renderIcon: () => (
      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white" style={{ background: '#FF7A59' }}>
        <span className="text-[13px] sm:text-[16px] font-bold leading-none">H</span>
      </span>
    ),
  },
];

export const AIEcosystemHero: React.FC<AIEcosystemHeroProps> = ({ onOpenDemo }) => {
  const [hoveredLogo, setHoveredLogo] = useState<FloatingLogo | null>(null);

  const rootRef = useRef<HTMLElement>(null);
  const agentCountRef = useRef<HTMLSpanElement>(null);
  const verticalCountRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // 1. Load timeline
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('[data-ring]', { scale: 0.8, autoAlpha: 0, duration: 1.6, stagger: 0.15, ease: 'power2.out' }, 0)
          .from('[data-hero-line]', { yPercent: 115, duration: 1.1, stagger: 0.14 }, 0.15)
          .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.14 }, 0.65)
          .from(
            '[data-logo]',
            { autoAlpha: 0, scale: 0.4, duration: 0.8, stagger: { each: 0.07, from: 'edges' }, ease: 'back.out(1.8)' },
            0.9,
          );

        // 2. Stat counters (12 industries, 8 integrations)
        const agents = agentCountRef.current;
        const verticals = verticalCountRef.current;
        if (agents && verticals) {
          const counts = { a: 0, v: 0 };
          agents.textContent = '0';
          verticals.textContent = '0';
          tl.to(
            counts,
            {
              a: 12,
              v: 8,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: () => {
                agents.textContent = String(Math.round(counts.a));
                verticals.textContent = String(Math.round(counts.v));
              },
            },
            1.1,
          );
        }

        // 3. Ambient motion
        // Endless loops are collected so they can be paused once the hero scrolls out of view.
        const loops: gsap.core.Animation[] = [];
        // (The slow ring / orbit rotation is a CSS animation: see .hero-spin-ring and .hero-orbit.)

        // Glowing arc stars: each one twinkles (4-point flare spins and pulses) out of phase.
        gsap.utils.toArray<HTMLElement>('[data-star]').forEach((star, i) => {
          loops.push(
            gsap.fromTo(
              star,
              { opacity: 0.25, scale: 0.55, rotation: 0 },
              {
                opacity: 1,
                scale: 1.3,
                rotation: 90,
                duration: 1.6 + (i % 2) * 0.5,
                delay: i * 0.45,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              },
            ),
          );
        });
        gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el) => {
          const dist = Number(el.dataset.float);
          loops.push(
            gsap.fromTo(
              el,
              { y: -dist / 2 },
              {
                y: dist / 2,
                duration: Number(el.dataset.dur),
                delay: Number(el.dataset.delay),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              },
            ),
          );
        });

        const stopLoops = runWhileVisible(rootRef.current, loops);
        return () => {
          stopLoops?.();
        };
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative bg-[linear-gradient(180deg,#f3f8ff_0%,#e9f2ff_52%,#f5f9ff_100%)] overflow-hidden border-b border-sky-100/70 pt-16 sm:pt-24 pb-20 sm:pb-28 lg:pb-32 min-h-[720px] sm:min-h-[820px] flex flex-col justify-center"
    >
      {/* 1. BACKGROUND LIGHT-BLUE DOME ARCH & AMBIENT RADIAL LIGHTING (REFERENCE 1:1 MATCH) */}
      <div
        aria-hidden="true"
        data-rings
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-start overflow-hidden select-none will-change-transform"
      >
        {/* Soft Radial Ambient Blue Glow behind central content */}
        <div className="absolute top-2 w-[680px] sm:w-[920px] lg:w-[1100px] h-[520px] sm:h-[650px] rounded-full bg-radial-blue-hero blur-3xl opacity-85" />

        {/* Outer Circular Dome Arc Line (as shown in reference image) */}
        <div data-ring className="absolute top-6 sm:top-8 w-[620px] sm:w-[820px] lg:w-[1040px] h-[620px] sm:h-[820px] lg:h-[1040px] rounded-full border border-sky-200/70 bg-gradient-to-b from-sky-100/40 via-sky-50/15 to-transparent">
          {/* Four glowing stars that travel slowly around the arc */}
          <div data-orbit className="hero-orbit absolute inset-0 will-change-transform">
            {ARC_STARS.map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <span
                  key={angle}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(50 + 50 * Math.cos(rad)).toFixed(3)}%`, top: `${(50 + 50 * Math.sin(rad)).toFixed(3)}%` }}
                >
                  <span data-star className="relative block w-3 h-3">
                    <span className="absolute inset-0 rounded-full bg-white shadow-[0_0_10px_3px_rgba(56,189,248,0.95),0_0_32px_10px_rgba(56,189,248,0.45)]" />
                    <span className="absolute left-1/2 top-1/2 h-px w-20 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
                    <span className="absolute left-1/2 top-1/2 w-px h-20 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-sky-400 to-transparent" />
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Middle Dashed Orbital Ring */}
        <div data-ring className="absolute top-16 sm:top-20 w-[480px] sm:w-[650px] lg:w-[820px] h-[480px] sm:h-[650px] lg:h-[820px] rounded-full">
          {/* Spins on the compositor (CSS), not through JS, so it costs no per-frame script work. */}
          <div className="hero-spin-ring absolute inset-0 rounded-full border border-dashed border-sky-200/50" />
        </div>

        {/* Inner Solid Orbital Ring */}
        <div data-ring className="absolute top-28 sm:top-32 w-[340px] sm:w-[480px] lg:w-[600px] h-[340px] sm:h-[480px] lg:h-[600px] rounded-full border border-sky-200/35" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* CENTERED HERO CONTENT (FROM AFFINA.WORK - REAL CONTENT) */}
        <div data-hero-content className="relative z-10 text-center max-w-2xl sm:max-w-3xl mx-auto px-2">
          {/* Main Headline with Light-Blue Gradient highlight (each line rises out of a mask) */}
          <h1 className="text-[36px] sm:text-[50px] lg:text-[58px] font-bold tracking-[-0.035em] text-slate-950 leading-[1.08] mb-4 sm:mb-5">
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span data-hero-line className="block">
                One{' '}
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                  Intelligent CRM.
                </span>
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span data-hero-line className="block">
                Infinite Possibilities.
              </span>
            </span>
          </h1>

          {/* Supporting Description from affina.work */}
          <p data-hero-fade className="text-[15px] sm:text-[17px] leading-[1.6] text-slate-600 max-w-xl mx-auto mb-7 sm:mb-8 font-normal">
            Capture leads from <span className="font-semibold text-slate-900">Meta Ads</span>, <span className="font-semibold text-slate-900">Google Ads</span> and your <span className="font-semibold text-slate-900">website</span>. Manage <span className="font-semibold text-slate-900">custom pipelines</span> and revenue forecasts, automate follow-ups, and call customers from one place, with an <span className="font-semibold text-slate-900">AI Copilot</span> for chat and voice.
          </p>

          {/* Compact CTA Buttons */}
          <div data-hero-fade className="flex flex-wrap items-center justify-center gap-3 sm:gap-3.5 mb-10 sm:mb-14">
            <button
              type="button"
              onClick={() => onOpenDemo('Book a Free Demo')}
              className="px-6 py-3 rounded-xl bg-slate-950 text-white text-[14px] font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all duration-150 shadow-[0_10px_30px_-8px_rgba(37,99,235,0.6)] flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
            >
              <span>Book a Free Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToId('ai-models')}
              className="px-6 py-3 rounded-xl bg-white/80 backdrop-blur border border-sky-200 text-slate-800 text-[14px] font-semibold hover:bg-sky-50/70 hover:border-sky-300 active:scale-[0.98] transition-all duration-150 shadow-2xs flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <Play className="w-3.5 h-3.5 fill-slate-700 text-slate-700" />
              <span>Explore AI Copilot</span>
            </button>
          </div>

          {/* 4. REAL STATS FROM AFFINA.WORK */}
          <div data-hero-fade className="pt-6 sm:pt-8 border-t border-sky-100 max-w-xl sm:max-w-2xl mx-auto grid grid-cols-3 gap-3 sm:gap-8 text-center">
            {/* Stat 1: industries supported */}
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-[28px] sm:text-[38px] font-bold text-slate-950 tracking-tight font-mono tabular-nums leading-none">
                <span ref={agentCountRef}>12</span>
              </p>
              <p className="text-[12px] sm:text-[13px] font-medium text-slate-500">
                Industries Supported
              </p>
            </div>

            {/* Stat 2: lead sources and integrations */}
            <div className="space-y-0.5 sm:space-y-1 border-x border-sky-100/90 px-1 sm:px-4">
              <p className="text-[28px] sm:text-[38px] font-bold text-slate-950 tracking-tight font-mono tabular-nums leading-none">
                <span ref={verticalCountRef}>8</span>
              </p>
              <p className="text-[12px] sm:text-[13px] font-medium text-slate-500">
                Integrations
              </p>
            </div>

            {/* Stat 3: unlimited users and custom roles */}
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-[21px] min-[420px]:text-[28px] sm:text-[38px] font-bold text-slate-950 tracking-tight font-mono tabular-nums leading-none">
                Unlimited
              </p>
              <p className="text-[12px] sm:text-[13px] font-medium text-slate-500">
                Users & Custom Roles
              </p>
            </div>
          </div>
        </div>

        {/* 5. FLOATING INTEGRATION LOGOS IN ORBITAL DOME ARCH (VISIBLE AT ALL SIZES >= 640px) */}
        <div data-logos-layer className="hidden sm:block absolute inset-0 pointer-events-none select-none">
          {LOGOS.map((logo) => {
            const isHovered = hoveredLogo?.id === logo.id;
            const styleObj: React.CSSProperties = {
              top: logo.topDesktop,
              position: 'absolute',
            };
            if (logo.leftDesktop) styleObj.left = logo.leftDesktop;
            if (logo.rightDesktop) styleObj.right = logo.rightDesktop;

            return (
              <div
                key={logo.id}
                style={styleObj}
                className="pointer-events-auto z-20 -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  data-logo
                  data-float={logo.floatY}
                  data-dur={logo.duration}
                  data-delay={logo.delay}
                  onMouseEnter={() => setHoveredLogo(logo)}
                  onMouseLeave={() => setHoveredLogo(null)}
                  className="relative group cursor-pointer"
                >
                  {/* Subtle Light-Blue Ambient Glow behind logo */}
                  <div className="absolute -inset-1.5 rounded-full bg-sky-200/50 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-200" />

                  {/* Circular White Container */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] rounded-full bg-gradient-to-b from-white to-sky-50 backdrop-blur-md border border-white shadow-[0_14px_34px_-10px_rgba(59,130,246,0.45),inset_0_2px_0_rgba(255,255,255,1),inset_0_-6px_14px_rgba(147,197,253,0.25)] flex items-center justify-center p-2.5 sm:p-3 transition-transform duration-200 group-hover:scale-110">
                    {logo.renderIcon()}
                  </div>

                  {/* Interactive Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 bg-slate-950 text-white rounded-lg px-2.5 py-1 text-[11px] font-medium whitespace-nowrap shadow-md pointer-events-none z-30">
                      <span className="font-semibold">{logo.name}</span> · {logo.subtext}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. MOBILE LOGO STRIP (< 640px) */}
        <div className="sm:hidden mt-8 pt-6 border-t border-sky-100/70">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
            Connects With Your Lead Sources
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-xs mx-auto">
            {LOGOS.slice(0, 8).map((logo) => (
              <div
                key={logo.id}
                className="w-10 h-10 rounded-full bg-white shadow-card border border-sky-100 flex items-center justify-center p-2"
                title={`${logo.name} — ${logo.subtext}`}
              >
                {logo.renderIcon()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
