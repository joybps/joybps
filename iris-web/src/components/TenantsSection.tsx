'use client';

import React, { useRef } from 'react';
import { Building2, Bot, MessageSquare, Phone, ShieldCheck, Users, Hash, Layers3 } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, runWhileVisible } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

interface Tenant {
  name: string;
  kind: string;
  agents: { name: string; mode: 'chat' | 'voice' }[];
}

// Sample organisations, for illustration only.
const TENANTS: Tenant[] = [
  {
    name: 'City Clinic',
    kind: 'Healthcare',
    agents: [
      { name: 'Nova', mode: 'chat' },
      { name: 'Aria', mode: 'voice' },
    ],
  },
  {
    name: 'Prime Realty',
    kind: 'Real estate',
    agents: [
      { name: 'Leo', mode: 'chat' },
      { name: 'Maya', mode: 'chat' },
      { name: 'Orion', mode: 'voice' },
    ],
  },
  {
    name: 'FinServe',
    kind: 'Finance',
    agents: [
      { name: 'Sage', mode: 'chat' },
      { name: 'Vega', mode: 'voice' },
      { name: 'Lyra', mode: 'voice' },
    ],
  },
];

const PROPS = [
  { icon: ShieldCheck, t: 'Isolated organisations', d: 'Each organisation is its own tenant, with its own data and history.' },
  { icon: Bot, t: 'Multiple agents each', d: 'Create as many chat and voice agents as the organisation needs.' },
  { icon: Users, t: 'Its own team and dashboard', d: 'People in an organisation monitor and take over only their own conversations.' },
  { icon: Hash, t: 'Its own numbers and widgets', d: 'Every voice agent gets a virtual number. Every chat agent gets a widget.' },
];

export const TenantsSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loops: gsap.core.Animation[] = [];
        gsap.utils.toArray<HTMLElement>('[data-pulse]').forEach((dot, i) => {
          loops.push(gsap.fromTo(dot, { y: 0, autoAlpha: 0 }, { y: 44, autoAlpha: 1, duration: 1.4, repeat: -1, ease: 'power1.in', delay: i * 0.45, repeatDelay: 0.4 }));
        });
        gsap.from('[data-tenant]', {
          autoAlpha: 0,
          y: 34,
          duration: 0.8,
          stagger: 0.14,
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        });
        return runWhileVisible(ref.current, loops);
      });
    },
    { scope: ref },
  );

  return (
    <section id="tenants" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Layers3}
          pill="Multi-tenant architecture"
          title="One platform. Many organisations. Many agents each."
          text="Iris is built multi-tenant from the ground up. Every organisation gets a private workspace, with as many AI agents as it needs."
        />

        <div ref={ref}>
          {/* platform bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="beam-border rounded-2xl bg-white border border-sky-200 shadow-float px-5 py-4 flex items-center justify-center gap-3 text-center">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center">
                <Layers3 className="w-5 h-5" />
              </span>
              <div className="text-left">
                <p className="text-[15px] font-bold text-slate-950 leading-tight">Iris platform</p>
                <p className="text-[12px] text-slate-500 leading-tight">AI voice and chat engine · shared infrastructure</p>
              </div>
            </div>
          </div>

          {/* connectors */}
          <div className="hidden md:grid grid-cols-3 gap-6 max-w-5xl mx-auto h-12" aria-hidden="true">
            {TENANTS.map((t) => (
              <div key={t.name} className="relative flex justify-center">
                <span className="w-px h-full border-l border-dashed border-sky-300" />
                <span data-pulse className="absolute top-0 w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_10px_2px_rgba(14,165,233,0.6)]" />
              </div>
            ))}
          </div>
          <div className="md:hidden h-6" />

          {/* tenants */}
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {TENANTS.map((t) => (
              <div key={t.name} data-tenant className="rounded-3xl bg-white border border-sky-200 shadow-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-slate-950 leading-tight">{t.name}</p>
                    <p className="text-[12px] text-slate-500 leading-tight">{t.kind}</p>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10.5px] font-bold text-emerald-700">Tenant</span>
                </div>
                <ul className="space-y-2">
                  {t.agents.map((a) => (
                    <li key={a.name} className="flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${a.mode === 'chat' ? 'bg-sky-100 text-sky-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {a.mode === 'chat' ? <MessageSquare className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                      </span>
                      <span className="text-[13px] font-semibold text-slate-800">{a.name}</span>
                      <span className="ml-auto text-[11px] font-medium text-slate-400">{a.mode === 'chat' ? 'Chat agent' : 'Voice agent'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {PROPS.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06}>
              <div className="h-full rounded-2xl bg-white border border-sky-100 shadow-card p-5">
                <span className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
                  <p.icon className="w-4.5 h-4.5" />
                </span>
                <h3 className="text-[14.5px] font-bold text-slate-950 mb-1">{p.t}</h3>
                <p className="text-[13px] text-slate-600 leading-snug">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
