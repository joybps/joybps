'use client';

import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Receipt, Clock3, Banknote } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal, StaggerGroup, CountUp } from './MotionPrimitives';

const KPIS = [
  { icon: TrendingUp, label: 'Revenue this month', to: 184, prefix: '$', suffix: 'K', delta: '+12.4%', up: true, tone: 'bg-sky-100 text-sky-700' },
  { icon: Receipt, label: 'Outstanding invoices', to: 82, prefix: '$', suffix: 'K', delta: '-4.1%', up: true, tone: 'bg-violet-100 text-violet-700' },
  { icon: Clock3, label: 'Overdue', to: 16, prefix: '$', suffix: 'K', delta: '+2.3%', up: false, tone: 'bg-amber-100 text-amber-700' },
  { icon: Wallet, label: 'Cash in bank', to: 249, prefix: '$', suffix: 'K', delta: '+8.7%', up: true, tone: 'bg-emerald-100 text-emerald-700' },
];
const BARS = [38, 52, 46, 64, 58, 72, 66, 84, 78, 92, 88, 96];
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const RECENT = [
  ['Northwind Traders', 'INV-2204', '$6,549', 'Paid'],
  ['Acme Supplies', 'INV-2203', '$2,180', 'Sent'],
  ['Bluebird Studio', 'INV-2202', '$940', 'Overdue'],
  ['Harbor Logistics', 'INV-2201', '$4,300', 'Paid'],
];
const PILL: Record<string, string> = {
  Paid: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  Sent: 'bg-sky-50 border-sky-200 text-sky-700',
  Overdue: 'bg-amber-50 border-amber-200 text-amber-700',
};

/** A dashboard snapshot: the numbers a business owner checks every morning. */
export const StatsSection: React.FC = () => (
  <section id="dashboard" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-emerald top-10 -right-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-sky bottom-0 -left-40 w-[420px] h-[420px]" />
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Banknote}
        pill="Your dashboard"
        title="Know where you stand, any day."
        text="Revenue, receivables, cash and what needs chasing, on one screen and always up to date."
      />

      <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4" y={20} stagger={0.07}>
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-3xl bg-white border border-sky-100 shadow-card p-4 sm:p-5">
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${k.tone}`}><k.icon className="w-4.5 h-4.5" /></span>
            <p className="text-[12px] font-semibold text-slate-500 mb-0.5">{k.label}</p>
            <p className="text-[26px] sm:text-[30px] font-extrabold text-slate-950 tabular-nums leading-tight">
              <CountUp to={k.to} prefix={k.prefix} suffix={k.suffix} />
            </p>
            <span className={`mt-1 inline-flex items-center gap-0.5 text-[11.5px] font-bold ${k.up ? 'text-emerald-600' : 'text-amber-600'}`}>
              {k.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />} {k.delta}
            </span>
          </div>
        ))}
      </StaggerGroup>

      <Reveal>
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 rounded-3xl bg-white border border-sky-200 shadow-float p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[15px] font-bold text-slate-950">Income, last 12 months</p>
                <p className="text-[12px] text-slate-400">Profit and loss</p>
              </div>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11.5px] font-bold px-2.5 py-1">Net profit $72K</span>
            </div>
            <div className="flex items-end gap-1.5 sm:gap-2 h-[190px]">
              {BARS.map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className={`w-full rounded-t-lg ${i === BARS.length - 1 ? 'bg-gradient-to-t from-emerald-500 to-sky-400' : 'bg-gradient-to-t from-sky-200 to-sky-100'}`} style={{ height: `${b}%` }} />
                  <span className="text-[10px] font-semibold text-slate-400">{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl bg-white border border-sky-200 shadow-float p-5 sm:p-6">
            <p className="text-[15px] font-bold text-slate-950 mb-3">Recent invoices</p>
            <div className="space-y-2">
              {RECENT.map(([c, n, a, s]) => (
                <div key={n} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-slate-900 truncate">{c}</span>
                    <span className="block text-[11px] text-slate-400">{n}</span>
                  </span>
                  <span className="text-[13px] font-bold text-slate-900 tabular-nums">{a}</span>
                  <span className={`text-[10.5px] font-bold rounded-full px-2 py-0.5 border ${PILL[s]}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-[11px] font-semibold text-slate-400">Sample data</p>
      </Reveal>
    </div>
  </section>
);
