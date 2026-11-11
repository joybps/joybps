'use client';

import React from 'react';
import { MapPin, Ruler, Calculator, FolderKanban, HardHat, CalendarCheck, Wallet, Receipt, BarChart3, Camera, FileSignature, Users, LayoutGrid } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Marquee } from './MotionPrimitives';

const ROW1 = [
  { icon: MapPin, title: 'Sites and surveys', text: 'Every customer site in one place, with the survey recorded as you walk it.', tone: 'bg-sky-100 text-sky-700' },
  { icon: Ruler, title: 'Any unit of measure', text: 'Square feet, feet, numbers, units or your own. Measure it your way.', tone: 'bg-amber-100 text-amber-700' },
  { icon: Calculator, title: 'Instant estimates', text: 'Quantity times rate, worked out for every line of the estimate.', tone: 'bg-violet-100 text-violet-700' },
  { icon: FolderKanban, title: 'Projects and status', text: 'Move a job from estimate to approved, active and closed.', tone: 'bg-emerald-100 text-emerald-700' },
  { icon: HardHat, title: 'Crews and labour', text: 'Group labour into crews, each with a daily charge.', tone: 'bg-sky-100 text-sky-700' },
];
const ROW2 = [
  { icon: CalendarCheck, title: 'Daily attendance', text: 'Mark who worked each day of the schedule. Wages add up on their own.', tone: 'bg-emerald-100 text-emerald-700' },
  { icon: Wallet, title: 'Project expenses', text: 'Log materials, transport and more, and bill them to the customer.', tone: 'bg-amber-100 text-amber-700' },
  { icon: Receipt, title: 'Invoicing', text: 'Invoice the estimate, labour and expenses together, then close the job.', tone: 'bg-sky-100 text-sky-700' },
  { icon: BarChart3, title: 'Reports', text: 'Profit by site, labour cost by crew and what each customer owes.', tone: 'bg-indigo-100 text-indigo-700' },
  { icon: Camera, title: 'Site photos', text: 'Keep photos with the site so nothing about the job gets lost.', tone: 'bg-violet-100 text-violet-700' },
  { icon: FileSignature, title: 'Customer approval', text: 'Get the estimate approved before the project starts.', tone: 'bg-amber-100 text-amber-700' },
  { icon: Users, title: 'Customers', text: 'Contacts, sites and invoices for every customer together.', tone: 'bg-sky-100 text-sky-700' },
];

const Card: React.FC<(typeof ROW1)[number]> = ({ icon: Icon, title, text, tone }) => (
  <article className="w-[270px] sm:w-[300px] shrink-0 rounded-3xl bg-white border border-sky-100 shadow-card p-5 hover:border-amber-300 transition-colors">
    <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tone}`}>
      <Icon className="w-5 h-5" />
    </span>
    <h3 className="text-[16.5px] font-bold text-slate-950 mb-1">{title}</h3>
    <p className="text-[13.5px] text-slate-600 leading-relaxed">{text}</p>
  </article>
);

/** Two slow rows of feature cards that scroll sideways, and slow down when hovered. */
export const FeatureCardsScroller: React.FC = () => (
  <section id="features" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-amber bottom-0 -right-40 w-[420px] h-[420px]" />
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={LayoutGrid}
          pill="Everything for the field"
          title="Built for the way field work runs."
          text="From the first site visit to the final invoice, Athena keeps sites, measurements, crews and money together."
        />
      </div>
      <div className="space-y-4">
        <Marquee duration={60}>{ROW1.map((c) => <Card key={c.title} {...c} />)}</Marquee>
        <Marquee duration={70} reverse>{ROW2.map((c) => <Card key={c.title} {...c} />)}</Marquee>
      </div>
    </div>
  </section>
);
