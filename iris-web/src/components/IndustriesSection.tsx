'use client';

import React from 'react';
import {
  HeartPulse, Building2, GraduationCap, Landmark, ShieldCheck, ShoppingBag, Plane, Truck, Car, RadioTower, Laptop, Hotel, Factory, Briefcase, Network,
} from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Marquee, StaggerGroup } from './MotionPrimitives';
import { SpotlightCard } from './FuturisticPrimitives';

export const INDUSTRIES: { icon: React.ElementType; label: string; use: string }[] = [
  { icon: HeartPulse, label: 'Healthcare', use: 'Appointment booking, reminders and patient enquiries, answered 24/7.' },
  { icon: Building2, label: 'Real Estate', use: 'Capture property enquiries by call or chat and schedule viewings.' },
  { icon: GraduationCap, label: 'Education', use: 'Answer admission questions and guide students and parents.' },
  { icon: Landmark, label: 'Banking and Finance', use: 'Handle account questions and route sensitive cases to your team.' },
  { icon: ShieldCheck, label: 'Insurance', use: 'Policy questions, claim status and first notice of loss.' },
  { icon: ShoppingBag, label: 'Retail and E-commerce', use: 'Order tracking, returns and product questions on every channel.' },
  { icon: Plane, label: 'Travel and Hospitality', use: 'Bookings, changes and guest requests, any hour of the day.' },
  { icon: Truck, label: 'Logistics', use: 'Shipment status and delivery updates without a queue.' },
  { icon: Car, label: 'Automotive', use: 'Test drives, service bookings and sales enquiries.' },
  { icon: RadioTower, label: 'Telecom', use: 'Plan questions, support triage and billing enquiries.' },
  { icon: Laptop, label: 'SaaS and IT Services', use: 'First-line support and onboarding help for your users.' },
  { icon: Hotel, label: 'Restaurants and Services', use: 'Reservations, opening hours and quick answers by phone or chat.' },
  { icon: Factory, label: 'Manufacturing', use: 'Dealer and customer support for orders and spare parts.' },
  { icon: Briefcase, label: 'Professional Services', use: 'Qualify new enquiries and book consultations.' },
  { icon: Network, label: 'Enterprises and Franchises', use: 'Run many branches as separate organisations on one platform.' },
];

const Chip: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <div className="shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-sky-100 shadow-card">
    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 text-sky-700 flex items-center justify-center">
      <Icon className="w-4.5 h-4.5" />
    </span>
    <span className="text-[14.5px] font-semibold text-slate-900 whitespace-nowrap">{label}</span>
  </div>
);

/** Home page: two auto-scrolling rows moving in opposite directions. */
export const IndustriesSection: React.FC = () => (
  <section id="industries" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Network}
        pill="Industries"
        title="Built for any business that talks to customers."
        text="If your customers call or chat with you, Iris can answer. Teams across many industries use it as their first line of contact."
      />
    </div>
    <div className="space-y-4">
      <Marquee duration={50}>
        {INDUSTRIES.slice(0, 8).map((i) => (
          <Chip key={i.label} icon={i.icon} label={i.label} />
        ))}
      </Marquee>
      <Marquee duration={56} reverse>
        {INDUSTRIES.slice(8).map((i) => (
          <Chip key={i.label} icon={i.icon} label={i.label} />
        ))}
      </Marquee>
    </div>
  </section>
);

/** Industries page: every industry with an example of how it is used. */
export const IndustriesGrid: React.FC = () => (
  <section className="py-20 sm:py-28 bg-white border-b border-sky-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" y={22} stagger={0.05}>
        {INDUSTRIES.map((i) => (
          <SpotlightCard key={i.label} className="rounded-3xl bg-white border border-sky-100 shadow-card p-6 hover:border-sky-300 transition-colors">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 text-sky-700 flex items-center justify-center mb-4">
              <i.icon className="w-5 h-5" />
            </span>
            <h3 className="text-[17px] font-bold text-slate-950 mb-1.5">{i.label}</h3>
            <p className="text-[14px] text-slate-600 leading-relaxed">{i.use}</p>
          </SpotlightCard>
        ))}
      </StaggerGroup>
    </div>
  </section>
);
