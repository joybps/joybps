'use client';

import React from 'react';
import { Check, ArrowRight, Tag } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal, CountUp } from './MotionPrimitives';
import { useNavigate } from '../router';

// NOTE: plan names, prices and limits are placeholders until final pricing is confirmed.
const PLANS = [
  {
    name: 'Starter',
    price: '$2',
    priceNumber: 2,
    unit: '/employee/month',
    blurb: 'For small teams moving their everyday people operations off spreadsheets.',
    features: [
      'Employee directory and profiles',
      'Attendance and shifts',
      'Leave requests and approvals',
      'Announcements and documents',
      'Default roles: Director, Manager, Lead, HR, Employee',
      'Email notifications',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Professional',
    price: '$5',
    priceNumber: 5,
    unit: '/employee/month',
    blurb: 'For growing organisations that want the full HRMS and the AI assistant.',
    features: [
      'Everything in Starter',
      'AI chat assistant',
      'Projects and tasks',
      'Performance reviews',
      'Payroll and payslips',
      'Letters and assets',
      'Candidates and hiring',
      'Reports and analytics',
      'Custom roles with RBAC',
    ],
    cta: 'Book a Demo',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    blurb: 'For larger organisations with many teams, tighter controls and support needs.',
    features: [
      'Everything in Professional',
      'Full audit logs',
      'Advanced access controls',
      'Custom email setup',
      'Priority onboarding',
      'Dedicated success manager',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

interface PricingSectionProps {
  showHeading?: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ showHeading = true }) => {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[460px] h-[460px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[420px] h-[420px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <SectionHeading
            icon={Tag}
            pill="Pricing"
            title="Simple, Transparent Pricing"
            text="Start with the essentials for your team. Add the AI assistant, payroll, performance and hiring as you grow."
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
          {PLANS.map((plan, idx) => (
            <Reveal
              key={plan.name}
              delay={idx * 0.08}
              className={`relative rounded-3xl p-7 sm:p-8 flex flex-col border bg-white ${
                plan.featured
                  ? 'border-sky-500 ring-2 ring-sky-200 shadow-float'
                  : 'border-sky-100 shadow-card hover:border-sky-300 transition-colors'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold text-white bg-slate-950 px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-[20px] font-bold text-slate-950 mb-3">{plan.name}</h3>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-[40px] font-bold tracking-tight text-slate-950 leading-none tabular-nums">
                  {'priceNumber' in plan && plan.priceNumber ? <CountUp to={plan.priceNumber} prefix="$" /> : plan.price}
                </span>
                {plan.unit && <span className="text-[14px] text-slate-500">{plan.unit}</span>}
              </div>
              <p className="text-[14px] text-slate-600 leading-relaxed mb-6 min-h-[63px]">{plan.blurb}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-slate-700">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => navigate('/contact')}
                className={`mt-auto w-full py-3.5 px-4 rounded-xl text-[14px] font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 ${
                  plan.featured
                    ? 'bg-slate-950 text-white hover:bg-slate-800 shadow-sm'
                    : 'bg-sky-50 text-slate-950 border border-sky-200 hover:bg-sky-100/70'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
