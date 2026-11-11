'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { gsap } from '../animation';
import { Reveal } from './MotionPrimitives';
import Link from 'next/link';
import { routeHref } from '../router';
import { FAQS } from '../data/faqs';

/** Answer panel whose height (and the icon) animate with GSAP. */
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
    gsap.to(el, {
      height: open ? 'auto' : 0,
      autoAlpha: open ? 1 : 0,
      duration: open ? 0.5 : 0.35,
      ease: open ? 'power3.out' : 'power2.inOut',
    });
  }, [open]);

  return (
    <div ref={ref} aria-hidden={!open} className="overflow-hidden" style={{ height: 0, opacity: 0, visibility: 'hidden' }}>
      {children}
    </div>
  );
};

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky top-8 -left-40 w-[440px] h-[440px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[400px] h-[400px]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Reveal
                key={faq.question}
                className="bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-sky-50/30 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-bold text-slate-950">{faq.question}</span>
                  <span className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                <AnswerPanel open={isOpen}>
                  <div className="px-5 pb-5 text-[14px] text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                </AnswerPanel>
              </Reveal>
            );
          })}
        </div>

        <p className="text-center text-[14px] text-slate-600 mt-10">
          Can’t find what you’re looking for?{' '}
          <Link href={routeHref('/contact')} className="font-semibold text-sky-700 hover:text-sky-900 underline underline-offset-2">
            Reach out to our team
          </Link>
          .
        </p>
      </div>
    </section>
  );
};
