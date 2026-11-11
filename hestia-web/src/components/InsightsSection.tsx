'use client';

import React, { useRef, useState } from 'react';
import { BarChart3, ScrollText, FileCheck2, UserPlus, Pencil, LogIn } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, sleep, useVisibleLoop } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal, CountUp } from './MotionPrimitives';

const BARS = [62, 70, 66, 78, 74, 85, 80, 88, 83, 92, 90, 96];
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const LOGS: { icon: React.ElementType; text: string; tone: string }[] = [
  { icon: FileCheck2, text: 'Meera approved leave for Priya', tone: 'bg-emerald-100 text-emerald-700' },
  { icon: UserPlus, text: 'Nandini added a new candidate', tone: 'bg-sky-100 text-sky-700' },
  { icon: Pencil, text: 'Rahul updated shift for Operations', tone: 'bg-indigo-100 text-indigo-700' },
  { icon: LogIn, text: 'Arun checked in at 09:02', tone: 'bg-amber-100 text-amber-700' },
  { icon: FileCheck2, text: 'Kavya downloaded a payslip', tone: 'bg-violet-100 text-violet-700' },
  { icon: Pencil, text: 'Aditya edited an asset record', tone: 'bg-rose-100 text-rose-700' },
];

export const InsightsSection: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const [feed, setFeed] = useState<number[]>([2, 1, 0]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('[data-bar]', {
          scaleY: 0,
          stagger: 0.06,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-bars]', start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
    },
    { scope: rootRef },
  );

  // new audit entries arrive at the top, one at a time
  useVisibleLoop(feedRef, async (alive) => {
    await sleep(2200);
    if (!alive()) return;
    setFeed((f) => [(f[0] + 1) % LOGS.length, ...f].slice(0, 4));
  });

  return (
    <section ref={rootRef} id="insights" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky top-10 -right-40 w-[440px] h-[440px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -left-40 w-[420px] h-[420px]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={BarChart3}
          pill="Reports and audit logs"
          title="See the picture, and the trail behind it."
          text="Reports and analytics show how your people and processes are doing. Audit logs record who did what, so you can always look back."
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <Reveal x={-30}>
            <div className="h-full rounded-3xl bg-white border border-sky-200 shadow-float p-5 sm:p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[16px] font-bold text-slate-950 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-sky-600" /> Attendance rate</h3>
                <span className="text-[11px] font-semibold text-slate-400">Sample data</span>
              </div>
              <p className="text-[12.5px] text-slate-500 mb-4">Share of scheduled staff present, by month</p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  ['Attendance', 96, '%'],
                  ['Headcount', 142, ''],
                  ['Open leave', 18, ''],
                ].map(([l, n, s]) => (
                  <div key={l as string} className="rounded-xl bg-sky-50/60 border border-sky-100 px-3 py-2.5">
                    <p className="text-[11px] text-slate-500">{l}</p>
                    <p className="text-[20px] font-bold text-slate-950 leading-tight tabular-nums"><CountUp to={n as number} suffix={s as string} /></p>
                  </div>
                ))}
              </div>

              <div data-bars className="flex items-end gap-2 h-[170px]">
                {BARS.map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div data-bar className="w-full rounded-t-lg bg-gradient-to-t from-sky-500 to-indigo-400 origin-bottom" style={{ height: `${b}%` }} />
                    <span className="text-[10px] font-semibold text-slate-400">{MONTHS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal x={30}>
            <div ref={feedRef} className="h-full rounded-3xl bg-white border border-sky-200 shadow-float p-5 sm:p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[16px] font-bold text-slate-950 flex items-center gap-2"><ScrollText className="w-4 h-4 text-sky-600" /> Audit log</h3>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700"><span className="anim-blink w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live</span>
              </div>
              <p className="text-[12.5px] text-slate-500 mb-4">Every important action, recorded</p>
              <ul className="space-y-2.5">
                {feed.map((n, i) => {
                  const l = LOGS[n];
                  return (
                    <li key={`${n}-${feed.length}-${i}-${feed[0]}`} className={`flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3 ${i === 0 ? 'animate-[fadeIn_.5s_ease]' : ''}`}>
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${l.tone}`}><l.icon className="w-4 h-4" /></span>
                      <div className="flex-1">
                        <p className="text-[13.5px] font-semibold text-slate-900 leading-tight">{l.text}</p>
                        <p className="text-[11.5px] text-slate-400 leading-tight">{i === 0 ? 'just now' : `${i * 3} min ago`}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
