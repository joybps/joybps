'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';
import { gsap } from '../animation';
import { Reveal } from './MotionPrimitives';
import { routeHref } from '../router';
import { FAQS } from '../data/faqs';

/** Answer panel whose height animates with GSAP. */
const AnswerPanel: React.FC<{ open: boolean; children: React.ReactNode }> = ({ open, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!mounted.current || reduce) {
      mounted.current = true;
      gsap.set(el, { height: open ? 'auto' : 0, autoAlpha: open ? 1 : 0 });
      return;
    }
    gsap.killTweensOf(el);
    gsap.to(el, { height: open ? 'auto' : 0, autoAlpha: open ? 1 : 0, duration: open ? 0.5 : 0.35, ease: open ? 'power3.out' : 'power2.inOut' });
  }, [open]);

  return (
    <div ref={ref} aria-hidden={!open} className="overflow-hidden" style={{ height: 0, opacity: 0, visibility: 'hidden' }}>
      {children}
    </div>
  );
};

export const FAQSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28 bg-white border-b border-sky-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.question} delay={Math.min(i, 4) * 0.04}>
                <div className={`rounded-2xl border bg-white transition-colors duration-300 ${isOpen ? 'border-sky-300 shadow-card' : 'border-sky-100'}`}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer"
                  >
                    <span className="text-[15.5px] font-semibold text-slate-950">{f.question}</span>
                    <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-700'}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  <AnswerPanel open={isOpen}>
                    <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-slate-600">{f.answer}</p>
                  </AnswerPanel>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="text-center text-[14px] text-slate-600 mt-10">
          Still have a question?{' '}
          <Link href={routeHref('/contact')} className="font-semibold text-sky-700 hover:text-sky-900 underline underline-offset-2">
            Talk to our team
          </Link>
          .
        </p>
      </div>
    </section>
  );
};
