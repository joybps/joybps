'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '../animation';
import { CosmosCanvas } from './CosmosCanvas';
import { MagneticLink } from './MagneticLink';

/**
 * Hero: "Neural Cosmos". A galaxy of stars that gathers into the words Joyrts, Agents, Automation, Insight (see CosmosCanvas).
 * No scroll-driven animation. The empty `anchor` div reserves the space where the words are formed, so the DOM copy and the
 * canvas stay aligned at every screen size. Copy fades in once on load with GSAP.
 */
export const JoyrtsHero: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('[data-hero-in]', { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.12, delay: 0.3, ease: 'power3.out', clearProps: 'transform' });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative bg-tech-grid border-b border-sky-100 overflow-hidden h-[min(calc(100svh/var(--zf)-4rem),760px)] min-h-[620px]">
      <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[460px] h-[460px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[440px] h-[440px]" />

      <CosmosCanvas rootRef={rootRef} anchorRef={anchorRef} />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 flex flex-col items-center justify-start text-center pointer-events-none">
        <p data-hero-in className="inline-flex items-center gap-2 rounded-full bg-white/85 border border-sky-200 px-3 py-1 text-[12px] font-semibold text-sky-800">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" /> AI-powered technology company
        </p>

        {/* the words are formed here by the canvas */}
        <div ref={anchorRef} aria-hidden="true" className="w-full shrink-0 h-[clamp(130px,27svh,270px)] my-1 sm:my-2" />

        <h1 data-hero-in className="text-[26px] sm:text-[38px] lg:text-[44px] font-bold tracking-[-0.035em] text-slate-950 leading-[1.1] mb-3 sm:mb-4">
          Human insight, <span className="text-sky-600">engineered into AI.</span>
        </h1>
        <p data-hero-in className="max-w-xl text-[15px] sm:text-[17px] leading-[1.6] text-slate-600 mb-6 sm:mb-8">
          We build AI agents, automation and software that think the way your people do, and scale the way your business needs.
        </p>
        <div data-hero-in className="pointer-events-auto flex items-center justify-center gap-2.5 sm:gap-3">
          <MagneticLink href="/services" className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-950 text-white text-[14px] font-semibold hover:bg-slate-800 active:scale-[0.98] transition-colors shadow-float">
            <span className="sm:hidden">Our services</span><span className="hidden sm:inline">Explore what we build</span> <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </MagneticLink>
          <Link href="/contact" className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/90 border border-sky-200 text-slate-800 text-[14px] font-semibold hover:bg-sky-50 hover:border-sky-300 transition-colors">
            Start a project
          </Link>
        </div>
      </div>
    </section>
  );
};
