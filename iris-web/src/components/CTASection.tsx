'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './MotionPrimitives';
import { useNavigate } from '../router';
import { WaveField } from './WaveField';

/** Closing call to action. */
export const CTASection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 sm:py-28 bg-gradient-ice border-b border-sky-100 overflow-hidden">
      <WaveField className="absolute inset-0 w-full h-full" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_42%_34%_at_50%_46%,rgba(255,255,255,0.9),rgba(255,255,255,0.5)_65%,transparent_100%)]" />
      <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[420px] h-[420px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[380px] h-[380px]" />
      <Reveal className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-[32px] sm:text-[44px] font-bold tracking-tight text-slate-950 leading-tight mb-4">
          Put AI on <span className="text-shimmer">every call</span> and <span className="text-shimmer">every chat.</span>
        </h2>
        <p className="text-[16px] sm:text-[17px] text-slate-600 leading-relaxed mb-8">
          See Iris answer a real call and a real chat, and how your team steps in when it matters.
        </p>
        <button
          type="button"
          onClick={() => navigate('/contact')}
          className="group inline-flex items-center gap-2 px-7 py-4 text-[15px] font-semibold text-white bg-slate-950 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer shadow-float"
        >
          Book a Demo
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </Reveal>
    </section>
  );
};
