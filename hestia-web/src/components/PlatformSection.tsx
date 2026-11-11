'use client';

import React, { useRef } from 'react';
import { Building2, Lock, CreditCard, Mail, Layers, Check } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, runWhileVisible } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal, CountUp } from './MotionPrimitives';

const ORGS = [
  { name: 'Acme Corp', people: 142, tone: 'from-sky-50 to-sky-100 text-sky-700' },
  { name: 'Northwind', people: 68, tone: 'from-indigo-50 to-indigo-100 text-indigo-700' },
  { name: 'Globex', people: 215, tone: 'from-violet-50 to-violet-100 text-violet-700' },
];

const MAILS = ['Leave approved', 'Payslip is ready', 'New announcement', 'Task assigned to you'];

export const PlatformSection: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // subscription meter fills once
        gsap.from('[data-meter]', {
          scaleX: 0,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-meter]', start: 'top 90%', toggleActions: 'play none none none' },
        });

        // org tiles breathe, a lock pulses between them
        const loops: gsap.core.Animation[] = [];
        gsap.utils.toArray<HTMLElement>('[data-org]').forEach((el, i) => {
          loops.push(gsap.to(el, { y: i % 2 ? 3 : -3, duration: 3 + i * 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
        });

        // emails arriving, one after another
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.2, paused: true });
        tl.from('[data-mail]', { x: 40, autoAlpha: 0, stagger: 0.55, duration: 0.6, ease: 'power3.out' })
          .to('[data-mail]', { autoAlpha: 0, x: -20, stagger: 0.1, duration: 0.4, ease: 'power2.in' }, '+=2.2');
        loops.push(tl);
        tl.play();

        const stop = runWhileVisible(rootRef.current, loops);
        return () => stop();
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="platform" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-indigo top-10 -left-40 w-[440px] h-[440px]" />
      <div aria-hidden="true" className="aurora aurora-sky bottom-0 -right-40 w-[420px] h-[420px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Layers}
          pill="Built as a platform"
          title="Multi-tenant, subscription based, email connected."
          text="Every organisation gets its own secure workspace. Plans are simple to manage, and the right people are kept in the loop by email."
        />

        <div className="grid lg:grid-cols-3 gap-5">
          {/* multi-tenant */}
          <Reveal className="rounded-3xl bg-white border border-sky-100 shadow-card p-6 flex flex-col">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 text-sky-700 flex items-center justify-center mb-4"><Building2 className="w-5 h-5" /></span>
            <h3 className="text-[18px] font-bold text-slate-950 mb-1.5">Every organisation, its own space</h3>
            <p className="text-[14px] text-slate-600 leading-relaxed mb-5">Separate people, roles and data for each organisation. One never sees another.</p>
            <div className="mt-auto space-y-3">
              {ORGS.map((o) => (
                <div key={o.name} data-org className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                  <span className={`w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-[13px] font-bold ${o.tone}`}>{o.name[0]}</span>
                  <div className="flex-1">
                    <p className="text-[13.5px] font-semibold text-slate-900 leading-tight">{o.name}</p>
                    <p className="text-[11.5px] text-slate-500 leading-tight tabular-nums"><CountUp to={o.people} /> people</p>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </Reveal>

          {/* subscription */}
          <Reveal delay={0.08} className="rounded-3xl bg-white border border-sky-100 shadow-card p-6 flex flex-col">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 text-sky-700 flex items-center justify-center mb-4"><CreditCard className="w-5 h-5" /></span>
            <h3 className="text-[18px] font-bold text-slate-950 mb-1.5">Simple subscriptions</h3>
            <p className="text-[14px] text-slate-600 leading-relaxed mb-5">Pick a plan for your organisation and manage it from the Subscription page.</p>
            <div className="mt-auto rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/70 to-indigo-50/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[15px] font-bold text-slate-950">Professional</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold"><Check className="w-3 h-3" strokeWidth={3} /> Active</span>
              </div>
              <div className="flex items-center justify-between text-[12px] text-slate-500 mb-1.5">
                <span>Seats used</span>
                <span className="font-semibold text-slate-800 tabular-nums">142 / 150</span>
              </div>
              <div className="h-2 rounded-full bg-white border border-sky-100 overflow-hidden mb-3">
                <div data-meter className="h-full w-[94%] rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 origin-left" />
              </div>
              <p className="text-[12px] text-slate-500">Renews in 21 days</p>
            </div>
          </Reveal>

          {/* email */}
          <Reveal delay={0.16} className="rounded-3xl bg-white border border-sky-100 shadow-card p-6 flex flex-col">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 text-sky-700 flex items-center justify-center mb-4"><Mail className="w-5 h-5" /></span>
            <h3 className="text-[18px] font-bold text-slate-950 mb-1.5">Email integration</h3>
            <p className="text-[14px] text-slate-600 leading-relaxed mb-5">Approvals, announcements and letters reach people in their inbox.</p>
            <div className="mt-auto space-y-2.5 min-h-[168px]">
              {MAILS.map((m) => (
                <div key={m} data-mail className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                  <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center"><Mail className="w-4 h-4" /></span>
                  <p className="text-[13px] font-semibold text-slate-900">{m}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
