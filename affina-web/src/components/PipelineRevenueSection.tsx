'use client';

import React, { useRef, useState } from 'react';
import { Kanban, TrendingUp, LayoutDashboard } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '../animation';
import { SectionHeading } from './SectionHeading';
import { PipelineBoard } from './PipelineBoard';
import { ForecastPanel } from './ForecastPanel';

type View = 'pipeline' | 'revenue';

export const PipelineRevenueSection: React.FC = () => {
  const [view, setView] = useState<View>('pipeline');
  const bodyRef = useRef<HTMLDivElement>(null);

  // The panel body fades up whenever the tab changes.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(bodyRef.current, { autoAlpha: 0, y: 18, duration: 0.5, clearProps: 'transform' });
      });
    },
    { dependencies: [view], revertOnUpdate: true },
  );

  const tabCls = (active: boolean) =>
    `px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-150 cursor-pointer flex items-center gap-2 ${
      active ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-950 hover:bg-sky-50/50'
    }`;

  return (
    <section id="workspace" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky top-8 -left-40 w-[440px] h-[440px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[400px] h-[400px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={LayoutDashboard}
          pill="Unified Revenue Platform"
          title="Your Pipeline. Your Stages. Your Forecast."
          text="Shape the customer pipeline to the way you sell, then track the revenue it produces: what you made last month, what you are making now, and what to expect next."
        />

        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-sky-200/80 shadow-xs gap-1.5">
            <button type="button" onClick={() => setView('pipeline')} className={tabCls(view === 'pipeline')}>
              <Kanban className="w-4 h-4" />
              <span>Custom Pipelines</span>
            </button>
            <button type="button" onClick={() => setView('revenue')} className={tabCls(view === 'revenue')}>
              <TrendingUp className="w-4 h-4" />
              <span>Revenue Forecasting</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-sky-200/90 shadow-float overflow-hidden">
          <div className="px-6 py-4 border-b border-sky-100 bg-slate-50/60 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-slate-200" />
            <span className="w-3 h-3 rounded-full bg-slate-200" />
            <span className="w-3 h-3 rounded-full bg-slate-200" />
            <span className="text-[13px] font-bold text-slate-900 ml-2">
              {view === 'pipeline' ? 'Customer Pipeline' : 'Revenue Forecast'}
            </span>
          </div>

          <div ref={bodyRef} className="p-5 sm:p-8">
            {view === 'pipeline' ? <PipelineBoard /> : <ForecastPanel />}
          </div>
        </div>
      </div>
    </section>
  );
};
