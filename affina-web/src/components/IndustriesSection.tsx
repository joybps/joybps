'use client';

import React from 'react';
import {
  Users,
  Building2,
  Car,
  HeartPulse,
  GraduationCap,
  Landmark,
  ShoppingBag,
  Factory,
  Plane,
  Laptop,
  Megaphone,
  Headphones,
  Network,
} from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Marquee } from './MotionPrimitives';

const INDUSTRIES = [
  { icon: Building2, label: 'Real Estate & Property' },
  { icon: Car, label: 'Automotive' },
  { icon: HeartPulse, label: 'Healthcare' },
  { icon: GraduationCap, label: 'Education' },
  { icon: Landmark, label: 'Finance & Insurance' },
  { icon: ShoppingBag, label: 'Retail & E-commerce' },
  { icon: Factory, label: 'Manufacturing & Industrial' },
  { icon: Plane, label: 'Travel & Logistics' },
  { icon: Laptop, label: 'IT & Professional Services' },
  { icon: Megaphone, label: 'Marketing Agencies' },
  { icon: Headphones, label: 'Sales & Contact Centers' },
  { icon: Network, label: 'Enterprises & Franchises' },
];

const ROW_ONE = INDUSTRIES.slice(0, 6);
const ROW_TWO = INDUSTRIES.slice(6);

const Chip: React.FC<{ item: (typeof INDUSTRIES)[number] }> = ({ item }) => {
  const Icon = item.icon;
  return (
    <div className="shrink-0 flex items-center gap-3.5 rounded-2xl border border-sky-100 bg-slate-50/60 pl-3.5 pr-6 py-3.5 hover:bg-white hover:border-sky-300 hover:shadow-card transition-all duration-200">
      <span className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <span className="text-[15px] font-bold text-slate-950 whitespace-nowrap">{item.label}</span>
    </div>
  );
};

export const IndustriesSection: React.FC = () => (
  <section id="solutions" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-8 -left-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[400px] h-[400px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Users}
        pill="Who Can Use Affina?"
        title="One CRM for Every Kind of Business"
        text="Affina adapts to the way your team sells, whatever your industry."
      />
    </div>

    {/* Two rows drifting in opposite directions. */}
    <div className="space-y-4">
      <Marquee duration={45}>
        {ROW_ONE.map((i) => (
          <Chip key={i.label} item={i} />
        ))}
      </Marquee>
      <Marquee duration={50} reverse>
        {ROW_TWO.map((i) => (
          <Chip key={i.label} item={i} />
        ))}
      </Marquee>
    </div>
  </section>
);
