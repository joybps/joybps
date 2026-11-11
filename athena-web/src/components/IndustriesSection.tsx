'use client';

import React from 'react';
import { Paintbrush, Grid3x3, Hammer, Zap, TreePine, Wrench, Building2 } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { StaggerGroup } from './MotionPrimitives';

const ITEMS = [
  { icon: Paintbrush, title: 'Painting and finishing', measures: 'sq ft of walls and ceilings', tone: 'bg-sky-100 text-sky-700' },
  { icon: Grid3x3, title: 'Flooring and tiling', measures: 'sq ft of floor, ft of skirting', tone: 'bg-amber-100 text-amber-700' },
  { icon: Hammer, title: 'Interiors and carpentry', measures: 'nos of units, ft of panelling', tone: 'bg-violet-100 text-violet-700' },
  { icon: Zap, title: 'Electrical and plumbing', measures: 'nos of points, ft of piping', tone: 'bg-emerald-100 text-emerald-700' },
  { icon: TreePine, title: 'Landscaping and civil', measures: 'sq ft of area, units of work', tone: 'bg-emerald-100 text-emerald-700' },
  { icon: Wrench, title: 'Fabrication and installation', measures: 'nos, ft and units on site', tone: 'bg-sky-100 text-sky-700' },
];

/** Who Athena is for: businesses that survey, measure, quote and bill for work at a customer's site. */
export const IndustriesSection: React.FC = () => (
  <section id="who" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-10 -right-40 w-[420px] h-[420px]" />
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Building2}
        pill="Who it is for"
        title="Made for businesses that work on site."
        text="If you survey a site, measure the work, quote it, send a crew and then bill the customer, Athena fits the way you already work."
      />
      <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" y={20} stagger={0.06}>
        {ITEMS.map((it) => (
          <div key={it.title} className="rounded-3xl bg-white border border-sky-100 shadow-card p-5 hover:border-amber-300 transition-colors">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${it.tone}`}>
              <it.icon className="w-5 h-5" />
            </span>
            <h3 className="text-[16.5px] font-bold text-slate-950 mb-1">{it.title}</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Measure in <span className="font-semibold text-slate-700">{it.measures}</span>
            </p>
          </div>
        ))}
      </StaggerGroup>
    </div>
  </section>
);
