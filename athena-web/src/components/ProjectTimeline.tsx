'use client';

import React from 'react';
import { MapPin, Ruler, Calculator, BadgeCheck, HardHat, CalendarCheck, Wallet, Receipt, Route } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

const STEPS = [
  { icon: MapPin, title: 'Create the site and survey it', text: 'Add the customer and the site, then record the survey as you walk it.', chips: ['Site added', 'Survey done'] },
  { icon: Ruler, title: 'Take the measurements', text: 'Record each measurement in the unit that fits: square feet, feet, numbers or your own.', chips: ['240 sq ft', '34 ft', '8 nos'] },
  { icon: Calculator, title: 'Turn them into an estimate', text: 'Enter the rate and Athena works out every line, then the total.', chips: ['Quantity × rate', 'Total $3,011'] },
  { icon: BadgeCheck, title: 'Get approval and start the project', text: 'Once the customer approves, update the status and start the project.', chips: ['Approved', 'Project started'] },
  { icon: HardHat, title: 'Schedule a crew on the site', text: 'A crew is a group of labourers, each with a daily charge. Schedule it for the project timeline.', chips: ['Crew A', '5 labourers'] },
  { icon: CalendarCheck, title: 'Mark attendance every day', text: 'Mark who worked on each day of the timeline. The labour cost adds up automatically.', chips: ['5 present', 'Labour $1,440'] },
  { icon: Wallet, title: 'Add expenses as they happen', text: 'Log materials, transport and other costs, and choose which to bill to the customer.', chips: ['Materials $320', 'Billable'] },
  { icon: Receipt, title: 'Invoice and close the project', text: 'Bill the work, labour and expenses together, then close the project.', chips: ['Invoice sent', 'Project closed'] },
];

/** A vertical project timeline: the whole workflow from site to closed project. Reveals as you scroll, then stays still. */
export const ProjectTimeline: React.FC = () => (
  <section id="flow" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-amber top-10 -right-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-sky bottom-0 -left-40 w-[420px] h-[420px]" />
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Route}
        pill="From site to final invoice"
        title="One flow for the whole job."
        text="Every step hands over to the next, so nothing is retyped and every dollar of labour, material and work ends up on the bill."
      />
      <ol className="relative">
        <span aria-hidden="true" className="absolute left-[19px] sm:left-1/2 sm:-translate-x-px top-2 bottom-2 w-0.5 bg-gradient-to-b from-sky-200 via-amber-300 to-sky-200" />
        {STEPS.map((s, i) => {
          const right = i % 2 === 1;
          return (
            <li key={s.title} className="relative pl-14 sm:pl-0 pb-8 last:pb-0 sm:grid sm:grid-cols-2 sm:gap-12">
              <span className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-1 w-10 h-10 rounded-full bg-white border-2 border-amber-300 text-amber-700 shadow-card flex items-center justify-center z-10">
                <s.icon className="w-4.5 h-4.5" />
              </span>
              <Reveal x={right ? 24 : -24} yOffset={0} className={right ? 'sm:col-start-2' : 'sm:col-start-1 sm:text-right'}>
                <div className="rounded-2xl bg-white border border-sky-100 shadow-card p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-amber-600 mb-1">Step {i + 1}</p>
                  <h3 className="text-[16.5px] font-bold text-slate-950 mb-1">{s.title}</h3>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed mb-3">{s.text}</p>
                  <div className={`flex flex-wrap gap-2 ${right ? '' : 'sm:justify-end'}`}>
                    {s.chips.map((c) => (
                      <span key={c} className="rounded-full bg-amber-50 border border-amber-100 text-amber-800 text-[11.5px] font-semibold px-2.5 py-1">{c}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  </section>
);
