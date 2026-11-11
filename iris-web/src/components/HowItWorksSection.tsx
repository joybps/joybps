'use client';

import React, { useRef } from 'react';
import { Building, Bot, Rocket, Sparkles, LayoutDashboard, Workflow } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '../animation';
import { SectionHeading } from './SectionHeading';

const STEPS = [
  { icon: Building, t: 'Create your organisation', d: 'Set up your workspace and invite your team.' },
  { icon: Bot, t: 'Build your agents', d: 'Create voice and chat agents, and tell each one how to help your customers.' },
  { icon: Rocket, t: 'Go live', d: 'Paste the widget on your site and assign a virtual phone number.' },
  { icon: Sparkles, t: 'AI handles the conversations', d: 'Customers chat and call. The agents answer, any time of day.' },
  { icon: LayoutDashboard, t: 'Review and take over', d: 'Watch history, read summaries, and join live when a human is needed.' },
];

export const HowItWorksSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const trigger = { trigger: ref.current, start: 'top 75%', end: 'bottom 70%', scrub: 0.6 };
        gsap.fromTo('[data-progress]', { scaleX: 0 }, { scaleX: 1, transformOrigin: '0 50%', ease: 'none', scrollTrigger: trigger });
        gsap.from('[data-step]', {
          autoAlpha: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="how" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Workflow}
          pill="How it works"
          title="From sign-up to your first AI-answered call in five steps."
          text="No contact center to build. Create your agents, go live, and let Iris take the first conversation."
        />

        <div ref={ref} className="relative">
          <div aria-hidden="true" className="hidden lg:block absolute left-[10%] right-[10%] top-7 h-0.5 bg-sky-100 rounded-full" />
          <div
            data-progress
            aria-hidden="true"
            className="hidden lg:block absolute left-[10%] right-[10%] top-7 h-0.5 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
          />
          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {STEPS.map((s, i) => (
              <li key={s.t} data-step className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center">
                <span className="relative w-14 h-14 shrink-0 rounded-2xl bg-white border border-sky-200 shadow-card text-sky-700 flex items-center justify-center lg:mb-4">
                  <s.icon className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-950 text-white text-[11px] font-bold flex items-center justify-center font-mono">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="text-[15.5px] font-bold text-slate-950 mb-1">{s.t}</h3>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
