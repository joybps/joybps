'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './MotionPrimitives';
import { OrderCanvas } from './OrderCanvas';
import { useNavigate } from '../router';

/** Closing call to action. The background shows loose documents sorting themselves into neat, ticked-off rows. */
export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="start" className="relative py-20 sm:py-28 bg-gradient-ice border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-emerald top-10 -left-40 w-[420px] h-[420px]" />
      <div aria-hidden="true" className="aurora aurora-sky bottom-0 -right-40 w-[380px] h-[380px]" />
      <OrderCanvas className="absolute inset-0 w-full h-full" />
      {/* keeps the headline readable over the documents */}
      <div aria-hidden="true" className="hidden sm:block pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_46%_at_50%_50%,rgba(255,255,255,0.96)_35%,rgba(255,255,255,0)_100%)]" />
      <div aria-hidden="true" className="sm:hidden pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_50%_at_50%_50%,rgba(255,255,255,0.97)_45%,rgba(255,255,255,0)_100%)]" />
      <Reveal className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-[32px] sm:text-[44px] font-bold tracking-tight text-slate-950 leading-tight mb-4">
          Put your finances <span className="text-shimmer">in order.</span>
        </h2>
        <p className="text-[16px] sm:text-[17px] text-slate-600 leading-relaxed mb-8">
          See how Joybooks handles invoicing, banking, GST and reports in one place, so your books are always up to date.
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
