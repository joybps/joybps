'use client';

import React from 'react';
import { HardHat, Check, X, Receipt } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CREW = [
  { name: 'Ravi', role: 'Mason', rate: 60, absent: [] as number[] },
  { name: 'Karthik', role: 'Helper', rate: 40, absent: [] as number[] },
  { name: 'Mohan', role: 'Painter', rate: 55, absent: [1] },
  { name: 'Selvam', role: 'Carpenter', rate: 65, absent: [] as number[] },
  { name: 'Arun', role: 'Helper', rate: 35, absent: [4] },
];
const usd = (n: number) => '$' + n.toLocaleString('en-US');
const wage = (c: (typeof CREW)[number]) => (DAYS.length - c.absent.length) * c.rate;
const LABOUR = CREW.reduce((a, c) => a + wage(c), 0); // 1,440

const EXP = [
  ['Materials', 320],
  ['Transport', 85],
  ['Equipment hire', 140],
] as const;
const WORK = 3011;
const EXP_TOTAL = EXP.reduce((a, e) => a + e[1], 0);

const POINTS_L = ['Group labourers into crews with a daily charge', 'Schedule a crew on a site for the project timeline', 'Mark attendance for each day, wages add up on their own'];
const POINTS_R = ['Log materials, transport and other costs as they happen', 'Choose which expenses to bill to the customer', 'One invoice for the work, labour and billed expenses'];

/** Crews, attendance and expenses, shown as two calm cards: the attendance sheet and the invoice it feeds. */
export const CrewBillingShowcase: React.FC = () => (
  <section id="crew" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-amber top-0 -left-40 w-[420px] h-[420px]" />
    <div aria-hidden="true" className="aurora aurora-sky bottom-0 -right-40 w-[420px] h-[420px]" />
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={HardHat}
        pill="Crews, expenses and billing"
        title="Labour and expenses, straight onto the bill."
        text="What your crew works and what the project spends are recorded as they happen, so the invoice is complete the moment the job ends."
      />
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* attendance */}
        <Reveal x={-20} yOffset={0}>
          <div className="rounded-3xl bg-white border border-amber-200 shadow-float p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Crew A · 24 Maple Street</p>
                <p className="text-[15px] font-bold text-slate-950">Attendance, Nov 18 to Nov 23</p>
              </div>
              <span className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-center">
                <span className="block text-[10px] text-slate-500 leading-none mb-0.5">Labour cost</span>
                <span className="block text-[15px] font-extrabold text-slate-950 tabular-nums leading-none">{usd(LABOUR)}</span>
              </span>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[440px]">
                <div className="grid grid-cols-[1.5fr_repeat(6,1fr)_.8fr] gap-1.5 px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  <span>Labour</span>
                  {DAYS.map((d) => <span key={d} className="text-center">{d}</span>)}
                  <span className="text-right">Wages</span>
                </div>
                <div className="space-y-1.5">
                  {CREW.map((c) => (
                    <div key={c.name} className="grid grid-cols-[1.5fr_repeat(6,1fr)_.8fr] gap-1.5 items-center rounded-xl border border-slate-100 bg-slate-50/60 px-2 py-1.5">
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 shrink-0 rounded-full bg-amber-100 text-amber-800 text-[10.5px] font-bold flex items-center justify-center">{c.name[0]}</span>
                        <span className="min-w-0">
                          <span className="block text-[12px] font-semibold text-slate-900 leading-tight truncate">{c.name}</span>
                          <span className="block text-[10px] text-slate-400 leading-tight">{c.role} · {usd(c.rate)}/day</span>
                        </span>
                      </span>
                      {DAYS.map((_, d) => {
                        const ab = c.absent.includes(d);
                        return (
                          <span key={d} className="flex justify-center">
                            <span className={`w-6 h-6 rounded-md flex items-center justify-center border ${ab ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-emerald-500 border-emerald-500 text-white'}`}>
                              {ab ? <X className="w-3 h-3" strokeWidth={3} /> : <Check className="w-3 h-3" strokeWidth={3.5} />}
                            </span>
                          </span>
                        );
                      })}
                      <span className="text-right text-[12px] font-bold text-slate-900 tabular-nums">{usd(wage(c))}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] font-semibold text-slate-400">Sample data</p>
          </div>
          <ul className="mt-5 space-y-2.5">
            {POINTS_L.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[14px] text-slate-700">
                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3.5} /></span>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* invoice */}
        <Reveal x={20} yOffset={0}>
          <div className="rounded-3xl bg-white border border-sky-200 shadow-float p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center"><Receipt className="w-4 h-4" /></span>
                <div>
                  <p className="text-[14px] font-bold text-slate-950 leading-tight">Invoice INV-0087</p>
                  <p className="text-[11px] text-slate-400 leading-tight">24 Maple Street</p>
                </div>
              </div>
              <span className="text-[11px] font-bold rounded-full px-2.5 py-1 border bg-emerald-50 border-emerald-200 text-emerald-700">Project closed</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-slate-100 text-[13px]">
              <span className="text-slate-600">Estimated work</span>
              <span className="font-semibold text-slate-900 tabular-nums">{usd(WORK)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-slate-100 text-[13px]">
              <span className="text-slate-600">Labour (5 crew, 6 days)</span>
              <span className="font-semibold text-slate-900 tabular-nums">{usd(LABOUR)}</span>
            </div>
            {EXP.map(([n, a]) => (
              <div key={n} className="flex items-center justify-between py-2 border-t border-amber-100 bg-amber-50/50 -mx-2 px-2 text-[13px]">
                <span className="text-amber-900">{n} (billed)</span>
                <span className="font-semibold text-slate-900 tabular-nums">{usd(a)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-200">
              <span className="text-[13px] font-semibold text-slate-500">Total due</span>
              <span className="text-[24px] font-extrabold text-slate-950 tabular-nums">{usd(WORK + LABOUR + EXP_TOTAL)}</span>
            </div>
            <p className="mt-3 text-center text-[11px] font-semibold text-slate-400">Sample data</p>
          </div>
          <ul className="mt-5 space-y-2.5">
            {POINTS_R.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[14px] text-slate-700">
                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3.5} /></span>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  </section>
);
