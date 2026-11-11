'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './MotionPrimitives';
import { useNavigate } from '../router';

/** Closing call to action. Calm: a soft glow and a button. */
export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 sm:py-28 bg-gradient-ice border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-amber top-10 -left-40 w-[420px] h-[420px]" />
      <div aria-hidden="true" className="aurora aurora-sky bottom-0 -right-40 w-[380px] h-[380px]" />
      <Reveal className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-[32px] sm:text-[44px] font-bold tracking-tight text-slate-950 leading-tight mb-4">
          From site visit to <span className="text-shimmer">final invoice.</span>
        </h2>
        <p className="text-[16px] sm:text-[17px] text-slate-600 leading-relaxed mb-8">
          See how Athena takes your measurements, crews and expenses and turns them into estimates and invoices, without the paperwork.
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
