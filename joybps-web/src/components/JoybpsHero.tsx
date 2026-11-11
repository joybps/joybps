'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../animation';
import { LivingMind } from './LivingMind';
import { PRODUCTS } from '../data/products';

/** The four stages of how Joybps AI works. Each one is drawn by the field as its own form. */
const STAGES = [
  { name: 'Think', title: 'Understand before building.', text: 'We listen to your goals, your data and your workflow, then map exactly where AI can remove real effort.', tags: ['Discovery', 'Data mapping', 'Goals'] },
  { name: 'Process', title: 'Turn the problem into structure.', text: 'Models, rules and architecture are designed and tested, so every decision is accurate and explainable.', tags: ['Architecture', 'AI models', 'Validation'] },
  { name: 'Execute', title: 'Put it to work in real time.', text: 'Agents and automations run the work: answering calls, updating records, sending invoices, closing the loop.', tags: ['Automation', 'AI agents', 'Integrations'] },
  { name: 'Deliver', title: 'Results your team can see.', text: 'Finished products reach your people and customers, monitored and improved long after launch.', tags: ['Launch', 'Monitoring', 'Support'] },
];
const LINE1 = ['AI-powered', 'software,'];
const LINE2 = ['built', 'for', 'how', 'you', 'work.'];

export const JoybpsHero: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const diveRef = useRef(0);
  const [thought, setThought] = useState(0);
  const [live, setLive] = useState(false);
  const st = STAGES[thought];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('[data-hero-in]', { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.12, delay: 1.6, ease: 'power3.out', clearProps: 'transform' });
        ScrollTrigger.create({ trigger: rootRef.current, start: 'top top', end: 'bottom top', onUpdate: (s) => (diveRef.current = s.progress) });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-tech-grid border-b border-sky-100">
      <noscript>
        <style>{'.mind-h1{opacity:1!important;animation:none!important}'}</style>
      </noscript>
      <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[460px] h-[460px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[440px] h-[440px]" />

      <LivingMind rootRef={rootRef} headlineRef={headlineRef} diveRef={diveRef} onThought={(i) => { setThought(i); setLive(true); }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-[62%] bg-gradient-to-r from-white/85 via-white/55 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100svh/var(--zf)-4rem)] lg:max-h-[calc(900px/var(--zf))] flex items-center py-14 sm:py-20 pointer-events-none">
        <div className="max-w-[54rem] w-full pointer-events-auto">
          <p data-hero-in className="inline-flex items-center gap-2 rounded-full bg-white/85 border border-sky-200 px-3 py-1 text-[12px] font-semibold text-sky-800 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" /> AI-powered technology company
          </p>

          <h1 ref={headlineRef} className="mind-h1 text-[42px] sm:text-[58px] lg:text-[70px] font-bold tracking-[-0.04em] text-slate-950 leading-[1.04] mb-5">
            <span className="block">
              {LINE1.map((w) => (
                <React.Fragment key={w}>
                  <span data-w className="inline-block">{w}</span>{' '}
                </React.Fragment>
              ))}
            </span>
            <span className="block">
              {LINE2.map((w) => (
                <React.Fragment key={w}>
                  <span data-w className="inline-block text-sky-600">{w}</span>{' '}
                </React.Fragment>
              ))}
            </span>
          </h1>

          <div data-hero-in className="max-w-[36rem] mb-8">
            {/* progress: four steps, the current one fills over the length of a thought */}
            <ol className="flex gap-2 mb-4" aria-label="How Joybps AI works">
              {STAGES.map((s, i) => (
                <li key={s.name} className="flex-1">
                  <div className="h-[3px] rounded-full bg-slate-200 overflow-hidden">
                    {i < thought ? <div className="h-full bg-sky-500" /> : i === thought && live ? <div key={`b${thought}`} className="stage-bar h-full bg-gradient-to-r from-sky-500 to-indigo-500" /> : null}
                  </div>
                  <p className={`mt-1.5 text-[11.5px] font-bold uppercase tracking-[0.12em] transition-colors duration-500 ${i === thought ? 'text-sky-700' : 'text-slate-400'}`}>
                    <span className="font-mono mr-1">0{i + 1}</span>{s.name}
                  </p>
                </li>
              ))}
            </ol>
            {/* the text changes with the form: every word rises out of a blur */}
            <div key={thought} className="min-h-[148px] sm:min-h-[140px]" aria-hidden="true">
              <p className="text-[24px] sm:text-[30px] font-semibold tracking-tight text-slate-900 leading-[1.15] mb-2.5">
                {st.title.split(' ').map((w, i) => (
                  <span key={i} className="stage-in inline-block mr-[0.28em]" style={{ animationDelay: `${i * 70}ms` }}>{w}</span>
                ))}
              </p>
              <p className="stage-in text-[15.5px] sm:text-[16.5px] leading-[1.6] text-slate-600 mb-3" style={{ animationDelay: '320ms' }}>{st.text}</p>
              <ul className="flex flex-wrap gap-1.5">
                {st.tags.map((t, i) => (
                  <li key={t} className="stage-in rounded-full border border-sky-200 bg-white/85 px-2.5 py-1 text-[12px] font-semibold text-sky-800" style={{ animationDelay: `${480 + i * 90}ms` }}>{t}</li>
                ))}
              </ul>
            </div>
            <p className="sr-only">
              Joybps AI works in four stages. {STAGES.map((s) => `${s.name}: ${s.title} ${s.text}`).join(' ')}
            </p>
          </div>

          <div data-hero-in className="flex flex-wrap items-center gap-3">
            <Link href="/products" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 text-white text-[14px] font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-float">
              Explore our AI products <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/90 border border-sky-200 text-slate-800 text-[14px] font-semibold hover:bg-sky-50 hover:border-sky-300 transition-colors">
              Start a project
            </Link>
          </div>

          <nav data-hero-in aria-label="Joybps products" className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-500">
            <span className="font-semibold text-slate-400">Our AI:</span>
            {PRODUCTS.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-sky-700 transition-colors">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full" style={{ background: p.accent }} />
                {p.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
};
