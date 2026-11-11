'use client';

import React, { useRef } from 'react';
import { Quote } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '../animation';
import { MeasureCanvas } from './MeasureCanvas';

const WORDS = ['Every', 'site', 'measured,', 'every', 'crew', 'counted,', 'every', 'dollar'];
const STEPS = ['Measured', 'Counted', 'Billed'];

/** The idea behind Athena: a quote that is set word by word, then underlined with a dimension line that ends in "Billed". */
export const QuoteSection: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set('[data-q-icon]', { autoAlpha: 0, scale: 0.6, rotate: -12 });
        gsap.set('[data-q-word]', { autoAlpha: 0, y: 26, filter: 'blur(6px)' });
        gsap.set('[data-q-line]', { scaleX: 0, transformOrigin: 'left center' });
        gsap.set('[data-q-tick]', { autoAlpha: 0, scaleY: 0 });
        gsap.set('[data-q-step]', { autoAlpha: 0, y: 10 });
        gsap.set('[data-q-by]', { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: root.current, start: 'top 65%', toggleActions: 'play none none none' },
        });
        tl.to('[data-q-icon]', { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.8)' })
          .to('[data-q-word]', { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.09 }, '-=0.2')
          .to('[data-q-line]', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, '-=0.1')
          .to('[data-q-tick]', { autoAlpha: 1, scaleY: 1, duration: 0.4, stagger: 0.45 }, '<0.1')
          .to('[data-q-step]', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.45 }, '<0.1')
          .to('[data-q-by]', { autoAlpha: 1, duration: 0.6 }, '-=0.2');
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
      <MeasureCanvas className="absolute inset-0 w-full h-full" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.55)_40%,rgba(255,255,255,0)_70%)]" />
      <div aria-hidden="true" className="aurora aurora-amber top-10 -left-40 w-[460px] h-[460px]" />
      <div aria-hidden="true" className="aurora aurora-sky bottom-0 -right-40 w-[420px] h-[420px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span data-q-icon className="inline-flex w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 items-center justify-center mb-6">
          <Quote className="w-5 h-5" />
        </span>

        <blockquote className="text-[28px] sm:text-[44px] font-bold tracking-tight leading-[1.15] text-slate-950">
          <span className="sr-only">Every site measured, every crew counted, every dollar on the bill.</span>
          <span aria-hidden="true">
            {'“'}
            {WORDS.map((w, i) => (
              <span key={i} data-q-word className="inline-block mr-[0.28em]">{w}</span>
            ))}
            <span data-q-word className="inline-block text-shimmer">on the bill.”</span>
          </span>
        </blockquote>

        {/* dimension line that ends in "Billed" */}
        <div aria-hidden="true" className="mt-10 mx-auto max-w-xl">
          <div className="relative h-4">
            <span data-q-line className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-sky-400 via-sky-300 to-amber-400" />
            {[0, 50, 100].map((p) => (
              <span
                key={p}
                data-q-tick
                className={`absolute top-0 h-4 w-px ${p === 100 ? 'bg-amber-500' : 'bg-sky-400'}`}
                style={{ left: `${p}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11.5px] font-bold uppercase tracking-wider">
            {STEPS.map((s, i) => (
              <span key={s} data-q-step className={i === 2 ? 'text-amber-600' : 'text-sky-700'}>{s}</span>
            ))}
          </div>
        </div>

        <p data-q-by className="mt-8 text-[14px] font-semibold text-slate-500">The idea behind Athena</p>
      </div>
    </section>
  );
};
